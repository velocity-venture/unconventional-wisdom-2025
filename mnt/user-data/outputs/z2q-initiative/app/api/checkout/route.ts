// =============================================================================
// STRIPE CHECKOUT SESSION API
// Creates checkout sessions with duplicate prevention
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { STRIPE_URLS, Z2Q_FULL_URL } from '@/lib/urls';

// =============================================================================
// CONFIGURATION
// =============================================================================

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Z2Q Price ID
const Z2Q_PRICE_ID = 'price_1Si3mNI3wsIEE2uCkXfbxAvJ';

// Initialize Supabase Admin
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// =============================================================================
// POST: Create Checkout Session
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    // ==========================================================================
    // DUPLICATE PREVENTION: Check if email already enrolled
    // ==========================================================================

    if (email) {
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select(`
          id,
          email,
          enrollments (
            id,
            payment_status
          )
        `)
        .eq('email', email)
        .single();

      // If profile exists with paid enrollment, redirect to dashboard
      if (existingProfile?.enrollments?.some((e: any) => e.payment_status === 'paid')) {
        return NextResponse.json({
          status: 'already_enrolled',
          message: 'You are already enrolled in Z2Q!',
          redirect: '/dashboard',
        });
      }
    }

    // ==========================================================================
    // CREATE STRIPE CHECKOUT SESSION
    // ==========================================================================

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: Z2Q_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: STRIPE_URLS.success,
      cancel_url: STRIPE_URLS.cancel,
      
      // Customer info
      customer_email: email || undefined,
      
      // Metadata for webhook processing
      metadata: {
        product: 'z2q_initiative',
        customer_name: name || 'Scholar',
      },

      // Collect billing address for compliance
      billing_address_collection: 'required',

      // Allow promotion codes
      allow_promotion_codes: true,

      // Custom branding
      custom_text: {
        submit: {
          message: 'Your $300 Credit Rebound awaits upon Foundation completion.',
        },
      },
    };

    // If we have an existing Stripe customer, use it
    if (email) {
      const existingCustomers = await stripe.customers.list({
        email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        sessionParams.customer = existingCustomers.data[0].id;
        delete sessionParams.customer_email;
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({
      status: 'success',
      sessionId: session.id,
      url: session.url,
    });

  } catch (error: any) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// =============================================================================
// GET: Check enrollment status
// =============================================================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'Email parameter required' },
      { status: 400 }
    );
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select(`
      id,
      email,
      knowledge_level,
      enrollments (
        id,
        payment_status,
        enrolled_at
      )
    `)
    .eq('email', email)
    .single();

  if (!profile) {
    return NextResponse.json({
      enrolled: false,
      message: 'No enrollment found',
    });
  }

  const hasActiveEnrollment = profile.enrollments?.some(
    (e: any) => e.payment_status === 'paid'
  );

  return NextResponse.json({
    enrolled: hasActiveEnrollment,
    profile_id: hasActiveEnrollment ? profile.id : null,
    knowledge_level: profile.knowledge_level,
    redirect: hasActiveEnrollment ? '/dashboard' : null,
  });
}
