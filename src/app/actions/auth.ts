'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { SESSION_COOKIE } from '@/lib/session'

/**
 * Server action: clear the session cookie and redirect to /login.
 * Called from any "logout" button.
 */
export async function logout() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  redirect('/login')
}

/**
 * Legacy email login — kept for backward compatibility with admin
 * accounts that still exist in Supabase Auth.
 * New admin accounts should use the `admins` table + /api/auth/admin-login.
 */
export async function loginWithEmail(formData: FormData) {
  const { createClient } = await import('@/lib/supabase/server')
  const email    = formData.get('email')    as string
  const password = formData.get('password') as string

  const supabase = await createClient()
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
