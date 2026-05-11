import { NextResponse } from 'next/server'
import { listKnowledgeFiles } from '@/lib/pdf-pipeline'

export async function GET() {
  try {
    const files = await listKnowledgeFiles()
    return NextResponse.json({ files })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
