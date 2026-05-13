-- ============================================================
-- IPS Reflection — Knowledge Documents (RAG v2)
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable vector extension (required for embeddings)
CREATE EXTENSION IF NOT EXISTS vector;

-- ── Table: knowledge_documents ────────────────────────────────
-- One row per uploaded file (PDF, Drive, YouTube)
CREATE TABLE IF NOT EXISTS knowledge_documents (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  title        text        NOT NULL,
  filename     text        NOT NULL,
  storage_path text        NOT NULL DEFAULT '',
  category     text        DEFAULT 'ทั่วไป',
  source_type  text        DEFAULT 'pdf',
  source_url   text,
  chunk_count  int         DEFAULT 0,
  status       text        DEFAULT 'processing',
  uploaded_by  uuid,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- ── Table: knowledge_chunks ────────────────────────────────────
-- Each chunk of text + its vector embedding
CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id uuid        REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  chunk_text  text        NOT NULL,
  chunk_index int         NOT NULL DEFAULT 0,
  embedding   vector(768),
  metadata    jsonb       DEFAULT '{}',
  created_at  timestamptz DEFAULT now()
);

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_knowledge_docs_status   ON knowledge_documents(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_docs_category ON knowledge_documents(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_doc    ON knowledge_chunks(document_id);

-- ── RLS Policies ─────────────────────────────────────────────
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_chunks    ENABLE ROW LEVEL SECURITY;

-- Service role: full access (for API routes using SERVICE_ROLE_KEY)
DROP POLICY IF EXISTS "service_role_full_access" ON knowledge_documents;
CREATE POLICY "service_role_full_access" ON knowledge_documents
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_full_access" ON knowledge_chunks;
CREATE POLICY "service_role_full_access" ON knowledge_chunks
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Authenticated users: read-only (for admin UI)
DROP POLICY IF EXISTS "authenticated_read_docs" ON knowledge_documents;
CREATE POLICY "authenticated_read_docs" ON knowledge_documents
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "authenticated_read_chunks" ON knowledge_chunks;
CREATE POLICY "authenticated_read_chunks" ON knowledge_chunks
  FOR SELECT TO authenticated USING (true);

-- ── Vector search function ────────────────────────────────────
CREATE OR REPLACE FUNCTION match_knowledge_chunks(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.65,
  match_count     int   DEFAULT 5
)
RETURNS TABLE (
  id          uuid,
  document_id uuid,
  chunk_text  text,
  metadata    jsonb,
  similarity  float
)
LANGUAGE sql STABLE AS $$
  SELECT
    kc.id,
    kc.document_id,
    kc.chunk_text,
    kc.metadata,
    1 - (kc.embedding <=> query_embedding) AS similarity
  FROM knowledge_chunks kc
  WHERE kc.embedding IS NOT NULL
    AND 1 - (kc.embedding <=> query_embedding) > match_threshold
  ORDER BY kc.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- ── Verify ───────────────────────────────────────────────────
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('knowledge_documents', 'knowledge_chunks');
