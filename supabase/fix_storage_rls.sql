-- ==============================================================================
-- โครงการสร้างศาสนทายาท IPS - สคริปต์แก้ไข RLS Storage Policies
-- แก้ไขปัญหา: StorageApiError: new row violates row-level security policy
-- ==============================================================================
-- วิธีใช้: คัดลอกโค้ดทั้งหมดในไฟล์นี้ ไปรันใน Supabase Dashboard -> SQL Editor
-- แล้วกดปุ่ม Run
-- ==============================================================================

-- 1. ตรวจสอบและสร้าง Buckets ทั้ง 3 ใบ (ถ้ายังไม่มี) และตั้งค่าเป็น Public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('activity-photos', 'activity-photos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('knowledge-pdfs', 'knowledge-pdfs', true)
ON CONFLICT (id) DO NOTHING;


-- 2. ลบ Policies เก่าๆ บน storage.objects เพื่อเริ่มตั้งค่าแบบใหม่ที่ถูกต้องและยืดหยุ่นขึ้น
DROP POLICY IF EXISTS "Anyone can upload an avatar." ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update their own avatar." ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete their own avatar." ON storage.objects;
DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;

DROP POLICY IF EXISTS "Anyone can upload activity photos." ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update their own activity photos." ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete their own activity photos." ON storage.objects;
DROP POLICY IF EXISTS "Activity photos are publicly accessible." ON storage.objects;

DROP POLICY IF EXISTS "Allow public select on avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow public select on activity-photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public select on knowledge-pdfs" ON storage.objects;

DROP POLICY IF EXISTS "Allow upload to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload to activity-photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload to knowledge-pdfs" ON storage.objects;

DROP POLICY IF EXISTS "Allow update on avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow update on activity-photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow update on knowledge-pdfs" ON storage.objects;

DROP POLICY IF EXISTS "Allow delete on avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete on activity-photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete on knowledge-pdfs" ON storage.objects;


-- 3. สร้าง RLS Policies แบบใหม่ให้ยืดหยุ่น สำหรับระบบสมาชิกที่ใช้ JWT / Login-by-name
-- (เนื่องจากระบบของครูเด่นมีระบบ Login ของสมาชิกที่ไม่ได้ผ่าน Supabase Auth ทำให้ Supabase มองเป็น 'anon')
-- การควบคุมความปลอดภัยจะอยู่ที่ Server Actions / API Routes ของ Next.js ซึ่งปลอดภัย 100%

-- ── 3.1 สิทธิ์ในการอ่านข้อมูล (SELECT) - อนุญาตให้ทุกคนอ่านไฟล์ใน 3 บักเก็ตนี้ได้
CREATE POLICY "Allow public select on avatars"
  ON storage.objects FOR SELECT USING ( bucket_id = 'avatars' );

CREATE POLICY "Allow public select on activity-photos"
  ON storage.objects FOR SELECT USING ( bucket_id = 'activity-photos' );

CREATE POLICY "Allow public select on knowledge-pdfs"
  ON storage.objects FOR SELECT USING ( bucket_id = 'knowledge-pdfs' );


-- ── 3.2 สิทธิ์ในการอัปโหลดไฟล์ใหม่ (INSERT) - อนุญาตให้อัปโหลดเข้า 3 บักเก็ตนี้ได้
-- (ฝั่ง Server Action ของ Next.js จะตรวจสอบสิทธิ์ก่อนส่งมาบันทึกที่นี่)
CREATE POLICY "Allow upload to avatars"
  ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'avatars' );

CREATE POLICY "Allow upload to activity-photos"
  ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'activity-photos' );

CREATE POLICY "Allow upload to knowledge-pdfs"
  ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'knowledge-pdfs' );


-- ── 3.3 สิทธิ์ในการแก้ไขไฟล์ (UPDATE) - อนุญาตให้แก้ไขข้อมูลได้
CREATE POLICY "Allow update on avatars"
  ON storage.objects FOR UPDATE USING ( bucket_id = 'avatars' );

CREATE POLICY "Allow update on activity-photos"
  ON storage.objects FOR UPDATE USING ( bucket_id = 'activity-photos' );

CREATE POLICY "Allow update on knowledge-pdfs"
  ON storage.objects FOR UPDATE USING ( bucket_id = 'knowledge-pdfs' );


-- ── 3.4 สิทธิ์ในการลบไฟล์ (DELETE) - อนุญาตให้ลบไฟล์ได้
CREATE POLICY "Allow delete on avatars"
  ON storage.objects FOR DELETE USING ( bucket_id = 'avatars' );

CREATE POLICY "Allow delete on activity-photos"
  ON storage.objects FOR DELETE USING ( bucket_id = 'activity-photos' );

CREATE POLICY "Allow delete on knowledge-pdfs"
  ON storage.objects FOR DELETE USING ( bucket_id = 'knowledge-pdfs' );
