-- Enable pgvector extension
create extension if not exists vector with schema extensions;

-- Create the knowledge_base table
create table if not exists public.knowledge_base (
  id uuid default gen_random_uuid() primary key,
  source_file text not null,
  source_url text,
  chunk_index int,
  chunk_total int,
  page_start int,
  page_end int,
  title text,
  content text not null,
  category text default 'general',
  embedding vector(768) not null,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.knowledge_base enable row level security;

-- RLS Policies
drop policy if exists "Allow read access to all users" on public.knowledge_base;
create policy "Allow read access to all users" on public.knowledge_base
  for select using (true);

drop policy if exists "Allow insert access to admin" on public.knowledge_base;
create policy "Allow insert access to admin" on public.knowledge_base
  for insert with check (auth.role() = 'authenticated');
  
drop policy if exists "Allow delete access to admin" on public.knowledge_base;
create policy "Allow delete access to admin" on public.knowledge_base
  for delete using (auth.role() = 'authenticated');

-- Create RPC for vector similarity search
-- Note: We must drop it first because we are changing the return type (adding columns)
-- We try a few variations to ensure it matches the existing signature
drop function if exists public.match_knowledge(vector, double precision, integer);
drop function if exists public.match_knowledge(extensions.vector, float8, int4);
drop function if exists public.match_knowledge(extensions.vector, double precision, integer);

create or replace function public.match_knowledge (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  source_file text,
  title text,
  content text,
  page_start int,
  page_end int,
  category text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    id,
    source_file,
    title,
    content,
    page_start,
    page_end,
    category,
    metadata,
    1 - (embedding <=> query_embedding) as similarity
  from public.knowledge_base
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;
