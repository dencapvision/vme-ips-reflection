import { createClient } from '@supabase/supabase-js'
import { createEmbedding } from './embedding'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function searchKnowledge(query: string, limit = 5) {
  const embedding = await createEmbedding(query)
  const { data, error } = await supabase.rpc('match_knowledge', {
    query_embedding: embedding,
    match_threshold: 0.62,
    match_count: limit,
  })
  if (error) throw new Error(`Search error: ${error.message}`)
  return data ?? []
}

export async function listKnowledgeFiles() {
  const { data, error } = await supabase
    .from('knowledge_base')
    .select('source_file, category, chunk_total, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  const map = new Map<string, any>()
  for (const row of data ?? []) {
    if (!map.has(row.source_file)) {
      map.set(row.source_file, {
        filename: row.source_file,
        category: row.category,
        chunks: row.chunk_total,
        uploadedAt: row.created_at,
      })
    }
  }
  return Array.from(map.values())
}

export async function deleteKnowledgeFile(filename: string) {
  const { error } = await supabase.from('knowledge_base').delete().eq('source_file', filename)
  if (error) throw error
  return { deleted: filename }
}
