import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/clients'
import { processTextContent } from '@/lib/knowledge-pipeline'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!

async function extractTextFromDocx(base64: string): Promise<string> {
  const model = 'gemini-1.5-flash'
  console.log(`[knowledge-text] Extracting Word via ${model}`)
  
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: 'Extract ALL text from this Word document. Return only the plain text with paragraphs preserved. No commentary or markdown.' },
            { inline_data: { 
              mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
              data: base64 
            } }
          ]
        }],
        generationConfig: { temperature: 0, maxOutputTokens: 65536 }
      })
    }
  )

  if (res.ok) {
    const data = await res.json()
    const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    if (text && text.trim().length >= 10) {
      return text
    }
  }
  
  const errText = await res.text()
  throw new Error(`Word extraction failed: ${errText.slice(0, 200)}`)
}

export async function POST(req: NextRequest) {
  const LOG = (msg: string, data?: unknown) => console.log(`[knowledge-text] ${msg}`, data ?? '')

  try {
    const supabase = getSupabaseAdmin()
    const body = await req.json()
    
    const { 
      text: inputWeight, 
      file: base64, 
      filename, 
      title, 
      category, 
      type 
    } = body

    let content = inputWeight || ''
    const sourceType = type === 'docx' ? 'docx' : 'text'

    // ── Insert document record FIRST ──────────────────────────
    LOG(`Inserting document record: ${title || filename}`)
    const { data: doc, error: docError } = await supabase
      .from('knowledge_documents')
      .insert({
        title:        title || filename || 'Untitled Text',
        filename:     filename || 'pasted-text',
        category:     category || 'ทั่วไป',
        source_type:  sourceType,
        status:       'processing',
        chunk_count:  0
      })
      .select('id, title')
      .single()

    if (docError || !doc) {
      LOG('❌ DB insert failed:', docError)
      return NextResponse.json({ message: `Database insert failed: ${docError?.message}` }, { status: 500 })
    }

    // ── SSE streaming pipeline ────────────────────────────────────
    const encoder = new TextEncoder()
    const stream  = new ReadableStream({
      async start(controller) {
        const send = (data: object) => {
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
          } catch (e) {}
        }

        send({ stage: 'queued', pct: 3, detail: `เตรียมพร้อมประมวลผล "${doc.title}"`, documentId: doc.id })

        try {
          // If it's a docx, we need to extract text first
          if (type === 'docx' && base64) {
            send({ stage: 'parsing', pct: 10, detail: 'กำลังดึงข้อความจากไฟล์ Word...' })
            content = await extractTextFromDocx(base64)
          }

          if (!content || content.trim().length < 10) {
            throw new Error('ไม่พบเนื้อหาที่ต้องการประมวลผล')
          }

          const result = await processTextContent(content, doc.id, filename || 'text', (event) => {
            LOG(`Pipeline: ${event.stage} ${event.pct}%`, event.detail)
            send({ ...event, documentId: doc.id })
          })

          if (result.success) {
            send({ stage: 'complete', pct: 100, detail: `✅ สำเร็จ — ${result.chunkCount} chunks`, documentId: doc.id })
          } else {
            send({ stage: 'error', pct: 0, detail: result.error || 'Pipeline failed', documentId: doc.id })
          }
        } catch (err: any) {
          LOG('❌ Pipeline exception:', err)
          send({ stage: 'error', pct: 0, detail: err.message, documentId: doc.id })
        }

        controller.close()
      }
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type':      'text/event-stream',
        'Cache-Control':     'no-cache',
        'Connection':        'keep-alive',
        'X-Document-Id':     doc.id,
        'X-Accel-Buffering': 'no'
      }
    })

  } catch (err: any) {
    console.error('[knowledge-text] error:', err)
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
