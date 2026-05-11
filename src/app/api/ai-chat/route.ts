import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { searchKnowledge } from '@/lib/pdf-pipeline'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json()
    if (!message?.trim()) return NextResponse.json({ error: 'ไม่มีข้อความ' }, { status: 400 })

    const knowledge = await searchKnowledge(message, 5)

    const context = knowledge.length > 0
      ? `## ข้อมูลจากคลังความรู้ VME · IPS:\n\n${
          knowledge.map((k: any) =>
            `### ${k.title}\n${k.content}\n*(${k.source_file} หน้า ${k.page_start}-${k.page_end})*`
          ).join('\n\n---\n\n')
        }`
      : '## หมายเหตุ: ไม่พบข้อมูลที่เกี่ยวข้องในคลังความรู้'

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `คุณคือ น้องแก้วใส (Nong Kaew Sai) ผู้ช่วย AI ของโครงการ VME · IPS Reflection
ช่วยอาสาการศึกษาถอดบทเรียน วางแผน และค้นหาความรู้จากโครงการ
ตอบเป็นภาษาไทย กระชับ ชัดเจน เป็นกันเอง
อ้างอิงจากข้อมูลที่ให้มาเป็นหลัก ถ้าไม่มีข้อมูลให้บอกตรงๆ

${context}`,
      messages: [
        ...history.slice(-10),
        { role: 'user', content: message }
      ],
    })

    const answer = response.content[0].type === 'text' ? response.content[0].text : ''

    return NextResponse.json({
      answer,
      sources: knowledge.map((k: any) => ({
        title:      k.title,
        file:       k.source_file,
        category:   k.category,
        pages:      `${k.page_start}-${k.page_end}`,
        similarity: Math.round(k.similarity * 100),
      })),
    })
  } catch (err: any) {
    console.error('AI Chat error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
