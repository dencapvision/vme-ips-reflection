-- ============================================================
-- 003_user_responses.sql
-- Store user input for SWOT, SMART Goals, and Reflections
-- ============================================================

CREATE TABLE IF NOT EXISTS user_responses (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid        NOT NULL, -- References members.id or profiles.id
  category    text        NOT NULL, -- 'swot', 'smart', 'reflect', etc.
  data        jsonb       NOT NULL DEFAULT '{}',
  updated_at  timestamptz DEFAULT now(),
  
  -- Ensure one entry per user per category
  UNIQUE(user_id, category)
);

-- Enable RLS
ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;

-- Service role: full access
DROP POLICY IF EXISTS "service_role_full_access" ON user_responses;
CREATE POLICY "service_role_full_access" ON user_responses
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Authenticated users: read their own data
DROP POLICY IF EXISTS "users_read_own_responses" ON user_responses;
CREATE POLICY "users_read_own_responses" ON user_responses
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_responses_user_id ON user_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_responses_category ON user_responses(category);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_responses_updated_at
BEFORE UPDATE ON user_responses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
