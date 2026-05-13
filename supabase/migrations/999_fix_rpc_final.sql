-- ============================================================
-- FINAL RPC FIX: Ensure match_knowledge works with current schema
-- ============================================================

-- 1. Enable vector extension if not already present
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Drop existing functions to avoid parameter mismatches
DROP FUNCTION IF EXISTS public.match_knowledge(vector, float, int);
DROP FUNCTION IF EXISTS public.match_knowledge(vector, double precision, integer);
DROP FUNCTION IF EXISTS public.match_knowledge_chunks(vector, float, int);

-- 3. Create/Replace the definitive match_knowledge function
CREATE OR REPLACE FUNCTION public.match_knowledge (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    kc.id,
    kc.chunk_text AS content,
    kc.metadata,
    1 - (kc.embedding <=> query_embedding) AS similarity
  FROM public.knowledge_chunks kc
  WHERE kc.embedding IS NOT NULL
    AND 1 - (kc.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;

-- 4. Grant access to everyone (RLS will still apply on the tables)
GRANT EXECUTE ON FUNCTION public.match_knowledge TO anon;
GRANT EXECUTE ON FUNCTION public.match_knowledge TO authenticated;
GRANT EXECUTE ON FUNCTION public.match_knowledge TO service_role;

-- 5. Verify the tables exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'knowledge_chunks') THEN
        RAISE EXCEPTION 'Table knowledge_chunks does not exist. Please run migration 002 first.';
    END IF;
END $$;
