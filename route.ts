// =============================================================================
// STRIPE WEBHOOK HANDLER (Next.js 15 / App Router)
// Endpoint: https://uw.sayada.ai/z2q/api/webhooks/stripe
// =============================================================================
// CRITICAL: Uses request.text() for raw body - NEVER use request.json()
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { generateWelcomeEmailHtml } from '@/components/WelcomeEmail';
import { Z2Q_URLS } from '@/lib/urls';

// =============================================================================
// CONFIGURATION (Sandbox Credentials for Smoke Test)
// =============================================================================

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia', // Latest 2025 API version
});

// Environment Variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Z2Q Product/Price IDs
const Z2Q_PRICE_ID = 'price_1Si3mNI3wsIEE2uCkXfbxAvJ';
const Z2Q_PRODUCT_ID = 'prod_TfOZoziWZb6QYG';

// Initialize Supabase Admin Client (bypasses RLS)
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// =============================================================================
// WEBHOOK HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  // ===========================================================================
  // STEP 1: Capture RAW Body (CRITICAL - Do NOT use request.json())
  // ===========================================================================
  
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('[Stripe Webhook] Missing stripe-signature header');
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  // ===========================================================================
  // STEP 2: Verify Stripe Signature
  // ===========================================================================
  
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Stripe Webhook] Signature verification failed:', message);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  // ===========================================================================
  // STEP 3: Acknowledge Receipt Immediately
  // Return 200 early to prevent Stripe timeout (Stripe expects response < 10s)
  // ===========================================================================
  
  console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

  // ===========================================================================
  // STEP 4: Handle Event Types
  // ===========================================================================

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Verify payment was successful
        if (session.payment_status !== 'paid') {
          console.log(`[Stripe Webhook] Payment not completed: ${session.payment_status}`);
          return NextResponse.json({ 
            received: true, 
            status: 'payment_pending',
            payment_status: session.payment_status,
          });
        }

        // Process the successful checkout
        const result = await handleCheckoutCompleted(session);
        return NextResponse.json({ received: true, ...result });
      }

      case 'checkout.session.async_payment_succeeded': {
        // Handle delayed payment methods (bank transfers, etc.)
        const session = event.data.object as Stripe.Checkout.Session;
        const result = await handleCheckoutCompleted(session);
        return NextResponse.json({ received: true, ...result });
      }

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`[Stripe Webhook] Async payment failed: ${session.id}`);
        // Could update enrollment status to 'payment_failed'
        return NextResponse.json({ received: true, status: 'payment_failed' });
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        await handleRefund(charge);
        return NextResponse.json({ received: true, status: 'refund_processed' });
      }

      default:
        // Acknowledge unknown events (don't fail)
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        return NextResponse.json({ received: true, status: 'unhandled_event' });
    }
  } catch (error) {
    console.error('[Stripe Webhook] Processing error:', error);
    // Return 200 to prevent Stripe from retrying (we'll handle manually)
    return NextResponse.json({ 
      received: true, 
      status: 'error_logged',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// =============================================================================
// CHECKOUT COMPLETED HANDLER
// =============================================================================

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<{ status: string; profile_id?: string; enrollment_id?: string }> {
  
  const sessionId = session.id;
  const customerEmail = session.customer_details?.email;
  const customerName = session.customer_details?.name || 'Scholar';
  const stripeCustomerId = typeof session.customer === 'string' 
    ? session.customer 
    : session.customer?.id;
  const amountPaid = session.amount_total ? session.amount_total / 100 : 997;

  console.log(`[Checkout] Processing session ${sessionId} for ${customerEmail}`);

  // ===========================================================================
  // IDEMPOTENCY CHECK: Prevent Double Delivery
  // ===========================================================================

  const { data: existingEnrollment } = await supabaseAdmin
    .from('enrollments')
    .select('id, profile_id')
    .eq('stripe_session_id', sessionId)
    .maybeSingle();

  if (existingEnrollment) {
    console.log(`[Checkout] Session ${sessionId} already processed (idempotent)`);
    return { 
      status: 'already_processed', 
      enrollment_id: existingEnrollment.id,
      profile_id: existingEnrollment.profile_id,
    };
  }

  // ===========================================================================
  // VALIDATE EMAIL
  // ===========================================================================

  if (!customerEmail) {
    console.error(`[Checkout] No email in session ${sessionId}`);
    throw new Error('Customer email is required');
  }

  // ===========================================================================
  // STEP 1: Create or Update Profile
  // ===========================================================================

  let profileId: string;

  // Check for existing profile by email
  const { data: existingProfile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('email', customerEmail)
    .maybeSingle();

  if (existingProfile) {
    // Update existing profile
    profileId = existingProfile.id;
    
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        full_name: customerName,
        stripe_customer_id: stripeCustomerId,
        knowledge_level: '0', // Reset/Set to Level 0 (Foundation)
        updated_at: new Date().toISOString(),
      })
      .eq('id', profileId);

    if (updateError) {
      console.error(`[Checkout] Profile update error:`, updateError);
      throw updateError;
    }
    
    console.log(`[Checkout] Updated existing profile: ${profileId}`);
  } else {
    // Create new profile
    const { data: newProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        email: customerEmail,
        full_name: customerName,
        knowledge_level: '0', // Start at Level 0 (Foundation)
        specialization: null,
        stripe_customer_id: stripeCustomerId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (profileError) {
      // Handle unique constraint violation (race condition)
      if (profileError.code === '23505') {
        const { data: raceProfile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('email', customerEmail)
          .single();
        
        if (raceProfile) {
          profileId = raceProfile.id;
          console.log(`[Checkout] Profile created in race condition: ${profileId}`);
        } else {
          throw profileError;
        }
      } else {
        throw profileError;
      }
    } else {
      profileId = newProfile.id;
      console.log(`[Checkout] Created new profile: ${profileId}`);
    }
  }

  // ===========================================================================
  // STEP 2: Create Enrollment Record
  // ===========================================================================

  const { data: enrollment, error: enrollmentError } = await supabaseAdmin
    .from('enrollments')
    .insert({
      profile_id: profileId,
      stripe_session_id: sessionId,
      stripe_customer_id: stripeCustomerId,
      price_id: Z2Q_PRICE_ID,
      product_id: Z2Q_PRODUCT_ID,
      amount_paid: amountPaid,
      currency: session.currency || 'usd',
      payment_status: 'paid',
      enrolled_at: new Date().toISOString(),
      orientation_completed_at: null,
      credit_rebound_eligible: false,
      credit_rebound_type: null,
      foundation_completed_at: null,
      specialization_started_at: null,
    })
    .select('id')
    .single();

  if (enrollmentError) {
    // Handle duplicate (idempotency via unique constraint)
    if (enrollmentError.code === '23505') {
      console.log(`[Checkout] Enrollment already exists (unique constraint)`);
      const { data: existingEnroll } = await supabaseAdmin
        .from('enrollments')
        .select('id')
        .eq('stripe_session_id', sessionId)
        .single();
      
      return { 
        status: 'already_processed', 
        profile_id: profileId,
        enrollment_id: existingEnroll?.id,
      };
    }
    throw enrollmentError;
  }

  console.log(`[Checkout] Created enrollment: ${enrollment.id}`);

  // ===========================================================================
  // STEP 3: Log Payment Transaction
  // ===========================================================================

  await supabaseAdmin
    .from('payment_transactions')
    .insert({
      profile_id: profileId,
      enrollment_id: enrollment.id,
      stripe_session_id: sessionId,
      stripe_customer_id: stripeCustomerId,
      amount: amountPaid,
      currency: session.currency || 'usd',
      status: 'completed',
      transaction_type: 'enrollment',
      created_at: new Date().toISOString(),
    })
    .catch((err) => console.error('[Checkout] Transaction log error:', err));

  // ===========================================================================
  // STEP 4: Send Welcome Email
  // ===========================================================================

  try {
    await sendWelcomeEmail(customerEmail, customerName, new Date().toISOString());
    console.log(`[Checkout] Welcome email sent to ${customerEmail}`);
  } catch (emailError) {
    // Don't fail the webhook if email fails
    console.error('[Checkout] Welcome email error:', emailError);
  }

  // ===========================================================================
  // SUCCESS
  // ===========================================================================

  return {
    status: 'success',
    profile_id: profileId,
    enrollment_id: enrollment.id,
  };
}

// =============================================================================
// REFUND HANDLER
// =============================================================================

async function handleRefund(charge: Stripe.Charge): Promise<void> {
  const stripeCustomerId = typeof charge.customer === 'string' 
    ? charge.customer 
    : charge.customer?.id;

  if (!stripeCustomerId) {
    console.log('[Refund] No customer ID in charge');
    return;
  }

  // Find enrollment by customer ID
  const { data: enrollment } = await supabaseAdmin
    .from('enrollments')
    .select('id, profile_id')
    .eq('stripe_customer_id', stripeCustomerId)
    .maybeSingle();

  if (enrollment) {
    // Update enrollment status
    await supabaseAdmin
      .from('enrollments')
      .update({ payment_status: 'refunded' })
      .eq('id', enrollment.id);

    // Log refund transaction
    await supabaseAdmin
      .from('payment_transactions')
      .insert({
        profile_id: enrollment.profile_id,
        enrollment_id: enrollment.id,
        stripe_charge_id: charge.id,
        stripe_customer_id: stripeCustomerId,
        amount: (charge.amount_refunded || 0) / 100,
        currency: charge.currency,
        status: 'refunded',
        transaction_type: 'refund',
        created_at: new Date().toISOString(),
      });

    console.log(`[Refund] Processed refund for enrollment ${enrollment.id}`);
  }
}

// =============================================================================
// WELCOME EMAIL (via Resend)
// =============================================================================

async function sendWelcomeEmail(
  email: string,
  name: string,
  enrollmentDate: string
): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not configured, skipping email');
    return;
  }

  const html = generateWelcomeEmailHtml({
    studentName: name,
    enrollmentDate: new Date(enrollmentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    dashboardUrl: Z2Q_URLS.dashboard,
  });

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Z2Q Academy <hello@uw.sayada.ai>',
      to: email,
      subject: 'Welcome to Z2Q | Your Quantum Journey Begins',
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }
}

// =============================================================================
// EXPORT CONFIG (Next.js 15)
// =============================================================================

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
