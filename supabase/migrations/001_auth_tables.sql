-- ============================================================
-- IPS Reflection — Custom Auth Tables
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Members table (login by name only, no password)
CREATE TABLE IF NOT EXISTS members (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text        NOT NULL,
  last_name  text        NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Ensure name pairs are unique
CREATE UNIQUE INDEX IF NOT EXISTS members_name_idx
  ON members (first_name, last_name);

-- 2. Admins table (email + hashed password, role assumed admin)
CREATE TABLE IF NOT EXISTS admins (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  email         text        UNIQUE NOT NULL,
  password_hash text        NOT NULL,  -- PBKDF2 format: "<hex-salt>:<hex-hash>"
  created_at    timestamptz DEFAULT now()
);

-- ============================================================
-- Row-Level Security (optional but recommended)
-- ============================================================

ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins  ENABLE ROW LEVEL SECURITY;

-- Service-role key (used by our API routes) bypasses RLS automatically.
-- No additional policies needed for server-side access.

-- ============================================================
-- Seed: create first admin account
-- Replace the password_hash with the output of hashPassword('yourpassword')
-- from lib/auth.ts, or run the helper script below.
-- ============================================================
-- INSERT INTO admins (email, password_hash)
-- VALUES ('admin@vme-ips.com', '<paste hash here>');

-- ============================================================
-- Sample members
-- ============================================================
-- INSERT INTO members (first_name, last_name) VALUES
--   ('สมชาย', 'ใจดี'),
--   ('สมหญิง', 'รักเรียน');
