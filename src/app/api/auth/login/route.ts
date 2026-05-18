import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/clients'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const cookiesToSet: Array<{ name: string; value: string; options: any }> = []

    const supabase = getSupabaseServerClient({
      getAll() { return request.cookies.getAll() },
      setAll(cookies) { cookiesToSet.push(...cookies) }
    })

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      return NextResponse.redirect(
        new URL(`/login?mode=email&message=${encodeURIComponent(error.message)}`, request.url)
      )
    }

    const response = NextResponse.redirect(new URL('/', request.url))

    cookiesToSet.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options)
    })

    return response
  } catch (err: any) {
    console.error('Login error:', err)
    return NextResponse.redirect(
      new URL(`/login?mode=email&message=${encodeURIComponent(err.message || 'เกิดข้อผิดพลาดภายในระบบ')}`, request.url)
    )
  }
}
