import { NextRequest, NextResponse } from 'next/server'
import { deleteKnowledgeFile } from '@/lib/knowledge'

export async function DELETE(req: NextRequest) {
  try {
    const { filename } = await req.json()
    if (!filename) return NextResponse.json({ error: 'ต้องระบุ filename' }, { status: 400 })
    const result = await deleteKnowledgeFile(filename)
    return NextResponse.json({ success: true, ...result })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
