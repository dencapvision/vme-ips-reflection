import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/clients'
import { processPDFBuffer } from '@/lib/pdf-pipeline'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const LOG = (msg: string, data?: unknown) => console.log(`[upload] ${msg}`, data ?? '')

  try {
    const supabase = getSupabaseAdmin()
    LOG('Request received')

    const body = await req.json()
    const base64 = body.file
    const filename = body.filename as string
    const title = (body.title as string) || ''
    const category = (body.category as string) || 'ทั่วไป'

    // ── Validate ──────────────────────────────────────────────────
    if (!base64) {
      LOG('❌ No file in form data')
      return NextResponse.json({ message: 'ไม่พบไฟล์ในคำขอ' }, { status: 400 })
    }

    // ── Read arrayBuffer ──────────────────────────────────────────
    // Using Buffer.from is faster than atob and works with unenv in Cloudflare Edge
    const uint8Array = Buffer.from(base64, 'base64')

    if (uint8Array.length > 30 * 1024 * 1024) {
      LOG(`❌ File too large: ${uint8Array.length} bytes`)
      return NextResponse.json({ message: 'ไฟล์ใหญ่เกิน 30MB' }, { status: 400 })
    }

    LOG(`✅ File valid: ${filename} (${(uint8Array.length / 1024 / 1024).toFixed(2)}MB)`)

    const uniqueFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`
    const storagePath = `pdfs/${uniqueFilename}`

    // ── Insert document record FIRST (before any slow I/O) ───────
    // NOTE: Storage upload moved INSIDE the SSE stream below so that
    // a slow upload to Supabase Storage never blocks the DB insert.
    // On Cloudflare Workers, blocking here before returning the Response
    // can cause the Worker to be killed before the record is saved.
    LOG('Inserting document record to DB...')
    const { data: doc, error: docError } = await supabase
      .from('knowledge_documents')
      .insert({
        title:        title || filename.replace(/\.pdf$/i, ''),
        filename:     filename,
        storage_path: storagePath,
        category,
        source_type:  'pdf',
        status:       'processing',
        chunk_count:  0
      })
      .select('id, title')
      .single()

    if (docError || !doc) {
      LOG('❌ DB insert failed:', docError)
      const hint = docError?.message.includes('relation')
        ? ' — ตาราง knowledge_documents ไม่มี กรุณา run SQL migration ก่อน (supabase/migrations/002_knowledge_documents.sql)'
        : docError?.message.includes('violates') || docError?.message.includes('policy')
        ? ' — RLS policy บล็อกการ insert กรุณาตรวจสอบ policy ของ knowledge_documents'
        : ''
      return NextResponse.json({
        message: `Database insert failed: ${docError?.message}${hint}`,
        debug: { code: docError?.code, details: docError?.details, hint: docError?.hint }
      }, { status: 500 })
    }
    LOG(`✅ Document record created: ${doc.id} — "${doc.title}"`)

    // ── SSE streaming pipeline ────────────────────────────────────
    const encoder = new TextEncoder()
    const stream  = new ReadableStream({
      async start(controller) {
        const send = (data: object) => {
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
          } catch (e) {
            LOG('SSE enqueue error:', e)
          }
        }

        // Send 'queued' immediately so frontend sees the document in DB
        LOG('Starting PDF pipeline...')
        send({ stage: 'queued', pct: 3, detail: `บันทึกแล้ว — กำลังเริ่มประมวลผล "${doc.title}"`, documentId: doc.id })

        // ── Upload to Storage (inside stream, non-blocking for DB insert) ──
        LOG(`Uploading to storage: ${storagePath}`)
        const { error: uploadError } = await supabase.storage
          .from('knowledge-pdfs')
          .upload(storagePath, uint8Array, { 
            contentType: 'application/pdf', 
            upsert: false,
            // Force use of arrayBuffer to avoid unenv stream issues
            duplex: 'half' 
          } as any)

        if (uploadError) {
          LOG('⚠️ Storage upload failed:', uploadError.message)
          if (uploadError.message.includes('not found') || uploadError.message.includes('bucket')) {
            send({ stage: 'error', pct: 0, detail: `❌ ไม่พบ Bucket "knowledge-pdfs" ใน Supabase Storage กรุณาสร้างก่อน`, documentId: doc.id })
            controller.close()
            return
          }
        } else {
          LOG('✅ File uploaded to storage')
        }

        try {
          const result = await processPDFBuffer(uint8Array, doc.id, filename, (event) => {
            LOG(`Pipeline: ${event.stage} ${event.pct}%`, event.detail)
            send({ ...event, documentId: doc.id })
          })

          if (result.success) {
            LOG(`✅ Pipeline done: ${result.chunkCount} chunks`)
            send({ stage: 'complete', pct: 100, detail: `✅ พร้อมใช้งาน — ${result.chunkCount} chunks`, documentId: doc.id })
          } else {
            LOG('❌ Pipeline failed:', result.error)
            send({ stage: 'error', pct: 0, detail: result.error || 'Pipeline failed', documentId: doc.id })
          }
        } catch (pipelineErr: unknown) {
          const msg = pipelineErr instanceof Error ? pipelineErr.message : String(pipelineErr)
          LOG('❌ Pipeline exception:', pipelineErr)
          send({ stage: 'error', pct: 0, detail: msg, documentId: doc.id })
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

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : undefined
    console.error('[upload] Unhandled error:', err)
    return NextResponse.json({
      message: `Server error: ${msg}`,
      stack: process.env.NODE_ENV === 'development' ? stack : undefined
    }, { status: 500 })
  }
}
