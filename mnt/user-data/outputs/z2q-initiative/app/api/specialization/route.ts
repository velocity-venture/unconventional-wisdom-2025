// =============================================================================
// SPECIALIZATION SELECTION API ROUTE
// Processes specialization choice and credit rebound preference
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Environment configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Initialize Supabase with service role for admin operations
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Valid specialization tracks
const VALID_TRACKS = [
  'legal',
  'finance',
  'cybersecurity',
  'pharmaceuticals',
  'machine_learning',
  'logistics',
];

// =============================================================================
// API HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { student_id, specialization, credit_choice } = body;

    // Validate required fields
    if (!student_id || !specialization || !credit_choice) {
      return NextResponse.json(
        { error: 'Missing required fields: student_id, specialization, credit_choice' },
        { status: 400 }
      );
    }

    // Validate specialization track
    if (!VALID_TRACKS.includes(specialization)) {
      return NextResponse.json(
        { error: `Invalid specialization. Must be one of: ${VALID_TRACKS.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate credit choice
    if (!['apply_to_module', 'cash_back'].includes(credit_choice)) {
      return NextResponse.json(
        { error: 'Invalid credit_choice. Must be: apply_to_module or cash_back' },
        { status: 400 }
      );
    }

    // Verify student is at Level 1 (Foundation complete)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('knowledge_level, specialization')
      .eq('id', student_id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      );
    }

    if (profile.knowledge_level === '0') {
      return NextResponse.json(
        { error: 'Student must complete Foundation (Level 1) before selecting specialization' },
        { status: 403 }
      );
    }

    if (profile.specialization) {
      return NextResponse.json(
        { error: 'Specialization has already been selected', current: profile.specialization },
        { status: 409 }
      );
    }

    // Update profile with specialization
    const { error: updateProfileError } = await supabaseAdmin
      .from('profiles')
      .update({
        specialization,
        updated_at: new Date().toISOString(),
      })
      .eq('id', student_id);

    if (updateProfileError) {
      console.error('Failed to update profile:', updateProfileError);
      return NextResponse.json(
        { error: 'Failed to save specialization selection' },
        { status: 500 }
      );
    }

    // Get enrollment record
    const { data: enrollment, error: enrollmentError } = await supabaseAdmin
      .from('enrollments')
      .select('id, credit_rebound_eligible')
      .eq('profile_id', student_id)
      .single();

    if (enrollmentError || !enrollment) {
      console.error('Enrollment not found:', enrollmentError);
      return NextResponse.json(
        { error: 'Enrollment record not found' },
        { status: 404 }
      );
    }

    // Process credit rebound
    if (enrollment.credit_rebound_eligible) {
      // Update enrollment with credit choice
      await supabaseAdmin
        .from('enrollments')
        .update({
          credit_rebound_type: credit_choice,
          specialization_started_at: new Date().toISOString(),
        })
        .eq('id', enrollment.id);

      // Create credit transaction record
      const { error: transactionError } = await supabaseAdmin
        .from('credit_transactions')
        .insert({
          profile_id: student_id,
          enrollment_id: enrollment.id,
          amount: 300.00,
          transaction_type: credit_choice,
          description: credit_choice === 'apply_to_module'
            ? `Applied $300 credit to ${specialization} specialization track`
            : 'Cash back requested - $300 refund initiated',
          applied_to_specialization: credit_choice === 'apply_to_module' ? specialization : null,
          status: credit_choice === 'apply_to_module' ? 'processed' : 'pending',
          processed_at: credit_choice === 'apply_to_module' ? new Date().toISOString() : null,
        });

      if (transactionError) {
        console.error('Failed to create transaction:', transactionError);
      }

      // If cash back, trigger Stripe refund (would integrate with Stripe API)
      if (credit_choice === 'cash_back') {
        // TODO: Integrate with Stripe for actual refund
        // For now, we just mark it as pending
        console.log(`Cash back requested for student ${student_id}`);
      }
    }

    // Unlock specialization lessons for this student
    // Get all lessons for the selected specialization
    const { data: specLessons } = await supabaseAdmin
      .from('lessons')
      .select('id')
      .eq('specialization', specialization)
      .eq('is_active', true);

    if (specLessons && specLessons.length > 0) {
      // Create lesson_completion records with 'available' status for Month 7 only
      const month7Lessons = await supabaseAdmin
        .from('lessons')
        .select('id')
        .eq('specialization', specialization)
        .eq('month_number', 7);

      if (month7Lessons.data) {
        const completionRecords = month7Lessons.data.map((lesson) => ({
          profile_id: student_id,
          lesson_id: lesson.id,
          status: 'not_started',
          progress_percentage: 0,
        }));

        await supabaseAdmin
          .from('lesson_completions')
          .upsert(completionRecords, { onConflict: 'profile_id,lesson_id' });
      }
    }

    return NextResponse.json({
      success: true,
      specialization,
      credit_choice,
      message: `Specialization '${specialization}' selected successfully. ${
        credit_choice === 'apply_to_module'
          ? 'Credit has been applied to your module.'
          : 'Cash back request has been submitted.'
      }`,
    });

  } catch (error) {
    console.error('Specialization selection error:', error);
    return NextResponse.json(
      { error: 'Failed to process specialization selection' },
      { status: 500 }
    );
  }
}

// =============================================================================
// GET HANDLER - Check specialization status
// =============================================================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('student_id');

  if (!studentId) {
    return NextResponse.json(
      { error: 'student_id query parameter required' },
      { status: 400 }
    );
  }

  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('knowledge_level, specialization')
    .eq('id', studentId)
    .single();

  if (error || !profile) {
    return NextResponse.json(
      { error: 'Profile not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    knowledge_level: profile.knowledge_level,
    specialization: profile.specialization,
    can_select_specialization: profile.knowledge_level !== '0' && !profile.specialization,
  });
}
