import { NextRequest, NextResponse } from 'next/server'
import { getAdminByEmail, verifyPassword } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { signSession, sessionCookieOptions, SESSION_COOKIE } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email    = (body.email    as string | undefined)?.trim().toLowerCase() ?? ''
    const password = (body.password as string | undefined) ?? ''

    if (!email || !password) {
      return NextResponse.json({ error: 'กรุณากรอกอีเมลและรหัสผ่าน' }, { status: 400 })
    }

    // 1. Verify credentials against `admins` table
    const admin = await getAdminByEmail(email)
    const passwordOk = admin ? verifyPassword(password, admin.password_hash) : false

    if (!admin || !passwordOk) {
      return NextResponse.json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 })
    }

    // 2. Find auth.users.id by email → this equals profiles.id
    const supabaseAdmin = createAdminClient()
    const { data: userList } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
    const matchedUser = userList?.users?.find(u => u.email === email)
    const profile_id = matchedUser?.id ?? undefined

    // 3. Sign JWT
    const token = await signSession({
      sub: admin.id,
      type: 'admin',
      email: admin.email,
      profile_id,
    })

    const response = NextResponse.json({ success: true, redirect: '/admin/users' })
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions())
    return response

  } catch (err) {
    console.error('[admin-login]', err)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในระบบ' }, { status: 500 })
  }
}
