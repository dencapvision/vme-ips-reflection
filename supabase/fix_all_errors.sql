-- 1. สร้างตารางคลังความรู้ (ถ้ายังไม่มี)
create table if not exists public.library_links (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  url text not null,
  category text default 'ทั่วไป',
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.library_videos (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  url text not null,
  playlist_name text default 'ทั่วไป',
  thumbnail_url text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. เปิดใช้งาน Vector Extension
create extension if not exists vector with schema extensions;

-- 3. อัปเดต Function สำหรับการค้นหา Vector (RAG) 
-- ให้ไปดึงจากตาราง knowledge_chunks ที่เป็นระบบใหม่
drop function if exists public.match_knowledge(vector, double precision, integer);
drop function if exists public.match_knowledge(extensions.vector, float8, int4);

create or replace function public.match_knowledge (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    id,
    chunk_text as content,
    metadata,
    1 - (embedding <=> query_embedding) as similarity
  from public.knowledge_chunks
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;

-- 4. ตั้งค่า RLS (Security) ให้ทุกคนอ่านได้
alter table public.library_links enable row level security;
alter table public.library_videos enable row level security;

drop policy if exists "Allow read access to all users" on public.library_links;
create policy "Allow read access to all users" on public.library_links for select using (true);

drop policy if exists "Allow read access to all users" on public.library_videos;
create policy "Allow read access to all users" on public.library_videos for select using (true);
