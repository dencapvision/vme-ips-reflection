import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SESSION_COOKIE } from '@/lib/session'

export async function POST() {
  const cookieStore = await cookies()
  
  // 1. Clear custom JWT session cookie
  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  // 2. Clear Supabase Auth cookies and session
  try {
    const { getSupabaseServerClient } = await import('@/lib/clients')
    const supabase = getSupabaseServerClient({
      getAll() { return cookieStore.getAll() },
      setAll(cookiesToSet) { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) }
    })
    await supabase.auth.signOut()
  } catch (e) {
    console.error('Error signing out of Supabase in API logout:', e)
  }

  // 3. Force expire any residual sb-* or auth cookies
  const allCookies = cookieStore.getAll()
  for (const c of allCookies) {
    if (c.name.startsWith('sb-') || c.name.includes('auth')) {
      cookieStore.set(c.name, '', { path: '/', maxAge: 0 })
    }
  }

  return NextResponse.json({ success: true })
}
