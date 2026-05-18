import { NextRequest, NextResponse } from 'next/server'
import { getAdminByEmail, verifyPassword } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/clients'
import { signSession, sessionCookieOptions, SESSION_COOKIE } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email    = (body.email    as string | undefined)?.trim().toLowerCase() ?? ''
    const password = (body.password as string | undefined) ?? ''

    console.log('[admin-login] Attempting login for:', email)

    // Check environment variables with detailed diagnostics
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log('[admin-login] Diagnostics - SUPABASE_URL present:', !!supabaseUrl, 'SERVICE_ROLE present:', !!serviceRole)
    
    if (!supabaseUrl || supabaseUrl.includes('your_supabase_url') || supabaseUrl === 'placeholder') {
      console.error('[admin-login] Critical Error: NEXT_PUBLIC_SUPABASE_URL is missing, empty, or placeholder in runtime process.env.')
      console.error('[admin-login] Diagnostic: If deploying to Cloudflare Pages, make sure to add NEXT_PUBLIC_SUPABASE_URL in Pages Project Settings > Environment Variables (both Production and Preview envs).')
      return NextResponse.json({ 
        error: 'การตั้งค่าระบบไม่ถูกต้อง (Database URL หรือ NEXT_PUBLIC_SUPABASE_URL ไม่ถูกกำหนดใน Cloudflare Pages)' 
      }, { status: 500 })
    }
    
    if (!serviceRole || serviceRole.includes('your_supabase_service_role') || serviceRole === 'placeholder') {
      console.error('[admin-login] Critical Error: SUPABASE_SERVICE_ROLE_KEY is missing, empty, or placeholder in runtime process.env.')
      console.error('[admin-login] Diagnostic: Make sure SUPABASE_SERVICE_ROLE_KEY is added to Cloudflare Pages project settings or wrangler secrets.')
      return NextResponse.json({ 
        error: 'การตั้งค่าระบบไม่ถูกต้อง (Service Key หรือ SUPABASE_SERVICE_ROLE_KEY ไม่ถูกกำหนดใน Cloudflare Pages)' 
      }, { status: 500 })
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'กรุณากรอกอีเมลและรหัสผ่าน' }, { status: 400 })
    }

    // 1. Verify credentials against `admins` table
    console.log('[admin-login] Fetching admin from DB...')
    const admin = await getAdminByEmail(email)
    
    if (!admin) {
      console.warn('[admin-login] Admin not found in table for:', email)
      return NextResponse.json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 })
    }

    console.log('[admin-login] Verifying password...')
    const passwordOk = await verifyPassword(password, admin.password_hash)

    if (!passwordOk) {
      console.warn('[admin-login] Password mismatch for:', email)
      return NextResponse.json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 })
    }

    // 2. Find auth.users.id by email → this equals profiles.id
    console.log('[admin-login] Finding user in auth.users...')
    const supabaseAdmin = getSupabaseAdmin()
    const { data: userList, error: listError } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
    
    if (listError) {
      console.error('[admin-login] Error listing users:', listError)
      throw listError
    }

    const matchedUser = userList?.users?.find(u => u.email === email)
    const profile_id = matchedUser?.id ?? undefined
    
    console.log('[admin-login] Login successful, profile_id:', profile_id)

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

  } catch (err: any) {
    console.error('[admin-login] Unexpected error:', err)
    return NextResponse.json({ 
      error: 'เกิดข้อผิดพลาดภายในระบบ',
      debug: process.env.NODE_ENV === 'development' ? err.message : undefined 
    }, { status: 500 })
  }
}
