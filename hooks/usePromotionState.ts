'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';

// =============================================================================
// USE PROMOTION STATE HOOK
// Manages the Foundation → Specialization transition with real-time updates
// =============================================================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Types
export type KnowledgeLevel = '0' | '1' | '2';
export type SpecializationTrack =
  | 'legal'
  | 'finance'
  | 'cybersecurity'
  | 'pharmaceuticals'
  | 'machine_learning'
  | 'logistics'
  | null;

export type CreditChoice = 'apply_to_module' | 'cash_back';

export interface PromotionState {
  // Student identity
  profileId: string | null;
  studentName: string;

  // Progression status
  knowledgeLevel: KnowledgeLevel;
  specialization: SpecializationTrack;
  
  // Foundation progress
  foundationProgress: number;
  foundationComplete: boolean;
  capstoneSubmitted: boolean;
  capstoneScore: number | null;

  // Credit status
  creditReboundEligible: boolean;
  creditReboundClaimed: boolean;
  creditChoice: CreditChoice | null;

  // UI state
  showLevelUpModal: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface PromotionActions {
  // Initialization
  initialize: (profileId: string) => Promise<void>;
  
  // Capstone
  submitCapstone: (submission: CapstoneSubmission) => Promise<CapstoneResult>;
  
  // Specialization
  selectSpecialization: (track: SpecializationTrack, creditChoice: CreditChoice) => Promise<void>;
  
  // Modal control
  openLevelUpModal: () => void;
  closeLevelUpModal: () => void;
  
  // Refresh
  refreshState: () => Promise<void>;
}

export interface CapstoneSubmission {
  submissionType: 'github' | 'code' | 'notebook';
  githubUrl?: string;
  codeContent?: string;
  projectDescription: string;
}

export interface CapstoneResult {
  passed: boolean;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  levelPromoted: boolean;
}

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

export function usePromotionState(): [PromotionState, PromotionActions] {
  const [state, setState] = useState<PromotionState>({
    profileId: null,
    studentName: '',
    knowledgeLevel: '0',
    specialization: null,
    foundationProgress: 0,
    foundationComplete: false,
    capstoneSubmitted: false,
    capstoneScore: null,
    creditReboundEligible: false,
    creditReboundClaimed: false,
    creditChoice: null,
    showLevelUpModal: false,
    isLoading: true,
    error: null,
  });

  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null);

