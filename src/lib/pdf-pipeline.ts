import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!

// ── Embedding (single) ──────────────────────────────────────────
export async function createEmbedding(text: string): Promise<number[]> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/text-embedding-004',
        content: { parts: [{ text: text.slice(0, 8000) }] }
      })
    }
  )
  if (!res.ok) throw new Error(`Gemini embed error: ${await res.text()}`)
  const data = await res.json()
  return data.embedding.values as number[]
}

// ── Embedding (PARALLEL batch) ──────────────────────────────────
export async function createEmbeddingsBatch(
  texts: string[],
  onProgress?: (done: number, total: number) => void
): Promise<number[][]> {
  const PARALLEL = 10
  const PAUSE_MS = 300
  const results: number[][] = new Array(texts.length)

  for (let i = 0; i < texts.length; i += PARALLEL) {
    const batch = texts.slice(i, i + PARALLEL)
    const batchEmbeds = await Promise.all(batch.map(t => createEmbedding(t)))
    batchEmbeds.forEach((e, j) => { results[i + j] = e })
    onProgress?.(Math.min(i + PARALLEL, texts.length), texts.length)
    if (i + PARALLEL < texts.length) {
      await new Promise(r => setTimeout(r, PAUSE_MS))
    }
  }
  return results
}

// ── Chunking (word-based, overlap-aware) ────────────────────────
export function chunkText(
  text: string,
  chunkSize = 700,
  overlap = 100
): string[] {
  const clean = text
    .replace(/\s+/g, ' ')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()

  const words = clean.split(' ')
  const chunks: string[] = []
  let start = 0

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length)
    const chunk = words.slice(start, end).join(' ')
    if (chunk.trim().length > 60) chunks.push(chunk.trim())
    start += chunkSize - overlap
  }
  return chunks
}

// ── Extract PDF text via Gemini (no local library — works in Cloudflare Workers) ──
async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  if (pdfBuffer.length > 15 * 1024 * 1024) {
    throw new Error('ไฟล์ใหญ่เกิน 15MB สำหรับการ extract — กรุณาบีบอัดหรือแบ่งไฟล์')
  }
  const base64 = pdfBuffer.toString('base64')
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: 'Extract ALL text from this PDF. Return only the plain text with paragraphs preserved. No commentary or markdown.' },
            { inline_data: { mime_type: 'application/pdf', data: base64 } }
          ]
        }],
        generationConfig: { temperature: 0, maxOutputTokens: 65536 }
      })
    }
  )
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini PDF extract error (${res.status}): ${err.slice(0, 200)}`)
  }
  const data = await res.json()
  const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  if (!text || text.trim().length < 50) {
    throw new Error('ดึงข้อความจาก PDF ไม่ได้ — อาจเป็น scanned image หรือ PDF ที่มีแต่รูปภาพ')
  }
  return text
}

// ── Main pipeline ────────────────────────────────────────────────
export async function processPDFBuffer(
  pdfBuffer: Buffer,
  documentId: string,
  filename: string,
  onProgress?: (event: ProgressEvent) => void
): Promise<{ success: boolean; chunkCount: number; error?: string }> {

  const emit = (stage: ProgressEvent['stage'], pct: number, detail?: string) => {
    onProgress?.({ stage, pct, detail })
  }

  try {
    emit('parsing', 5, 'กำลัง parse PDF...')

    // Use Gemini to extract text — no local library needed, works in Cloudflare Workers
    const rawText = await extractTextFromPDF(pdfBuffer)

    if (!rawText || rawText.trim().length < 80) {
      throw new Error('PDF ไม่มีข้อความ หรือเป็น scanned image')
    }

    emit('chunking', 15, 'กำลัง chunk...')

    const chunks = chunkText(rawText)
    emit('embedding', 20, `${chunks.length} chunks → กำลัง embed...`)

    const embeddings = await createEmbeddingsBatch(
      chunks,
      (done, total) => {
        const pct = 20 + Math.round((done / total) * 65)
        emit('embedding', pct, `embedding ${done}/${total} chunks`)
      }
    )

    emit('saving', 87, `กำลังบันทึก ${chunks.length} chunks ลง Supabase...`)

    const BULK_SIZE = 50
    for (let i = 0; i < chunks.length; i += BULK_SIZE) {
      const rows = chunks.slice(i, i + BULK_SIZE).map((text, j) => ({
        document_id: documentId,
        chunk_text:  text,
        chunk_index: i + j,
        embedding:   embeddings[i + j],
        metadata: {
          filename,
          chunk_index:  i + j,
          total_chunks: chunks.length
        }
      }))

      const { error } = await supabase.from('knowledge_chunks').insert(rows)
      if (error) throw error

      const pct = 87 + Math.round(((i + BULK_SIZE) / chunks.length) * 10)
      emit('saving', Math.min(pct, 97), `บันทึก ${Math.min(i + BULK_SIZE, chunks.length)}/${chunks.length}`)
    }

    await supabase
      .from('knowledge_documents')
      .update({ status: 'ready', chunk_count: chunks.length })
      .eq('id', documentId)

    emit('done', 100, `✅ พร้อมใช้งาน — ${chunks.length} chunks`)
    return { success: true, chunkCount: chunks.length }

  } catch (err: any) {
    console.error('[pdf-pipeline]', err)
    await supabase
      .from('knowledge_documents')
      .update({ status: 'error' })
      .eq('id', documentId)
    emit('error', 0, err.message)
    return { success: false, chunkCount: 0, error: err.message }
  }
}

export type ProgressEvent = {
  stage: 'parsing' | 'chunking' | 'embedding' | 'saving' | 'done' | 'error'
  pct: number
  detail?: string
}
