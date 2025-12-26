-- =============================================================================
-- Z2Q ORIENTATION TRACKING MIGRATION
-- Tracks whether student has completed the Welcome Orientation
-- =============================================================================

-- Add orientation_completed_at column to enrollments
ALTER TABLE enrollments 
ADD COLUMN IF NOT EXISTS orientation_completed_at TIMESTAMPTZ;

-- Add index for quick lookups
CREATE INDEX IF NOT EXISTS idx_enrollments_orientation 
ON enrollments(orientation_completed_at);

-- Comment
COMMENT ON COLUMN enrollments.orientation_completed_at IS 
  'Timestamp when student completed the Welcome Orientation. NULL means not completed.';

-- =============================================================================
-- FUNCTION: Check if orientation is needed
-- =============================================================================

CREATE OR REPLACE FUNCTION needs_orientation(p_profile_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_orientation_completed TIMESTAMPTZ;
BEGIN
  SELECT orientation_completed_at 
  INTO v_orientation_completed
  FROM enrollments 
  WHERE profile_id = p_profile_id;
  
  -- If no enrollment found or orientation not completed, return TRUE
  RETURN v_orientation_completed IS NULL;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- VERIFICATION
-- =============================================================================

SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'enrollments' 
  AND column_name = 'orientation_completed_at';
