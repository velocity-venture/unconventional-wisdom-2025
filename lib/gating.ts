// =============================================================================
// Z2Q GATING LOGIC
// Enforces the Foundation → Specialization progression
// Students MUST complete Level 0 before accessing Level 1/2 content
// =============================================================================

import { getSupabaseClient } from './supabase';

// =============================================================================
// TYPES
// =============================================================================

export type KnowledgeLevel = '0' | '1' | '2';

export interface GatingStatus {
  currentLevel: KnowledgeLevel;
  foundationComplete: boolean;
  foundationProgress: number; // 0-100
  specializationUnlocked: boolean;
  creditReboundEligible: boolean;
  creditReboundClaimed: boolean;
  nextMilestone: string;
}

export interface LessonAccess {
  canAccess: boolean;
  reason: string;
  requiredLevel: KnowledgeLevel;
  currentLevel: KnowledgeLevel;
}

// =============================================================================
// FOUNDATION REQUIREMENTS
// =============================================================================

// Minimum lessons required to complete Foundation (Level 0 → Level 1)
const FOUNDATION_LESSON_THRESHOLD = 15; // Out of ~18 total foundation lessons

// Lessons per month in Foundation
const FOUNDATION_STRUCTURE = {
  1: { title: 'Foundation Building', lessonCount: 3 },
  2: { title: 'Quantum Concepts', lessonCount: 3 },
  3: { title: 'Quantum Circuits', lessonCount: 3 },
  4: { title: 'Core Algorithms', lessonCount: 3 },
  5: { title: 'Qiskit Mastery', lessonCount: 3 },
  6: { title: 'Industry Readiness', lessonCount: 3, hasCapstone: true },
};

const TOTAL_FOUNDATION_LESSONS = Object.values(FOUNDATION_STRUCTURE).reduce(
  (sum, month) => sum + month.lessonCount,
  0
);

// =============================================================================
// CHECK GATING STATUS
// =============================================================================

/**
 * Get the complete gating status for a student
 * This determines what content they can access
 */
export async function getGatingStatus(profileId: string): Promise<GatingStatus> {
  const supabase = getSupabaseClient();

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('knowledge_level')
    .eq('id', profileId)
    .single();

  if (profileError || !profile) {
    return {
      currentLevel: '0',
      foundationComplete: false,
      foundationProgress: 0,
      specializationUnlocked: false,
      creditReboundEligible: false,
      creditReboundClaimed: false,
      nextMilestone: 'Start Month 1: Python & Linear Algebra',
    };
  }

  // Count completed foundation lessons
  const { count: completedFoundation } = await supabase
    .from('lesson_completions')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', profileId)
    .eq('status', 'completed')
    .in('lesson_id', await getFoundationLessonIds());

  const foundationCount = completedFoundation || 0;
  const foundationProgress = Math.round((foundationCount / TOTAL_FOUNDATION_LESSONS) * 100);
  const foundationComplete = foundationCount >= FOUNDATION_LESSON_THRESHOLD;

  // Check enrollment for credit rebound status
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('credit_rebound_eligible, credit_rebound_issued_at')
    .eq('profile_id', profileId)
    .single();

  const creditReboundEligible = enrollment?.credit_rebound_eligible || false;
  const creditReboundClaimed = !!enrollment?.credit_rebound_issued_at;

  // Determine next milestone
  const nextMilestone = getNextMilestone(
    profile.knowledge_level,
    foundationCount,
    foundationComplete
  );

  return {
    currentLevel: profile.knowledge_level,
    foundationComplete,
    foundationProgress,
    specializationUnlocked: profile.knowledge_level !== '0',
    creditReboundEligible,
    creditReboundClaimed,
    nextMilestone,
  };
}

// =============================================================================
// CHECK LESSON ACCESS
// =============================================================================

/**
 * Determine if a student can access a specific lesson
 * Enforces the gating rules
 */
