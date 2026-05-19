import { NextRequest, NextResponse } from 'next/server'
import { getMemberByName } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/clients'
import { signSession, sessionCookieOptions, SESSION_COOKIE } from '@/lib/session'

export const dynamic = 'force-dynamic'


export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text()
    const body = JSON.parse(bodyText)
    const rawFirstName = (body.first_name as string | undefined) ?? ''
    const rawLastName  = (body.last_name  as string | undefined) ?? ''

    const first_name = rawFirstName.trim().replace(/\s+/g, ' ')
    const last_name  = rawLastName.trim().replace(/\s+/g, ' ')

    if (!first_name || !last_name) {
      return NextResponse.json({ error: 'กรุณากรอกชื่อและนามสกุล' }, { status: 400 })
    }

    const adminClient = getSupabaseAdmin()

    // 1. Double verification lookup: Primary is profiles, secondary/fallback is members whitelist
    const { data: profileRow } = await adminClient
      .from('profiles')
      .select('id, first_name, last_name, role')
      .eq('first_name', first_name)
      .eq('last_name', last_name)
      .maybeSingle()

    let member = await getMemberByName(first_name, last_name)

    // 2. Self-Healing Mechanism:
    // If the user has a profile but is missing in the members (whitelist) table,
    // we silently repair the database and insert them to ensure seamless real-time access.
    if (profileRow && profileRow.role !== 'admin' && !member) {
      console.log(`[self-healing] Syncing missing member to members table: ${first_name} ${last_name}`)
      const { error: insertErr } = await adminClient
        .from('members')
        .insert({
          first_name,
          last_name,
        })
      
      if (!insertErr || insertErr.code === '23505') {
        // Fetch the newly created member row
        member = await getMemberByName(first_name, last_name)
      } else {
        console.error('[self-healing] Failed to insert missing member:', insertErr)
      }
    }

    // 3. Fallback Validation: If still no member and no profile, reject
    if (!member && !profileRow) {
      return NextResponse.json(
        { error: 'ไม่พบชื่อของท่านในระบบ กรุณาติดต่อเจ้าหน้าที่' },
        { status: 404 }
      )
    }

    // If it's an admin trying to login via member portal, redirect/reject them
    if (profileRow?.role === 'admin') {
      return NextResponse.json(
        { error: 'ผู้ดูแลระบบกรุณาเข้าสู่ระบบผ่านช่องทางเฉพาะ' },
        { status: 403 }
      )
    }

    // 4. Sign JWT — include profile_id when available
    // Fallback to profileRow.id or member.id dynamically to ensure sessions always work
    const memberId = member?.id || profileRow?.id || 'unknown'
    const finalFirstName = member?.first_name || profileRow?.first_name || first_name
    const finalLastName = member?.last_name || profileRow?.last_name || last_name

    const token = await signSession({
      sub: memberId,
      type: 'member',
      first_name: finalFirstName,
      last_name: finalLastName,
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
