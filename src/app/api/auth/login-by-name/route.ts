import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const first_name = (formData.get('first_name') as string).trim()
    const last_name = (formData.get('last_name') as string).trim()
    const phone = (formData.get('phone') as string).replace(/\D/g, '')

    const supabaseAdmin = createAdminClient()

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('first_name', first_name)
      .eq('last_name', last_name)
      .maybeSingle()

    if (profileError) throw profileError

    if (!profile) {
      return NextResponse.redirect(
        new URL(`/login?message=${encodeURIComponent('ไม่พบข้อมูลผู้ใช้งาน กรุณาตรวจสอบชื่อ-นามสกุล')}`, request.url)
      )
    }

    const { data: { user: authUser }, error: userError } = await supabaseAdmin.auth.admin.getUserById(profile.id)

    if (userError) throw userError

    if (!authUser?.email) {
      return NextResponse.redirect(
        new URL(`/login?message=${encodeURIComponent('ไม่พบข้อมูลการเข้าสู่ระบบ กรุณาติดต่อผู้ดูแลระบบ')}`, request.url)
      )
    }

    const cookiesToSet: Array<{ name: string; value: string; options: any }> = []

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookies) {
            cookiesToSet.push(...cookies)
          },
        },
      }
    )

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: authUser.email,
      password: phone,
    })

    if (signInError) {
      return NextResponse.redirect(
        new URL(`/login?message=${encodeURIComponent('เบอร์โทรศัพท์ไม่ถูกต้อง')}`, request.url)
      )
    }

    const response = NextResponse.redirect(new URL('/', request.url))

    cookiesToSet.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options)
    })

    return response
  } catch (err: any) {
    console.error('Login-by-name error:', err)
    return NextResponse.redirect(
      new URL(`/login?message=${encodeURIComponent(err.message || 'เกิดข้อผิดพลาดภายในระบบ')}`, request.url)
    )
  }
}