export async function checkLessonAccess(
  profileId: string,
  lessonId: string
): Promise<LessonAccess> {
  const supabase = getSupabaseClient();

  // Get lesson requirements
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('required_level, is_foundation, specialization, month_number')
    .eq('id', lessonId)
    .single();

  if (lessonError || !lesson) {
    return {
      canAccess: false,
      reason: 'Lesson not found',
      requiredLevel: '0',
      currentLevel: '0',
    };
  }

  // Get student's current level
  const { data: profile } = await supabase
    .from('profiles')
    .select('knowledge_level')
    .eq('id', profileId)
    .single();

  const currentLevel = profile?.knowledge_level || '0';
  const requiredLevel = lesson.required_level;

  // CORE GATING RULE: Specialization requires Level 1
  if (!lesson.is_foundation && currentLevel === '0') {
    return {
      canAccess: false,
      reason: `Specialization content requires Level 1 (Foundation Complete). You are currently Level 0. Complete the Foundation phase first.`,
      requiredLevel: '1',
      currentLevel,
    };
  }

  // Check if required level is met
  const levelOrder = ['0', '1', '2'];
  const currentIndex = levelOrder.indexOf(currentLevel);
  const requiredIndex = levelOrder.indexOf(requiredLevel);

  if (currentIndex < requiredIndex) {
    return {
      canAccess: false,
      reason: `This lesson requires Level ${requiredLevel}. You are currently Level ${currentLevel}.`,
      requiredLevel,
      currentLevel,
    };
  }

  // Check month sequencing within Foundation
  if (lesson.is_foundation) {
    const monthAccess = await checkMonthAccess(profileId, lesson.month_number);
    if (!monthAccess.canAccess) {
      return {
        canAccess: false,
        reason: monthAccess.reason,
        requiredLevel,
        currentLevel,
      };
    }
  }

  return {
    canAccess: true,
    reason: 'Access granted',
    requiredLevel,
    currentLevel,
  };
}

// =============================================================================
// CHECK MONTH ACCESS (SEQUENTIAL GATING)
// =============================================================================

/**
 * Check if a student can access a specific month
 * Months unlock sequentially: must complete 2/3 lessons in previous month
 */
async function checkMonthAccess(
  profileId: string,
  monthNumber: number
): Promise<{ canAccess: boolean; reason: string }> {
  // Month 1 is always accessible
  if (monthNumber === 1) {
    return { canAccess: true, reason: 'Month 1 is always accessible' };
  }

  const supabase = getSupabaseClient();
  const previousMonth = monthNumber - 1;

  // Get lessons from previous month
  const { data: previousMonthLessons } = await supabase
    .from('lessons')
    .select('id')
    .eq('month_number', previousMonth)
    .eq('is_foundation', true);

  const previousLessonIds = previousMonthLessons?.map((l) => l.id) || [];

  // Count completed lessons from previous month
  const { count: completedCount } = await supabase
    .from('lesson_completions')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', profileId)
    .eq('status', 'completed')
    .in('lesson_id', previousLessonIds);

  const completed = completedCount || 0;
  const required = Math.ceil(previousLessonIds.length * 0.66); // 66% threshold

  if (completed < required) {
    return {
      canAccess: false,
      reason: `Complete at least ${required} lessons in Month ${previousMonth} to unlock Month ${monthNumber}. Currently: ${completed}/${previousLessonIds.length}`,
    };
  }

  return { canAccess: true, reason: 'Previous month requirements met' };
}

// =============================================================================
// PROMOTE KNOWLEDGE LEVEL
// =============================================================================

/**
 * Check if student qualifies for level promotion and execute it
 * Called after lesson completion
 */
