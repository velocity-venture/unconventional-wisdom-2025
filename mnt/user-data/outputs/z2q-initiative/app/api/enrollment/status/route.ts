// =============================================================================
// ENROLLMENT STATUS API
// Used by success page to check if webhook has processed
// Prevents double-delivery race conditions from client side
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// =============================================================================
// GET: Check enrollment status by session_id
// =============================================================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'session_id parameter required' },
      { status: 400 }
    );
  }

  // Check if enrollment exists for this session
  const { data: enrollment, error } = await supabaseAdmin
    .from('enrollments')
    .select(`
      id,
      profile_id,
      payment_status,
      enrolled_at,
      orientation_completed_at,
      profiles (
        id,
        email,
        full_name,
        knowledge_level
      )
    `)
    .eq('stripe_session_id', sessionId)
    .maybeSingle();

  if (error) {
    console.error('[Enrollment Status] Query error:', error);
    return NextResponse.json(
      { error: 'Failed to check enrollment status' },
      { status: 500 }
    );
  }

  if (!enrollment) {
    // Webhook hasn't processed yet
    return NextResponse.json({
      status: 'pending',
      message: 'Enrollment is being processed...',
      processed: false,
    });
  }

  // Enrollment exists
  return NextResponse.json({
    status: 'completed',
    processed: true,
    enrollment: {
      id: enrollment.id,
      profile_id: enrollment.profile_id,
      payment_status: enrollment.payment_status,
      enrolled_at: enrollment.enrolled_at,
      orientation_completed: !!enrollment.orientation_completed_at,
    },
    profile: enrollment.profiles,
    redirect: '/dashboard',
  });
}

// =============================================================================
// EXPORT CONFIG
// =============================================================================

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
