-- ============================================================
-- 004_forum_system.sql
-- Community Forum Tables (Categories, Posts, Comments)
-- ============================================================

-- 1. Categories
CREATE TABLE IF NOT EXISTS forum_categories (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  title       text        NOT NULL,
  slug        text        NOT NULL UNIQUE,
  description text,
  color       text,       -- 'saffron', 'sage', 'gold', 'plum', 'royal-blue'
  created_at  timestamptz DEFAULT now()
);

-- 2. Posts
CREATE TABLE IF NOT EXISTS forum_posts (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id   uuid        REFERENCES forum_categories(id) ON DELETE SET NULL,
  author_name   text        NOT NULL DEFAULT 'ผู้ใช้งาน VME',
  title         text        NOT NULL,
  content       text        NOT NULL,
  tag           text,       -- Optional tag like 'HELP', 'IDEA'
  views_count   integer     DEFAULT 0,
  sparks_count  integer     DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

-- 3. Comments
CREATE TABLE IF NOT EXISTS forum_comments (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id       uuid        NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  author_name   text        NOT NULL DEFAULT 'ผู้ใช้งาน VME',
  content       text        NOT NULL,
  created_at    timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;

-- Policies for Categories (Public Read)
DROP POLICY IF EXISTS "public_read_categories" ON forum_categories;
CREATE POLICY "public_read_categories" ON forum_categories FOR SELECT USING (true);

-- Policies for Posts (Public Read, Public Insert for demo/easy use)
-- Note: In production, you might want to restrict insert to authenticated users.
DROP POLICY IF EXISTS "public_read_posts" ON forum_posts;
CREATE POLICY "public_read_posts" ON forum_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_insert_posts" ON forum_posts;
CREATE POLICY "public_insert_posts" ON forum_posts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_posts" ON forum_posts;
CREATE POLICY "public_update_posts" ON forum_posts FOR UPDATE USING (true);

-- Policies for Comments (Public Read, Public Insert)
DROP POLICY IF EXISTS "public_read_comments" ON forum_comments;
CREATE POLICY "public_read_comments" ON forum_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_insert_comments" ON forum_comments;
CREATE POLICY "public_insert_comments" ON forum_comments FOR INSERT WITH CHECK (true);

-- Insert Default Categories
INSERT INTO forum_categories (title, slug, color)
VALUES 
  ('กิจกรรม VME', 'vme-activities', 'saffron'),
  ('เทคนิค & วิธีการ', 'techniques', 'sage'),
  ('ถาม-ตอบ / ปัญหา', 'qa', 'plum'),
  ('แรงบันดาลใจ', 'inspiration', 'gold')
ON CONFLICT (slug) DO NOTHING;
