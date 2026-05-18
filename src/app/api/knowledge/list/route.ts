import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/clients'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') || null
    const supabase = getSupabaseAdmin()

    let query = supabase
      .from('knowledge_documents')
      .select('id, title, filename, chunk_count, status, category, source_type, created_at')
      .order('created_at', { ascending: false })

    if (category && category !== 'ทั้งหมด') {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('[knowledge/list] Supabase error:', error)
      const hint = error.message.includes('relation') || error.message.includes('exist')
        ? ' — ตาราง knowledge_documents ไม่มี กรุณา run SQL migration ก่อน (supabase/migrations/002_knowledge_documents.sql)'
        : ''
      return NextResponse.json({
        message: `Database error: ${error.message}${hint}`,
        documents: [],
        debug: { code: error.code, hint: error.hint }
      }, { status: 500 })
    }

    console.log(`[knowledge/list] Returning ${data?.length ?? 0} documents`)
    return NextResponse.json({
      documents: data ?? [],
      total: data?.length ?? 0
    })

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[knowledge/list] Unhandled error:', err)
    return NextResponse.json({ message: msg, documents: [] }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'ต้องระบุ id' }, { status: 400 })
    const supabase = getSupabaseAdmin()

    // Get storage path before deleting
    const { data: doc } = await supabase
      .from('knowledge_documents')
      .select('storage_path, title')
      .eq('id', id)
      .single()

    // Delete storage file (best effort)
    if (doc?.storage_path) {
      const { error: storageErr } = await supabase.storage
        .from('knowledge-pdfs')
        .remove([doc.storage_path])
      if (storageErr) console.warn('[knowledge/list] Storage delete warning:', storageErr.message)
    }

    // Delete chunks first (in case no CASCADE)
    await supabase.from('knowledge_chunks').delete().eq('document_id', id)

    // Delete document record
    const { error } = await supabase.from('knowledge_documents').delete().eq('id', id)
    if (error) throw error

    console.log(`[knowledge/list] Deleted document: ${doc?.title ?? id}`)
    return NextResponse.json({ success: true })

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[knowledge/list] Delete error:', err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