  // ==========================================================================
  // INITIALIZE: Fetch initial state and set up real-time subscription
  // ==========================================================================
  const initialize = useCallback(async (profileId: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null, profileId }));

    try {
      // Fetch profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();

      if (profileError) throw profileError;

      // Fetch enrollment data
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('*')
        .eq('profile_id', profileId)
        .single();

      // Fetch foundation progress
      const { count: completedLessons } = await supabase
        .from('lesson_completions')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profileId)
        .eq('status', 'completed');

      // Fetch capstone submission if exists
      const { data: capstoneSubmission } = await supabase
        .from('capstone_submissions')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Calculate foundation progress (18 total lessons)
      const foundationProgress = Math.round(((completedLessons || 0) / 18) * 100);

      setState((prev) => ({
        ...prev,
        profileId,
        studentName: profile.full_name || 'Scholar',
        knowledgeLevel: profile.knowledge_level,
        specialization: profile.specialization,
        foundationProgress,
        foundationComplete: profile.knowledge_level !== '0',
        capstoneSubmitted: !!capstoneSubmission,
        capstoneScore: capstoneSubmission?.score || null,
        creditReboundEligible: enrollment?.credit_rebound_eligible || false,
        creditReboundClaimed: !!enrollment?.credit_rebound_issued_at,
        creditChoice: enrollment?.credit_rebound_type || null,
        isLoading: false,
      }));

      // Set up real-time subscription for profile changes
      const channel = supabase
        .channel(`profile-${profileId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${profileId}`,
          },
          (payload) => {
            const newProfile = payload.new as any;
            
            setState((prev) => {
              // Check if just promoted to Level 1
              const justPromoted =
                prev.knowledgeLevel === '0' && newProfile.knowledge_level === '1';

              return {
                ...prev,
                knowledgeLevel: newProfile.knowledge_level,
                specialization: newProfile.specialization,
                foundationComplete: newProfile.knowledge_level !== '0',
                // Auto-open Level Up modal on promotion
                showLevelUpModal: justPromoted ? true : prev.showLevelUpModal,
              };
            });
          }
        )
        .subscribe();

      setRealtimeChannel(channel);

    } catch (error) {
      console.error('Failed to initialize promotion state:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load student data',
      }));
    }
  }, []);

  // Clean up real-time subscription on unmount
  useEffect(() => {
    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, [realtimeChannel]);

  // ==========================================================================
  // SUBMIT CAPSTONE
  // ==========================================================================
  const submitCapstone = useCallback(
    async (submission: CapstoneSubmission): Promise<CapstoneResult> => {
      if (!state.profileId) {
        throw new Error('Profile not initialized');
      }

      const benchmarks = `
Z2Q FOUNDATION CAPSTONE BENCHMARKS:

1. QUANTUM CIRCUIT CONSTRUCTION (25 points)
2. MEASUREMENT & PROBABILITY (25 points)
3. CODE QUALITY & DOCUMENTATION (25 points)
4. CONCEPTUAL UNDERSTANDING (25 points)

PASSING THRESHOLD: 70/100 points
`;

      const response = await fetch('/api/capstone/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: state.profileId,
          submission_type: submission.submissionType,
          github_url: submission.githubUrl,
          code_content: submission.codeContent,
          project_description: submission.projectDescription,
          benchmarks,
        }),
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      // Update local state
      setState((prev) => ({
        ...prev,
        capstoneSubmitted: true,
        capstoneScore: result.score,
        // If promoted, the real-time subscription will handle modal
        creditReboundEligible: result.levelPromoted ? true : prev.creditReboundEligible,
      }));

      // If passed and promoted, show modal immediately (optimistic)
      if (result.passed && result.levelPromoted) {
        setState((prev) => ({
          ...prev,
          knowledgeLevel: '1',
          foundationComplete: true,
          showLevelUpModal: true,
        }));
      }

      return result;
    },
    [state.profileId]
  );

  // ==========================================================================
  // SELECT SPECIALIZATION
  // ==========================================================================
  const selectSpecialization = useCallback(
    async (track: SpecializationTrack, creditChoice: CreditChoice) => {
      if (!state.profileId || !track) {
        throw new Error('Profile or track not specified');
      }

      const response = await fetch('/api/specialization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: state.profileId,
          specialization: track,
          credit_choice: creditChoice,
        }),
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      // Update local state
      setState((prev) => ({
        ...prev,
        specialization: track,
        creditChoice,
        creditReboundClaimed: true,
        showLevelUpModal: false,
      }));
    },
    [state.profileId]
  );

  // ==========================================================================
  // MODAL CONTROLS
  // ==========================================================================
  const openLevelUpModal = useCallback(() => {
    setState((prev) => ({ ...prev, showLevelUpModal: true }));
  }, []);

  const closeLevelUpModal = useCallback(() => {
    setState((prev) => ({ ...prev, showLevelUpModal: false }));
  }, []);

  // ==========================================================================
  // REFRESH STATE
  // ==========================================================================
  const refreshState = useCallback(async () => {
    if (state.profileId) {
      await initialize(state.profileId);
    }
  }, [state.profileId, initialize]);

  // ==========================================================================
  // RETURN HOOK
  // ==========================================================================
  const actions: PromotionActions = {
    initialize,
    submitCapstone,
    selectSpecialization,
    openLevelUpModal,
    closeLevelUpModal,
    refreshState,
  };

  return [state, actions];
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export function getKnowledgeLevelLabel(level: KnowledgeLevel): string {
  const labels: Record<KnowledgeLevel, string> = {
    '0': 'Level 0 — Awareness',
    '1': 'Level 1 — Application',
    '2': 'Level 2 — Specialization',
  };
  return labels[level];
}

export function getSpecializationLabel(track: SpecializationTrack): string {
  if (!track) return 'Not Selected';
  
  const labels: Record<string, string> = {
    legal: 'Legal & IP Strategy',
    finance: 'Finance & Risk Intelligence',
    cybersecurity: 'Cybersecurity & PQC',
    pharmaceuticals: 'Pharmaceuticals & Discovery',
    machine_learning: 'Machine Learning & AI',
    logistics: 'Logistics & Supply Chain',
  };
  return labels[track] || track;
}

export function canAccessSpecialization(
  knowledgeLevel: KnowledgeLevel,
  specialization: SpecializationTrack,
  targetTrack: string
): 'enrolled' | 'audit' | 'locked' {
  // Level 0 cannot access any specialization
  if (knowledgeLevel === '0') return 'locked';
  
  // Level 1+ with matching specialization = enrolled
  if (specialization === targetTrack) return 'enrolled';
  
  // Level 1+ without specialization selected = all available
  if (!specialization) return 'enrolled';
  
  // Level 1+ with different specialization = audit only
  return 'audit';
}
