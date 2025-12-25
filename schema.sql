-- =============================================================================
-- Z2Q INITIATIVE - SUPABASE DATABASE SCHEMA
-- Purpose: Track student progression from Level 0 to Level 2
-- Author: Unconventional Wisdom Engineering Team
-- =============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- ENUM TYPES
-- =============================================================================

-- Knowledge Level progression (core Z2Q metric)
CREATE TYPE knowledge_level AS ENUM ('0', '1', '2');

-- Specialization tracks available in months 7-12
CREATE TYPE specialization_track AS ENUM (
  'legal',
  'finance', 
  'cybersecurity',
  'pharmaceuticals',
  'machine_learning',
  'logistics'
);

-- Enrollment status lifecycle
CREATE TYPE enrollment_status AS ENUM (
  'pending',
  'active',
  'paused',
  'completed',
  'refunded'
);

-- Lesson completion status
CREATE TYPE completion_status AS ENUM (
  'not_started',
  'in_progress',
  'completed',
  'needs_review'
);

-- Credit rebound type
CREATE TYPE credit_type AS ENUM (
  'cash_back',
  'specialization_credit',
  'pending'
);

-- =============================================================================
-- PROFILES TABLE
-- Core student profile with knowledge level tracking
-- =============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Auth reference (Supabase Auth user)
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic info
  email TEXT NOT NULL,
  full_name TEXT,
  title TEXT,                          -- e.g., "Partner", "CTO", "Director"
  company TEXT,
  
  -- Z2Q Progression (critical field for n8n webhook)
  knowledge_level knowledge_level DEFAULT '0',
  
  -- Selected specialization (chosen after month 6)
  specialization specialization_track,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadata
  lead_source TEXT,                    -- e.g., "whitepaper", "linkedin_ad", "referral"
  utm_campaign TEXT,
  utm_medium TEXT,
  
  -- Indexes for common queries
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Index for webhook lookups (student_id query)
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_knowledge_level ON profiles(knowledge_level);

-- =============================================================================
-- ENROLLMENTS TABLE
-- Tracks course enrollment and payment status
-- =============================================================================
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign keys
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Enrollment details
  status enrollment_status DEFAULT 'pending',
  enrolled_at TIMESTAMPTZ,
  
  -- Financial tracking
  amount_paid DECIMAL(10, 2) DEFAULT 997.00,
  payment_method TEXT,
  stripe_payment_id TEXT,
  
  -- Foundation phase tracking
  foundation_started_at TIMESTAMPTZ,
  foundation_completed_at TIMESTAMPTZ,
  
  -- Specialization phase tracking
  specialization_started_at TIMESTAMPTZ,
  specialization_completed_at TIMESTAMPTZ,
  
  -- Credit rebound (awarded after foundation completion)
  credit_rebound_eligible BOOLEAN DEFAULT FALSE,
  credit_rebound_type credit_type DEFAULT 'pending',
  credit_rebound_amount DECIMAL(10, 2) DEFAULT 300.00,
  credit_rebound_issued_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(profile_id)
);

CREATE INDEX idx_enrollments_profile_id ON enrollments(profile_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);

-- =============================================================================
-- LESSONS TABLE
-- Curriculum content definition (Foundation + 6 Specializations)
-- =============================================================================
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Lesson identification
  slug TEXT UNIQUE NOT NULL,           -- e.g., "month-1-quantum-fundamentals"
  title TEXT NOT NULL,
  description TEXT,
  
  -- Curriculum position
  month_number INTEGER NOT NULL CHECK (month_number BETWEEN 1 AND 12),
  lesson_order INTEGER DEFAULT 1,      -- Order within month
  
  -- Track assignment
  is_foundation BOOLEAN DEFAULT TRUE,  -- TRUE for months 1-6
  specialization specialization_track, -- Only set for months 7-12
  
  -- Content
  content_url TEXT,                    -- Link to lesson content (e.g., Notion, LMS)
  video_url TEXT,
  estimated_duration_minutes INTEGER,
  
  -- Required knowledge level to access
  required_level knowledge_level DEFAULT '0',
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lessons_month ON lessons(month_number);
CREATE INDEX idx_lessons_specialization ON lessons(specialization);

-- =============================================================================
-- LESSON_COMPLETIONS TABLE
-- Tracks individual lesson progress per student
-- =============================================================================
CREATE TABLE lesson_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign keys
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  
  -- Progress tracking
  status completion_status DEFAULT 'not_started',
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  
  -- Timestamps
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- AI interaction metrics (for Socratic tutor)
  ai_interactions_count INTEGER DEFAULT 0,
  
  -- Constraints
  UNIQUE(profile_id, lesson_id)
);

CREATE INDEX idx_completions_profile ON lesson_completions(profile_id);
CREATE INDEX idx_completions_lesson ON lesson_completions(lesson_id);
CREATE INDEX idx_completions_status ON lesson_completions(status);

