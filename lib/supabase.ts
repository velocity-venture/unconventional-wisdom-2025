// =============================================================================
// Z2Q INITIATIVE - SUPABASE & N8N INTEGRATION
// Client utilities for database access and AI webhook communication
// =============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_B7lTubvtJ8zel25XdjDWvQ_r_X3CF9r';

// n8n VPS webhook endpoint
const N8N_WEBHOOK_URL = 'http://72.62.82.174/zero2quantum';

// =============================================================================
// SUPABASE CLIENT
// =============================================================================

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    });
  }
  return supabaseInstance;
}

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type KnowledgeLevel = '0' | '1' | '2';

export type SpecializationTrack = 
  | 'legal'
  | 'finance'
  | 'cybersecurity'
  | 'pharmaceuticals'
  | 'machine_learning'
  | 'logistics';

export interface StudentProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  title: string | null;
  company: string | null;
  knowledge_level: KnowledgeLevel;
  specialization: SpecializationTrack | null;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  month_number: number;
  lesson_order: number;
  is_foundation: boolean;
  specialization: SpecializationTrack | null;
  required_level: KnowledgeLevel;
}

export interface AIInteractionRequest {
  student_id: string;
  current_lesson: string;
  message: string;
}

export interface AIInteractionResponse {
  reply: string;
  suggested_action: string;
  credit_balance: number;
}

// =============================================================================
// N8N WEBHOOK INTEGRATION
// Communicates with Claude 4.5 Socratic AI Tutor
// =============================================================================

/**
 * Send a message to the Z2Q AI Tutor via n8n webhook
 * 
 * The n8n workflow:
 * 1. Receives POST with { student_id, current_lesson, message }
 * 2. Fetches student's knowledge_level from Supabase profiles
 * 3. Constructs context-aware prompt for Claude 4.5
 * 4. Returns JSON: { reply, suggested_action, credit_balance }
 * 
 * @param request - Student message and context
 * @returns AI tutor response with suggested actions
 */
export async function sendToAITutor(
  request: AIInteractionRequest
): Promise<AIInteractionResponse> {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student_id: request.student_id,
        current_lesson: request.current_lesson,
        message: request.message,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status} ${response.statusText}`);
    }

    const data: AIInteractionResponse = await response.json();
    return data;
  } catch (error) {
    console.error('AI Tutor error:', error);
    // Return graceful fallback
    return {
      reply: 'I apologize, but I am temporarily unable to process your question. Please try again in a moment.',
      suggested_action: 'retry',
      credit_balance: 0,
    };
  }
}

// =============================================================================
// DATABASE QUERIES
// =============================================================================

/**
 * Fetch student profile by user ID
 */
export async function getStudentProfile(userId: string): Promise<StudentProfile | null> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data as StudentProfile;
}

/**
 * Fetch lessons for a specific month
 */
export async function getLessonsForMonth(
  monthNumber: number,
  specialization?: SpecializationTrack
): Promise<Lesson[]> {
  const supabase = getSupabaseClient();
  
  let query = supabase
    .from('lessons')
    .select('*')
    .eq('month_number', monthNumber)
    .eq('is_active', true)
    .order('lesson_order', { ascending: true });
  
  // For months 7-12, filter by specialization
  if (monthNumber > 6 && specialization) {
    query = query.eq('specialization', specialization);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching lessons:', error);
    return [];
  }
  
  return data as Lesson[];
}

/**
 * Update student's knowledge level
 */
export async function updateKnowledgeLevel(
  profileId: string,
  newLevel: KnowledgeLevel
): Promise<boolean> {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase
    .from('profiles')
    .update({ knowledge_level: newLevel })
    .eq('id', profileId);
  
  if (error) {
    console.error('Error updating knowledge level:', error);
    return false;
  }
  
  return true;
}

/**
 * Log AI interaction to database
 */
export async function logAIInteraction(
  profileId: string,
  lessonId: string | null,
  studentMessage: string,
  aiResponse: AIInteractionResponse,
  knowledgeLevelAtTime: KnowledgeLevel,
  lessonSlug: string
): Promise<void> {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase.from('ai_interactions').insert({
    profile_id: profileId,
    lesson_id: lessonId,
    student_message: studentMessage,
    ai_response: aiResponse.reply,
    suggested_action: aiResponse.suggested_action,
    knowledge_level_at_time: knowledgeLevelAtTime,
    lesson_slug: lessonSlug,
  });
  
  if (error) {
    console.error('Error logging AI interaction:', error);
  }
}

/**
 * Record white paper download (lead magnet)
 */
export async function recordLeadMagnetDownload(
  email: string,
  fullName: string | null,
  title: string | null,
  assetName: string = 'quantum_legal_whitepaper',
  utmParams?: { campaign?: string; medium?: string; source?: string }
): Promise<boolean> {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase.from('lead_magnets').insert({
    email,
    full_name: fullName,
    title,
    asset_name: assetName,
    utm_campaign: utmParams?.campaign,
    utm_medium: utmParams?.medium,
    utm_source: utmParams?.source,
    source_url: typeof window !== 'undefined' ? window.location.href : null,
  });
  
  if (error) {
    // Handle duplicate downloads gracefully
    if (error.code === '23505') {
      console.log('Lead already exists for this asset');
      return true;
    }
    console.error('Error recording lead:', error);
    return false;
  }
  
  return true;
}

// =============================================================================
// PROGRESS CALCULATIONS
// =============================================================================

/**
 * Calculate student's progress percentage
 */
export async function calculateProgress(
  profileId: string,
  specialization?: SpecializationTrack
): Promise<{ completed: number; total: number; percentage: number }> {
  const supabase = getSupabaseClient();
  
  // Get completed lessons count
  const { count: completed } = await supabase
    .from('lesson_completions')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', profileId)
    .eq('status', 'completed');
  
  // Get total available lessons
  let totalQuery = supabase
    .from('lessons')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);
  
  if (specialization) {
    totalQuery = totalQuery.or(`is_foundation.eq.true,specialization.eq.${specialization}`);
  } else {
    totalQuery = totalQuery.eq('is_foundation', true);
  }
  
  const { count: total } = await totalQuery;
  
  const completedCount = completed || 0;
  const totalCount = total || 1; // Avoid division by zero
  const percentage = Math.round((completedCount / totalCount) * 100);
  
  return {
    completed: completedCount,
    total: totalCount,
    percentage,
  };
}

// =============================================================================
// HOOKS FOR REACT COMPONENTS
// =============================================================================

/**
 * Get knowledge level label
 */
export function getKnowledgeLevelLabel(level: KnowledgeLevel): string {
  const labels: Record<KnowledgeLevel, string> = {
    '0': 'Level 0 - Quantum Awareness',
    '1': 'Level 1 - Quantum Application',
    '2': 'Level 2 - Quantum Specialization',
  };
  return labels[level];
}

/**
 * Get specialization display name
 */
export function getSpecializationLabel(track: SpecializationTrack): string {
  const labels: Record<SpecializationTrack, string> = {
    legal: 'Legal & IP Strategy',
    finance: 'Finance & Risk Intelligence',
    cybersecurity: 'Cybersecurity & PQC',
    pharmaceuticals: 'Pharmaceuticals & Discovery',
    machine_learning: 'Machine Learning & AI',
    logistics: 'Logistics & Supply Chain',
  };
  return labels[track];
}
