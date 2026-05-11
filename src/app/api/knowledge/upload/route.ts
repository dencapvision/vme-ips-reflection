import { NextRequest, NextResponse } from 'next/server'
import { processPDF } from '@/lib/pdf-pipeline'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file     = form.get('file') as File | null
    const category = (form.get('category') as string) || 'general'
    if (!file) return NextResponse.json({ error: 'ไม่พบไฟล์' }, { status: 400 })
    if (!file.name.toLowerCase().endsWith('.pdf'))
      return NextResponse.json({ error: 'รองรับเฉพาะ .pdf' }, { status: 400 })
    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await processPDF({ buffer, filename: file.name, category })
    return NextResponse.json({ success: true, result })
  } catch (err: any) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