-- =============================================================================
-- AI_INTERACTIONS TABLE
-- Logs all interactions with the Claude-powered Socratic tutor
-- =============================================================================
CREATE TABLE ai_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign keys
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
  
  -- Interaction content
  student_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  suggested_action TEXT,               -- From Claude's JSON response
  
  -- Context at time of interaction
  knowledge_level_at_time knowledge_level,
  lesson_slug TEXT,                    -- Denormalized for easy querying
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Response metrics
  response_time_ms INTEGER
);

CREATE INDEX idx_ai_interactions_profile ON ai_interactions(profile_id);
CREATE INDEX idx_ai_interactions_created ON ai_interactions(created_at DESC);

-- =============================================================================
-- LEAD_MAGNETS TABLE
-- Tracks white paper downloads and other lead captures
-- =============================================================================
CREATE TABLE lead_magnets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Contact info (before user account creation)
  email TEXT NOT NULL,
  full_name TEXT,
  title TEXT,
  company TEXT,
  
  -- Lead magnet specifics
  asset_name TEXT NOT NULL,            -- e.g., "quantum_legal_whitepaper"
  asset_version TEXT DEFAULT '1.0',
  
  -- Source tracking
  source_url TEXT,
  utm_campaign TEXT,
  utm_medium TEXT,
  utm_source TEXT,
  
  -- Conversion tracking
  converted_to_enrollment BOOLEAN DEFAULT FALSE,
  profile_id UUID REFERENCES profiles(id),
  
  -- Timestamps
  downloaded_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate downloads (rate limiting)
  UNIQUE(email, asset_name)
);

CREATE INDEX idx_leads_email ON lead_magnets(email);
CREATE INDEX idx_leads_asset ON lead_magnets(asset_name);

-- =============================================================================
-- CREDIT_TRANSACTIONS TABLE
-- Tracks all credit rebound transactions
-- =============================================================================
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign keys
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  
  -- Transaction details
  amount DECIMAL(10, 2) NOT NULL,
  transaction_type credit_type NOT NULL,
  description TEXT,
  
  -- For cash back
  payout_method TEXT,                  -- e.g., "stripe_transfer", "check"
  payout_reference TEXT,               -- External reference ID
  
  -- For specialization credit
  applied_to_specialization specialization_track,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
  processed_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_credits_profile ON credit_transactions(profile_id);

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Function: Update timestamp on row modification
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER enrollments_updated_at
  BEFORE UPDATE ON enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function: Auto-promote knowledge level based on completions
CREATE OR REPLACE FUNCTION check_level_promotion()
RETURNS TRIGGER AS $$
DECLARE
  completed_foundation INTEGER;
  completed_specialization INTEGER;
  current_level knowledge_level;
BEGIN
  -- Get current knowledge level
  SELECT knowledge_level INTO current_level
  FROM profiles WHERE id = NEW.profile_id;
  
  -- Count foundation completions (months 1-6)
  SELECT COUNT(*) INTO completed_foundation
  FROM lesson_completions lc
  JOIN lessons l ON lc.lesson_id = l.id
  WHERE lc.profile_id = NEW.profile_id
    AND lc.status = 'completed'
    AND l.is_foundation = TRUE;
  
  -- Count specialization completions (months 7-12)
  SELECT COUNT(*) INTO completed_specialization
  FROM lesson_completions lc
  JOIN lessons l ON lc.lesson_id = l.id
  WHERE lc.profile_id = NEW.profile_id
    AND lc.status = 'completed'
    AND l.is_foundation = FALSE;
  
  -- Promote to Level 1 after foundation (assuming ~30 lessons in foundation)
  IF current_level = '0' AND completed_foundation >= 24 THEN
    UPDATE profiles SET knowledge_level = '1' WHERE id = NEW.profile_id;
    
    -- Mark credit rebound eligible
    UPDATE enrollments SET credit_rebound_eligible = TRUE 
    WHERE profile_id = NEW.profile_id;
  END IF;
  
  -- Promote to Level 2 after specialization (assuming ~24 lessons)
  IF current_level = '1' AND completed_specialization >= 20 THEN
    UPDATE profiles SET knowledge_level = '2' WHERE id = NEW.profile_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Check for level promotion after lesson completion
CREATE TRIGGER check_promotion_on_completion
  AFTER UPDATE OF status ON lesson_completions
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
  EXECUTE FUNCTION check_level_promotion();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_magnets ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/update their own profile
CREATE POLICY profiles_select ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY profiles_update ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Enrollments: Users can only view their own enrollment
CREATE POLICY enrollments_select ON enrollments
  FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Lesson Completions: Users can manage their own completions
