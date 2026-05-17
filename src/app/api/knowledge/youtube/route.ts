import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createEmbeddingsBatch } from '@/lib/pdf-pipeline'

export const maxDuration = 300
export const runtime = 'edge'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function extractVideoId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export async function POST(req: NextRequest) {
  try {
    const { youtubeUrl, title, category } = await req.json()

    const videoId = extractVideoId(youtubeUrl)
    if (!videoId) {
      return NextResponse.json({ message: 'YouTube URL ไม่ถูกต้อง' }, { status: 400 })
    }

    const { YoutubeTranscript } = await import('youtube-transcript')
    let transcriptItems: Array<{ text: string; offset: number; duration: number }>

    try {
      transcriptItems = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'th' })
    } catch {
      transcriptItems = await YoutubeTranscript.fetchTranscript(videoId)
    }

    if (!transcriptItems || transcriptItems.length === 0) {
      return NextResponse.json({
        message: 'วิดีโอนี้ไม่มี transcript/caption — กรุณาเปิด subtitle ก่อน'
      }, { status: 400 })
    }

    // Group into 2-minute segments
    const SEGMENT_SEC = 120
    const segments: Array<{ text: string; startSec: number; endSec: number }> = []
    let current = { text: '', startSec: 0, endSec: 0 }

    for (const item of transcriptItems) {
      const sec = Math.floor(item.offset / 1000)
      if (current.text === '') current.startSec = sec
      current.text += ' ' + item.text
      current.endSec = sec

      if (sec - current.startSec >= SEGMENT_SEC) {
        segments.push({ ...current, text: current.text.trim() })
        current = { text: '', startSec: 0, endSec: 0 }
      }
    }
    if (current.text.trim()) segments.push(current)

    const { data: doc } = await supabase
      .from('knowledge_documents')
      .insert({
        title:        title || `YouTube: ${videoId}`,
        filename:     `youtube-${videoId}`,
        storage_path: `youtube/${videoId}`,
        source_type:  'youtube',
        source_url:   youtubeUrl,
        category:     category || 'วิดีโอ YouTube',
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

        send({ stage: 'transcript', pct: 10, detail: `${segments.length} segments จาก transcript`, documentId: doc.id })

        const texts = segments.map(s => s.text)
        const embeddings = await createEmbeddingsBatch(texts, (done, total) => {
          const pct = 10 + Math.round((done / total) * 75)
          send({ stage: 'embedding', pct, detail: `embedding ${done}/${total}`, documentId: doc.id })
        })

        const rows = segments.map((seg, i) => ({
          document_id: doc.id,
          chunk_text:  seg.text,
          chunk_index: i,
          embedding:   embeddings[i],
          metadata: {
            source_type: 'youtube',
            video_id:    videoId,
            start_sec:   seg.startSec,
            end_sec:     seg.endSec,
            youtube_url: `${youtubeUrl}&t=${seg.startSec}s`
          }
        }))

        const BULK = 50
        for (let i = 0; i < rows.length; i += BULK) {
          await supabase.from('knowledge_chunks').insert(rows.slice(i, i + BULK))
          send({ stage: 'saving', pct: 85 + Math.round((i / rows.length) * 12), documentId: doc.id })
        }

        await supabase
          .from('knowledge_documents')
          .update({ status: 'ready', chunk_count: segments.length })
          .eq('id', doc.id)

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
