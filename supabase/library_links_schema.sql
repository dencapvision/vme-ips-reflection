-- Create library_links table
create table if not exists public.library_links (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  url text not null,
  category text default 'ทั่วไป',
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create library_videos table
create table if not exists public.library_videos (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  url text not null,
  playlist_name text default 'ทั่วไป',
  thumbnail_url text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.library_links enable row level security;
alter table public.library_videos enable row level security;

-- RLS Policies for library_links
drop policy if exists "Allow read access to all users" on public.library_links;
create policy "Allow read access to all users" on public.library_links
  for select using (true);

drop policy if exists "Allow manage access to admin" on public.library_links;
create policy "Allow manage access to admin" on public.library_links
  for all using (auth.role() = 'authenticated'); -- Simplified for now, should ideally check role column

-- RLS Policies for library_videos
drop policy if exists "Allow read access to all users" on public.library_videos;
create policy "Allow read access to all users" on public.library_videos
  for select using (true);

drop policy if exists "Allow manage access to admin" on public.library_videos;
create policy "Allow manage access to admin" on public.library_videos
  for all using (auth.role() = 'authenticated');