CREATE POLICY completions_select ON lesson_completions
  FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY completions_insert ON lesson_completions
  FOR INSERT WITH CHECK (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY completions_update ON lesson_completions
  FOR UPDATE USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- AI Interactions: Users can view their own interactions
CREATE POLICY ai_interactions_select ON ai_interactions
  FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Lessons: All authenticated users can read lessons
CREATE POLICY lessons_select ON lessons
  FOR SELECT TO authenticated USING (is_active = TRUE);

-- =============================================================================
-- SEED DATA: Foundation Curriculum (Months 1-6)
-- =============================================================================
INSERT INTO lessons (slug, title, description, month_number, lesson_order, is_foundation, required_level) VALUES
-- Month 1: Quantum Fundamentals
('m1-quantum-intro', 'Introduction to Quantum Computing', 'Understanding why quantum matters for your industry', 1, 1, TRUE, '0'),
('m1-classical-vs-quantum', 'Classical vs Quantum Logic', 'The fundamental paradigm shift', 1, 2, TRUE, '0'),
('m1-business-applications', 'The Business Case for Quantum', 'ROI and strategic positioning', 1, 3, TRUE, '0'),

-- Month 2: Mathematical Foundations
('m2-linear-algebra', 'Linear Algebra for Quantum', 'Vectors, matrices, and Dirac notation', 2, 1, TRUE, '0'),
('m2-probability', 'Probabilistic Thinking', 'Understanding quantum measurements', 2, 2, TRUE, '0'),

-- Month 3: Qubits & Gates
('m3-qubits', 'Understanding Qubits', 'Superposition and state representation', 3, 1, TRUE, '0'),
('m3-quantum-gates', 'Quantum Gates & Circuits', 'Building blocks of quantum algorithms', 3, 2, TRUE, '0'),

-- Month 4: Core Algorithms
('m4-deutsch', 'Deutsch-Jozsa Algorithm', 'Your first quantum speedup', 4, 1, TRUE, '0'),
('m4-grovers', 'Grover''s Search Algorithm', 'Quadratic speedup for unstructured search', 4, 2, TRUE, '0'),

-- Month 5: Practical Implementation
('m5-qiskit-intro', 'IBM Qiskit Fundamentals', 'Hands-on with real quantum hardware', 5, 1, TRUE, '0'),
('m5-circuits', 'Building & Running Circuits', 'From theory to execution', 5, 2, TRUE, '0'),

-- Month 6: Industry Landscape
('m6-ecosystem', 'The Quantum Ecosystem', 'IBM, Google, Microsoft, and beyond', 6, 1, TRUE, '0'),
('m6-career-positioning', 'Strategic Career Positioning', 'Becoming quantum-ready', 6, 2, TRUE, '0');

-- =============================================================================
-- SEED DATA: Legal Specialization (Months 7-12)
-- =============================================================================
INSERT INTO lessons (slug, title, description, month_number, lesson_order, is_foundation, specialization, required_level) VALUES
('legal-m7-ip', 'Quantum IP & Patent Law', 'Navigating the winner-takes-all IP landscape', 7, 1, FALSE, 'legal', '1'),
('legal-m8-pqc', 'The Cryptographic Transition', 'PQC liability and compliance mandates', 8, 1, FALSE, 'legal', '1'),
('legal-m9-regulatory', 'Regulatory Frameworks', 'Principles vs rules-based quantum regulation', 9, 1, FALSE, 'legal', '1'),
('legal-m10-hndl', 'Ethical Compliance & HNDL', 'Harvest Now Decrypt Later liability', 10, 1, FALSE, 'legal', '1'),
('legal-m11-trade', 'International Trade Controls', 'The Quantum Arms Race', 11, 1, FALSE, 'legal', '1'),
('legal-m12-capstone', 'Legal Capstone Project', 'Q-Ready Legal Strategy for Fortune 500', 12, 1, FALSE, 'legal', '1');

-- Additional specialization tracks would follow the same pattern...

-- =============================================================================
-- VIEWS: Useful aggregations for dashboards
-- =============================================================================

-- View: Student progress summary
CREATE VIEW student_progress AS
SELECT 
  p.id AS profile_id,
  p.email,
  p.full_name,
  p.knowledge_level,
  p.specialization,
  e.status AS enrollment_status,
  e.credit_rebound_eligible,
  COUNT(DISTINCT CASE WHEN lc.status = 'completed' THEN lc.lesson_id END) AS lessons_completed,
  COUNT(DISTINCT l.id) AS total_lessons_available,
  ROUND(
    COUNT(DISTINCT CASE WHEN lc.status = 'completed' THEN lc.lesson_id END)::NUMERIC / 
    NULLIF(COUNT(DISTINCT l.id), 0) * 100, 2
  ) AS progress_percentage
FROM profiles p
LEFT JOIN enrollments e ON p.id = e.profile_id
LEFT JOIN lesson_completions lc ON p.id = lc.profile_id
LEFT JOIN lessons l ON (
  l.is_foundation = TRUE OR l.specialization = p.specialization
) AND l.is_active = TRUE
GROUP BY p.id, p.email, p.full_name, p.knowledge_level, p.specialization, e.status, e.credit_rebound_eligible;

-- =============================================================================
-- COMMENTS
-- =============================================================================
COMMENT ON TABLE profiles IS 'Core student profiles with Z2Q knowledge level tracking';
COMMENT ON COLUMN profiles.knowledge_level IS 'Current quantum literacy level (0=Awareness, 1=Application, 2=Specialization)';
COMMENT ON TABLE enrollments IS 'Course enrollment records with financial and completion tracking';
COMMENT ON COLUMN enrollments.credit_rebound_eligible IS 'Set TRUE after foundation completion for $300 credit';
COMMENT ON TABLE ai_interactions IS 'Log of all Claude-powered Socratic tutor interactions (via n8n webhook)';
