-- Migration: Add download sections support to library_links
-- Run this in Supabase SQL Editor

ALTER TABLE public.library_links
  ADD COLUMN IF NOT EXISTS section text DEFAULT 'resource',
  ADD COLUMN IF NOT EXISTS badge_text text,
  ADD COLUMN IF NOT EXISTS meta_info text,
  ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;

-- section values:
--   'pr-media'  → PR Media & Invitations cards (DOWNLOAD / OFFICIAL)
--   'featured'  → Featured Documents (คัดสรรมาเพื่อคุณ)
--   'resource'  → General resources list (default)

COMMENT ON COLUMN public.library_links.section IS 'Display section: pr-media | featured | resource';
COMMENT ON COLUMN public.library_links.badge_text IS 'Badge label e.g. DOWNLOAD, OFFICIAL, FEATURED, NEW';
COMMENT ON COLUMN public.library_links.meta_info IS 'Subtitle meta e.g. "26 หน้า · 4 วิดีโอ · อัปเดต พ.ค. 2569"';
COMMENT ON COLUMN public.library_links.sort_order IS 'Display order (lower = first)';
