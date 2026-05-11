// pdf-parse is a CommonJS module without a default export
const pdfParse = require('pdf-parse');
import { createEmbedding } from './embedding'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function extractTextFromPDF(buffer: Buffer) {
  const data = await pdfParse(buffer)
  return { text: data.text, pages: data.numpages }
}

export function chunkText(text: string, chunkSize = 800, overlap = 150) {
  const clean = text.replace(/\s+/g, ' ').trim()
  const chunks: { content: string; start: number; end: number }[] = []
  let pos = 0
  while (pos < clean.length) {
    let end = pos + chunkSize
    if (end < clean.length) {
      const lastDot = clean.lastIndexOf('.', end)
      const lastNl  = clean.lastIndexOf('\n', end)
      const cut = Math.max(lastDot, lastNl)
      if (cut > pos + chunkSize * 0.5) end = cut + 1
    }
    const content = clean.slice(pos, end).trim()
    if (content.length > 50) chunks.push({ content, start: pos, end })
    pos = end - overlap
  }
  return chunks
}

export async function processPDF({
  buffer, filename, category = 'general', sourceUrl, onProgress,
}: {
  buffer: Buffer
  filename: string
  category?: string
  sourceUrl?: string
  onProgress?: (msg: string, pct: number) => void
}) {
  const log = (msg: string, pct: number) => {
    console.log(`[${filename}] ${msg} (${pct}%)`)
    onProgress?.(msg, pct)
  }

  log('กำลัง extract text...', 10)
  const { text, pages } = await extractTextFromPDF(buffer)
  if (!text || text.length < 100) throw new Error('PDF ไม่มีข้อความ หรือเป็น PDF รูปภาพ')

  log('กำลังแบ่ง chunks...', 25)
  const chunks = chunkText(text)
  log(`แบ่งได้ ${chunks.length} chunks จาก ${pages} หน้า`, 35)

  await supabase.from('knowledge_base').delete().eq('source_file', filename)

  const BATCH = 5
  let done = 0
  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH)
    const embeddings = await Promise.all(batch.map(c => createEmbedding(c.content)))
    const rows = batch.map((chunk, j) => ({
      source_file: filename,
      source_url:  sourceUrl ?? null,
      chunk_index: i + j,
      chunk_total: chunks.length,
      page_start:  Math.max(1, Math.floor((chunk.start / text.length) * pages) + 1),
      page_end:    Math.min(pages, Math.ceil((chunk.end / text.length) * pages)),
      title:       `${filename.replace('.pdf', '')} — ส่วนที่ ${i + j + 1}`,
      content:     chunk.content,
      category,
      embedding:   embeddings[j],
      metadata:    { total_pages: pages, total_chunks: chunks.length },
    }))
    const { error } = await supabase.from('knowledge_base').insert(rows)
    if (error) throw new Error(`Supabase insert error: ${error.message}`)
    done += batch.length
    const pct = 35 + Math.round((done / chunks.length) * 60)
    log(`Embedded ${done}/${chunks.length} chunks`, pct)
    if (i + BATCH < chunks.length) await new Promise(r => setTimeout(r, 600))
  }

  log('✅ เสร็จสมบูรณ์!', 100)
  return { filename, pages, chunks: chunks.length, category }
}

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
