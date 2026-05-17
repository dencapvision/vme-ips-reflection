import { NextRequest, NextResponse } from 'next/server'
import { getMemberByName } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { signSession, sessionCookieOptions, SESSION_COOKIE } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const rawFirstName = (body.first_name as string | undefined) ?? ''
    const rawLastName  = (body.last_name  as string | undefined) ?? ''

    const first_name = rawFirstName.trim().replace(/\s+/g, ' ')
    const last_name  = rawLastName.trim().replace(/\s+/g, ' ')

    if (!first_name || !last_name) {
      return NextResponse.json({ error: 'กรุณากรอกชื่อและนามสกุล' }, { status: 400 })
    }

    // 1. Verify member exists in `members` table
    const member = await getMemberByName(first_name, last_name)
    if (!member) {
      return NextResponse.json(
        { error: 'ไม่พบชื่อของท่านในระบบ กรุณาติดต่อเจ้าหน้าที่' },
        { status: 404 }
      )
    }

    // 2. Look up the matching profiles.id so profile pages can load
    const adminClient = createAdminClient()
    const { data: profileRow } = await adminClient
      .from('profiles')
      .select('id')
      .eq('first_name', first_name)
      .eq('last_name', last_name)
      .maybeSingle()

    // 3. Sign JWT — include profile_id when available
    const token = await signSession({
      sub: member.id,
      type: 'member',
      first_name: member.first_name,
      last_name: member.last_name,
      profile_id: profileRow?.id ?? undefined,
    })

    const response = NextResponse.json({ success: true })
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions())
    return response

  } catch (err) {
    console.error('[member-login]', err)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในระบบ' }, { status: 500 })
  }
}
