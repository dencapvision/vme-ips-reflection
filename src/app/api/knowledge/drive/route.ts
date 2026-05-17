import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/clients'
import { processPDFBuffer } from '@/lib/pdf-pipeline'

export const maxDuration = 300
export const runtime = 'edge'

function extractDriveFileId(url: string): string | null {
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/open\?id=([a-zA-Z0-9_-]+)/
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase()
    const { driveUrl, title, category } = await req.json()

    const fileId = extractDriveFileId(driveUrl)
    if (!fileId) {
      return NextResponse.json({ message: 'ลิงก์ Drive ไม่ถูกต้อง' }, { status: 400 })
    }

    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`
    const fileRes = await fetch(downloadUrl)

    if (!fileRes.ok) {
      return NextResponse.json({
        message: 'ไม่สามารถดาวน์โหลดจาก Drive — กรุณาตรวจสอบสิทธิ์การแชร์ (Anyone with the link)'
      }, { status: 400 })
    }

    const buffer      = Buffer.from(await fileRes.arrayBuffer())
    const filename    = `drive-${fileId}.pdf`
    const storagePath = `pdfs/${Date.now()}-${filename}`

    await supabase.storage
      .from('knowledge-pdfs')
      .upload(storagePath, buffer, { contentType: 'application/pdf' })

    const { data: doc } = await supabase
      .from('knowledge_documents')
      .insert({
        title:        title || `Drive: ${fileId}`,
        filename,
        storage_path: storagePath,
        source_type:  'google_drive',
        source_url:   driveUrl,
        category:     category || 'Google Drive',
        status:       'processing'
      })
      .select('id')
      .single()

    if (!doc) throw new Error('Cannot create document record')

    const encoder = new TextEncoder()
    const stream  = new ReadableStream({
      async start(controller) {
        const send = (data: object) =>
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))

        send({ stage: 'download', pct: 5, detail: 'ดาวน์โหลดจาก Drive สำเร็จ', documentId: doc.id })

        await processPDFBuffer(buffer, doc.id, filename, (event) => {
          send({ ...event, documentId: doc.id })
        })

        send({ stage: 'complete', pct: 100, documentId: doc.id })
        controller.close()
      }
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type':  'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection':    'keep-alive'
      }
    })

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
