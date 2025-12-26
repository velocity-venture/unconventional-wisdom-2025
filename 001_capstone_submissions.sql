-- =============================================================================
-- Z2Q CAPSTONE SUBMISSIONS TABLE
-- Tracks all Foundation capstone submissions and evaluations
-- =============================================================================

-- Drop if exists (for re-running)
DROP TABLE IF EXISTS capstone_submissions;

-- Create capstone_submissions table
CREATE TABLE capstone_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign keys
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Submission content
  submission_type TEXT NOT NULL CHECK (submission_type IN ('github', 'code', 'notebook')),
  github_url TEXT,
  code_content TEXT,
  project_description TEXT NOT NULL,
  
  -- Evaluation results
  score INTEGER CHECK (score BETWEEN 0 AND 100),
  passed BOOLEAN DEFAULT FALSE,
  feedback TEXT,
  evaluation_data JSONB, -- Full AI evaluation response
  
  -- Timestamps
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  evaluated_at TIMESTAMPTZ,
  
  -- Metadata
  attempt_number INTEGER DEFAULT 1,
  
  CONSTRAINT valid_github_url CHECK (
    submission_type != 'github' OR github_url IS NOT NULL
  ),
  CONSTRAINT valid_code_content CHECK (
    submission_type NOT IN ('code', 'notebook') OR code_content IS NOT NULL
  )
);

-- Indexes
CREATE INDEX idx_capstone_profile ON capstone_submissions(profile_id);
CREATE INDEX idx_capstone_passed ON capstone_submissions(passed);

-- Enable RLS
ALTER TABLE capstone_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY capstone_select ON capstone_submissions
  FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY capstone_insert ON capstone_submissions
  FOR INSERT WITH CHECK (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Comments
COMMENT ON TABLE capstone_submissions IS 'Foundation capstone project submissions and AI evaluations';
COMMENT ON COLUMN capstone_submissions.evaluation_data IS 'Full JSON response from AI evaluator including score breakdown';

-- =============================================================================
-- ADD CREDIT REBOUND TYPE TO ENROLLMENTS (if not exists)
-- =============================================================================

-- Check and add credit_rebound_type column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'enrollments' AND column_name = 'credit_rebound_type'
  ) THEN
    ALTER TABLE enrollments ADD COLUMN credit_rebound_type TEXT 
      CHECK (credit_rebound_type IN ('cash_back', 'apply_to_module', 'pending'));
  END IF;
END $$;

-- =============================================================================
-- ENABLE REALTIME FOR PROFILES TABLE
-- Required for real-time subscription to knowledge_level changes
-- =============================================================================

-- Enable realtime on profiles table
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;

-- =============================================================================
-- VERIFICATION
-- =============================================================================

SELECT 
  'capstone_submissions' as table_name,
  COUNT(*) as column_count
FROM information_schema.columns 
WHERE table_name = 'capstone_submissions';
