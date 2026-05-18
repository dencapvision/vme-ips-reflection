import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient, getSupabaseAdmin } from '@/lib/clients'

export async function POST(request: NextRequest) {
  try {
    let body: any = {}
    const contentType = request.headers.get('content-type') || ''
    
    try {
      if (contentType.includes('application/json')) {
        const text = await request.text()
        if (text) {
          body = JSON.parse(text)
        }
      } else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData()
        body = Object.fromEntries(formData)
      }
    } catch (e) {
      console.error('Error parsing body detail:', e)
      return NextResponse.json({ error: `ไม่สามารถอ่านข้อมูลที่ส่งมาได้: ${e instanceof Error ? e.message : 'Unknown error'}` }, { status: 400 })
    }

    const first_name = (body.first_name as string || '').trim()
    const last_name = (body.last_name as string || '').trim()
    const phone = (body.phone as string || '').replace(/\D/g, '')

    if (!first_name || !last_name) {
      return NextResponse.json({ error: 'กรุณากรอกชื่อและนามสกุล' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('first_name', first_name)
      .eq('last_name', last_name)
      .maybeSingle()

    if (profileError) throw profileError

    if (!profile) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลผู้ใช้งาน กรุณาตรวจสอบชื่อ-นามสกุล' }, { status: 404 })
    }

    const { data: { user: authUser }, error: userError } = await supabaseAdmin.auth.admin.getUserById(profile.id)

    if (userError) throw userError

    if (!authUser?.email) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลการเข้าสู่ระบบ กรุณาติดต่อผู้ดูแลระบบ' }, { status: 400 })
    }

    const cookiesToSet: Array<{ name: string; value: string; options: any }> = []

    const supabase = getSupabaseServerClient({
      getAll() { return request.cookies.getAll() },
      setAll(cookies) { cookiesToSet.push(...cookies) }
    })

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: authUser.email,
      password: phone,
    })

    if (signInError) {
      return NextResponse.json({ error: 'เบอร์โทรศัพท์ไม่ถูกต้อง' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true, redirect: '/' })

    cookiesToSet.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options)
    })

    return response
  } catch (err: any) {
    console.error('Login-by-name error:', err)
    return NextResponse.json({ error: err.message || 'เกิดข้อผิดพลาดภายในระบบ' }, { status: 500 })
  }
}

