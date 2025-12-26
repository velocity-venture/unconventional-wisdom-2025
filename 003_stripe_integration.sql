-- =============================================================================
-- Z2Q STRIPE INTEGRATION MIGRATION
-- Adds columns for Stripe payment tracking and idempotency
-- =============================================================================

-- Add Stripe customer ID to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Create index for Stripe customer lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer 
ON profiles(stripe_customer_id);

-- =============================================================================
-- ENROLLMENTS TABLE STRIPE COLUMNS
-- =============================================================================

-- Stripe session ID (for idempotency)
ALTER TABLE enrollments 
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- Add UNIQUE constraint to prevent duplicate processing
ALTER TABLE enrollments 
ADD CONSTRAINT enrollments_stripe_session_unique UNIQUE (stripe_session_id);

-- Stripe customer ID
ALTER TABLE enrollments 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Stripe Price/Product IDs
ALTER TABLE enrollments 
ADD COLUMN IF NOT EXISTS price_id TEXT;

ALTER TABLE enrollments 
ADD COLUMN IF NOT EXISTS product_id TEXT;

-- Payment details
ALTER TABLE enrollments 
ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10,2);

ALTER TABLE enrollments 
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'usd';

ALTER TABLE enrollments 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Add enrolled_at timestamp if missing
ALTER TABLE enrollments 
ADD COLUMN IF NOT EXISTS enrolled_at TIMESTAMPTZ DEFAULT NOW();

-- =============================================================================
-- PAYMENT TRANSACTIONS TABLE
-- Logs all payment events for audit trail
-- =============================================================================

CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign keys
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE SET NULL,
  
  -- Stripe identifiers
  stripe_session_id TEXT,
  stripe_customer_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  
  -- Transaction details
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL, -- 'pending', 'completed', 'refunded', 'failed'
  transaction_type TEXT NOT NULL, -- 'enrollment', 'refund', 'credit_rebound'
  
  -- Metadata
  description TEXT,
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Indexes for payment queries
CREATE INDEX IF NOT EXISTS idx_transactions_profile ON payment_transactions(profile_id);
CREATE INDEX IF NOT EXISTS idx_transactions_enrollment ON payment_transactions(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_transactions_session ON payment_transactions(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON payment_transactions(status);

-- =============================================================================
-- CREDIT TRANSACTIONS TABLE (if not exists)
-- Tracks Credit Rebound disbursements
-- =============================================================================

CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE SET NULL,
  
  amount DECIMAL(10,2) NOT NULL DEFAULT 300.00,
  transaction_type TEXT NOT NULL, -- 'apply_to_module', 'cash_back'
  description TEXT,
  applied_to_specialization TEXT,
  
  status TEXT DEFAULT 'pending', -- 'pending', 'processed', 'failed'
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_profile 
ON credit_transactions(profile_id);

-- =============================================================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only view their own transactions
CREATE POLICY payment_transactions_select ON payment_transactions
  FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY credit_transactions_select ON credit_transactions
  FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- =============================================================================
-- VERIFICATION
-- =============================================================================

SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name IN ('enrollments', 'payment_transactions', 'credit_transactions')
  AND column_name LIKE '%stripe%'
ORDER BY table_name, ordinal_position;
