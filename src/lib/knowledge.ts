import { getSupabaseAdmin } from './clients'
import { createEmbedding } from './embedding'

export async function searchKnowledge(query: string, limit = 5) {
  const embedding = await createEmbedding(query)

  console.log(`[RAG] Searching knowledge for: "${query.slice(0, 50)}..."`);

  // Use direct fetch to Supabase REST API to avoid @supabase/supabase-js
  // using Node.js Readable.asyncIterator which is not supported in Cloudflare Workers
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[RAG] Missing Supabase env vars')
    return []
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/match_knowledge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey,
    },
    body: JSON.stringify({
      query_embedding: embedding,
      match_threshold: 0.4,
      match_count: limit,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error('[RAG] searchKnowledge RPC Error:', res.status, errText.slice(0, 200))
    return []
  }

  const data = await res.json()

  console.log(`[RAG] Found ${data?.length || 0} matching chunks`);

  return data ?? []
}

export async function listKnowledgeFiles() {
  const supabase = getSupabaseAdmin()
  
  // Try querying from knowledge_documents first (New efficient way)
  const { data: docs, error: docError } = await supabase
    .from('knowledge_documents')
    .select('filename, category, chunk_count, created_at')
    .order('created_at', { ascending: false })

  if (!docError && docs && docs.length > 0) {
    return docs.map(d => ({
      filename: d.filename,
      category: d.category,
      chunks: d.chunk_count || 0,
      uploadedAt: d.created_at
    }))
  }

  // Fallback to knowledge_base if knowledge_documents is empty or doesn't exist
  // Use a more efficient select if possible, but keeping it simple for now
  const { data, error } = await supabase
    .from('knowledge_base')
    .select('source_file, category, chunk_total, created_at')
    .order('created_at', { ascending: false })
    .limit(2000) // Safety limit to avoid 1102

  if (error) {
    // If both fail, return empty
    if (docError) console.error('listKnowledgeFiles Error:', docError.message)
    return []
  }

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
  const supabase = getSupabaseAdmin()
  
  // Delete from both potential tables
  await supabase.from('knowledge_documents').delete().eq('filename', filename)
  const { error } = await supabase.from('knowledge_base').delete().eq('source_file', filename)
  
  if (error) throw error
  return { deleted: filename }
}
