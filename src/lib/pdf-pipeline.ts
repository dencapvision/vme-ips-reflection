import { getSupabaseAdmin } from './clients'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!

// ── Embedding (single) ──────────────────────────────────────────
// outputDimensionality: 768 — matches existing Supabase vector(768) schema
const EMBED_MODELS = ['gemini-embedding-001', 'gemini-embedding-2', 'gemini-embedding-2-preview']
const EMBED_DIMS = 768

export async function createEmbedding(text: string): Promise<number[]> {
  let lastError: Error | null = null
  for (const model of EMBED_MODELS) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: `models/${model}`,
          content: { parts: [{ text: text.slice(0, 8000) }] },
          outputDimensionality: EMBED_DIMS
        })
      }
    )
    if (res.ok) {
      const resText = await res.text()
      const data = JSON.parse(resText)
      return data.embedding.values as number[]
    }
    const errText = await res.text()
    if (res.status === 404) {
      lastError = new Error(`Gemini embed error: ${errText}`)
      continue
    }
    throw new Error(`Gemini embed error: ${errText}`)
  }
  throw lastError ?? new Error('All embedding models unavailable')
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

// ── Extract PDF text — PRIMARY: Claude 3.5 Haiku, FALLBACK: Gemini ──
// Claude uses Anthropic's native PDF Document API (reliable, no Gemini quota issues)
// Fallback chain: gemini-1.5-flash → gemini-2.0-flash → gemini-2.5-flash
const GEMINI_FALLBACK_MODELS = [
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-2.5-flash',
]

async function extractTextFromPDF(pdfBuffer: Uint8Array): Promise<string> {
  if (pdfBuffer.length > 15 * 1024 * 1024) {
    throw new Error('ไฟล์ใหญ่เกิน 15MB สำหรับการ extract — กรุณาบีบอัดหรือแบ่งไฟล์')
  }

  // Use btoa for Edge compatibility if Buffer is not preferred
  const base64 = typeof Buffer !== 'undefined' 
    ? Buffer.from(pdfBuffer).toString('base64')
    : btoa(String.fromCharCode(...new Uint8Array(pdfBuffer)));

  let lastError = ''

  // ── PRIMARY: Claude 3.5 Haiku (Anthropic Native PDF API) ─────────
  if (ANTHROPIC_API_KEY && ANTHROPIC_API_KEY !== 'placeholder') {
    try {
      console.log('[pdf-pipeline] Extracting PDF via Claude 3.5 Haiku (primary)')
      const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-beta': 'pdfs-2024-09-25'
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 8192,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: base64
                }
              },
              {
                type: 'text',
                text: 'Extract ALL text from this PDF document. Return only the plain text content with paragraphs preserved. Do not add commentary, markdown formatting, or explanations — just the raw text.'
              }
            ]
          }]
        })
      })

      if (claudeRes.ok) {
        const resText = await claudeRes.text()
        const claudeData = JSON.parse(resText)
        const text: string = claudeData.content?.[0]?.text ?? ''
        if (text && text.trim().length >= 50) {
          console.log('[pdf-pipeline] ✅ PDF extracted via Claude 3.5 Haiku')
          return text
        }
        lastError = 'Claude returned empty text'
      } else {
        const claudeErr = await claudeRes.text()
        lastError = `Claude error (${claudeRes.status}): ${claudeErr.slice(0, 200)}`
        console.warn(`[pdf-pipeline] ${lastError} — will try Gemini fallback`)
      }
    } catch (claudeEx: any) {
      lastError = `Claude exception: ${claudeEx.message}`
      console.warn(`[pdf-pipeline] ${lastError} — will try Gemini fallback`)
    }
  } else {
    lastError = 'ANTHROPIC_API_KEY not configured'
    console.warn('[pdf-pipeline] Claude skipped: no API key — trying Gemini')
  }

  // ── FALLBACK: Gemini model chain ──────────────────────────────────
  for (const model of GEMINI_FALLBACK_MODELS) {
    try {
      console.log(`[pdf-pipeline] Trying Gemini fallback: ${model}`)
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
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

      if (res.ok) {
        const resText = await res.text()
        const data = JSON.parse(resText)
        const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
        if (text && text.trim().length >= 50) {
          console.log(`[pdf-pipeline] ✅ PDF extracted via Gemini fallback: ${model}`)
          return text
        }
        lastError = `${model} returned empty text`
        continue
      }

      const errText = await res.text()
      lastError = `${model} error (${res.status}): ${errText.slice(0, 150)}`
      if (res.status >= 500) break // Server error → stop trying
      console.warn(`[pdf-pipeline] ${lastError} — trying next model`)
    } catch (ex: any) {
      lastError = `${model} exception: ${ex.message}`
      console.warn(`[pdf-pipeline] ${lastError}`)
    }
  }

  throw new Error(`PDF extraction failed. Last error: ${lastError}`)
}

// ── Main pipeline ────────────────────────────────────────────────
export async function processPDFBuffer(
  pdfBuffer: Uint8Array,
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

      const supabase = getSupabaseAdmin()
      const { error } = await supabase.from('knowledge_chunks').insert(rows)
      if (error) throw error

      const pct = 87 + Math.round(((i + BULK_SIZE) / chunks.length) * 10)
      emit('saving', Math.min(pct, 97), `บันทึก ${Math.min(i + BULK_SIZE, chunks.length)}/${chunks.length}`)
    }

    await getSupabaseAdmin()
      .from('knowledge_documents')
      .update({ status: 'ready', chunk_count: chunks.length })
      .eq('id', documentId)

    emit('done', 100, `✅ พร้อมใช้งาน — ${chunks.length} chunks`)
    return { success: true, chunkCount: chunks.length }

  } catch (err: any) {
    console.error('[pdf-pipeline]', err)
    await getSupabaseAdmin()
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