export async function checkAndPromoteLevel(profileId: string): Promise<{
  promoted: boolean;
  newLevel: KnowledgeLevel | null;
  creditReboundUnlocked: boolean;
}> {
  const supabase = getSupabaseClient();

  // Get current level
  const { data: profile } = await supabase
    .from('profiles')
    .select('knowledge_level, specialization')
    .eq('id', profileId)
    .single();

  if (!profile) {
    return { promoted: false, newLevel: null, creditReboundUnlocked: false };
  }

  const currentLevel = profile.knowledge_level;

  // Level 0 → Level 1: Complete Foundation
  if (currentLevel === '0') {
    const { count: foundationComplete } = await supabase
      .from('lesson_completions')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profileId)
      .eq('status', 'completed');

    // Check if foundation is complete (includes capstone)
    const capstoneComplete = await isCapstoneComplete(profileId);

    if ((foundationComplete || 0) >= FOUNDATION_LESSON_THRESHOLD && capstoneComplete) {
      // PROMOTE TO LEVEL 1
      await supabase
        .from('profiles')
        .update({ knowledge_level: '1' })
        .eq('id', profileId);

      // Mark credit rebound eligible
      await supabase
        .from('enrollments')
        .update({ 
          credit_rebound_eligible: true,
          foundation_completed_at: new Date().toISOString()
        })
        .eq('profile_id', profileId);

      return {
        promoted: true,
        newLevel: '1',
        creditReboundUnlocked: true,
      };
    }
  }

  // Level 1 → Level 2: Complete Specialization
  if (currentLevel === '1' && profile.specialization) {
    const { count: specComplete } = await supabase
      .from('lesson_completions')
      .select('lesson_id', { count: 'exact', head: true })
      .eq('profile_id', profileId)
      .eq('status', 'completed');

    // Check specialization capstone
    const specCapstoneComplete = await isSpecializationCapstoneComplete(
      profileId,
      profile.specialization
    );

    if ((specComplete || 0) >= 20 && specCapstoneComplete) {
      // PROMOTE TO LEVEL 2
      await supabase
        .from('profiles')
        .update({ knowledge_level: '2' })
        .eq('id', profileId);

      await supabase
        .from('enrollments')
        .update({ specialization_completed_at: new Date().toISOString() })
        .eq('profile_id', profileId);

      return {
        promoted: true,
        newLevel: '2',
        creditReboundUnlocked: false,
      };
    }
  }

  return { promoted: false, newLevel: null, creditReboundUnlocked: false };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

async function getFoundationLessonIds(): Promise<string[]> {
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from('lessons')
    .select('id')
    .eq('is_foundation', true);
  return data?.map((l) => l.id) || [];
}

async function isCapstoneComplete(profileId: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from('lesson_completions')
    .select('status')
    .eq('profile_id', profileId)
    .eq('status', 'completed')
    .single();

  // Check for foundation capstone lesson
  const { data: capstone } = await supabase
    .from('lessons')
    .select('id')
    .eq('slug', 'm6-foundation-capstone')
    .single();

  if (!capstone) return true; // No capstone defined, skip check

  const { data: completion } = await supabase
    .from('lesson_completions')
    .select('status')
    .eq('profile_id', profileId)
    .eq('lesson_id', capstone.id)
    .eq('status', 'completed')
    .single();

  return !!completion;
}

async function isSpecializationCapstoneComplete(
  profileId: string,
  specialization: string
): Promise<boolean> {
  const supabase = getSupabaseClient();
  
  const { data: capstone } = await supabase
    .from('lessons')
    .select('id')
    .eq('specialization', specialization)
    .eq('month_number', 12)
    .single();

  if (!capstone) return true;

  const { data: completion } = await supabase
    .from('lesson_completions')
    .select('status')
    .eq('profile_id', profileId)
    .eq('lesson_id', capstone.id)
    .eq('status', 'completed')
    .single();

  return !!completion;
}

function getNextMilestone(
  level: KnowledgeLevel,
  foundationComplete: number,
  isFoundationComplete: boolean
): string {
  if (level === '0') {
    if (foundationComplete === 0) {
      return 'Start Month 1: Python & Linear Algebra';
    }
    if (foundationComplete < 6) {
      return 'Complete Month 2: Quantum Concepts';
    }
    if (foundationComplete < 9) {
      return 'Complete Month 3: Quantum Circuits';
    }
    if (foundationComplete < 12) {
      return 'Complete Month 4: Core Algorithms';
    }
    if (foundationComplete < 15) {
      return 'Complete Month 5: Qiskit Mastery';
    }
    if (!isFoundationComplete) {
      return 'Complete Month 6 Capstone to unlock Specialization';
    }
    return 'Choose your Specialization track!';
  }

  if (level === '1') {
    return 'Complete your Specialization track';
  }

  return 'Level 2 Complete — You are Quantum Ready!';
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  FOUNDATION_LESSON_THRESHOLD,
  FOUNDATION_STRUCTURE,
  TOTAL_FOUNDATION_LESSONS,
};
