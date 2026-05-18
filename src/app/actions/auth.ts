'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { SESSION_COOKIE } from '@/lib/session'

export async function logout() {
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
    console.error('Error signing out of Supabase:', e)
  }

  // 3. Force expire any residual sb-* or auth cookies
  const allCookies = cookieStore.getAll()
  for (const c of allCookies) {
    if (c.name.startsWith('sb-') || c.name.includes('auth')) {
      cookieStore.set(c.name, '', { path: '/', maxAge: 0 })
    }
  }

  redirect('/login')
}

/**
 * Legacy email login — kept for backward compatibility with admin
 * accounts that still exist in Supabase Auth.
 * New admin accounts should use the `admins` table + /api/auth/admin-login.
 */
export async function loginWithEmail(formData: FormData) {
  const { getSupabaseServerClient } = await import('@/lib/clients')
  const email    = formData.get('email')    as string
  const password = formData.get('password') as string

  const cookieStore = await cookies()
  const supabase = getSupabaseServerClient({
    getAll() { return cookieStore.getAll() },
    setAll(cookiesToSet) { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) }
  })
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (profile?.role?.toLowerCase().includes('admin')) {
      return { success: true, redirect: '/admin/users' }
    }
  }
  return { success: true, redirect: '/' }
}
