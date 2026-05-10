-- ==============================================================================
-- 1. สร้างตาราง profiles
-- ==============================================================================
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    motto TEXT, -- ข้อคิด คำคม
    virtue TEXT, -- คุณธรรมประจำตัว
    phone TEXT,
    email TEXT,
    line_id TEXT,
    role TEXT DEFAULT 'ทั่วไป', -- เช่น 'อาสาการศึกษา VME'
    group_name TEXT, -- เช่น 'กลุ่มที่ 4'
    province TEXT,
    is_public BOOLEAN DEFAULT true, -- เปิดให้แชร์เป็นนามบัตร
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 2. ตั้งค่า RLS (Row Level Security) สำหรับ profiles
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ใครก็ดูได้ถ้าระบุเป็น is_public = true (สำหรับแชร์นามบัตร)
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.profiles FOR SELECT 
USING ( is_public = true );

-- เจ้าของดูข้อมูลตัวเองได้ทั้งหมด
CREATE POLICY "Users can view their own profile." 
ON public.profiles FOR SELECT 
USING ( auth.uid() = id );

-- เจ้าของอัปเดตข้อมูลตัวเองได้
CREATE POLICY "Users can update their own profile." 
ON public.profiles FOR UPDATE 
USING ( auth.uid() = id );

-- ==============================================================================
-- 3. Trigger สร้าง profile อัตโนมัติเมื่อสมัครสมาชิก
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'first_name', ''), 
    COALESCE(new.raw_user_meta_data->>'last_name', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ผูก Trigger เข้ากับตาราง auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==============================================================================
-- 4. ตั้งค่า Storage Bucket สำหรับอัปโหลดรูปโปรไฟล์
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- อนุญาตให้ดูรูปได้ทุกคน
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

-- อนุญาตให้อัปโหลดเฉพาะรูปของตัวเอง (กำหนดชื่อไฟล์ด้วย user id)
CREATE POLICY "Anyone can upload an avatar."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- อนุญาตให้อัปเดตและลบรูปตัวเองได้
CREATE POLICY "Anyone can update their own avatar."
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );

CREATE POLICY "Anyone can delete their own avatar."
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );
