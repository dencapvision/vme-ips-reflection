import { getSupabaseAdmin } from './clients'
import { chunkText, createEmbeddingsBatch } from './pdf-pipeline'

export type KnowledgeProgressEvent = {
  stage: 'parsing' | 'chunking' | 'embedding' | 'saving' | 'done' | 'error'
  pct: number
  detail?: string
}

export async function processTextContent(
  text: string,
  documentId: string,
  filename: string,
  onProgress?: (event: KnowledgeProgressEvent) => void
): Promise<{ success: boolean; chunkCount: number; error?: string }> {

  const emit = (stage: KnowledgeProgressEvent['stage'], pct: number, detail?: string) => {
    onProgress?.({ stage, pct, detail })
  }

  try {
    if (!text || text.trim().length < 10) {
      throw new Error('เนื้อหาเอกสารสั้นเกินไป (ขั้นต่ำ 10 ตัวอักษร)')
    }

    emit('chunking', 5, 'กำลังแบ่งเนื้อหาเป็นส่วนๆ...')

    const chunks = chunkText(text)
    emit('embedding', 15, `${chunks.length} chunks → กำลังสร้าง embeddings...`)

    const embeddings = await createEmbeddingsBatch(
      chunks,
      (done, total) => {
        const pct = 15 + Math.round((done / total) * 75)
        emit('embedding', pct, `ประมวลผล ${done}/${total} chunks`)
      }
    )

    emit('saving', 90, `กำลังบันทึก ${chunks.length} chunks ลงฐานข้อมูล...`)

    const BULK_SIZE = 50
    const supabase = getSupabaseAdmin()

    for (let i = 0; i < chunks.length; i += BULK_SIZE) {
      const rows = chunks.slice(i, i + BULK_SIZE).map((chunkText, j) => ({
        document_id: documentId,
        chunk_text:  chunkText,
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

      const pct = 90 + Math.round(((i + BULK_SIZE) / chunks.length) * 8)
      emit('saving', Math.min(pct, 98), `บันทึก ${Math.min(i + BULK_SIZE, chunks.length)}/${chunks.length}`)
    }

    await supabase
      .from('knowledge_documents')
      .update({ status: 'ready', chunk_count: chunks.length })
      .eq('id', documentId)

    emit('done', 100, `✅ สำเร็จ — ทั้งหมด ${chunks.length} chunks`)
    return { success: true, chunkCount: chunks.length }

  } catch (err: any) {
    console.error('[knowledge-pipeline]', err)
    await getSupabaseAdmin()
      .from('knowledge_documents')
      .update({ status: 'error' })
      .eq('id', documentId)
    emit('error', 0, err.message)
    return { success: false, chunkCount: 0, error: err.message }
  }
}
