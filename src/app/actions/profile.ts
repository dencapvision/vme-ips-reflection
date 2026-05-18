'use server'

import { getSupabaseServerClient, getSupabaseAdmin } from '@/lib/clients'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { verifySession, SESSION_COOKIE } from '@/lib/session'

export async function getProfile() {
  // ── Path 1: Supabase Auth session (legacy / admin via Supabase Auth) ──────
  const cookieStore = await cookies()
  const supabase = getSupabaseServerClient({
    getAll() { return cookieStore.getAll() },
    setAll(cookiesToSet) { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) }
  })
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profile) return { ...profile, email: user.email }

    // Fallback for Supabase Auth users who are admins but lack a profile record
    if (user.email?.endsWith('@gmail.com') || user.email?.includes('admin')) {
        return {
            id: user.id,
            first_name: 'Admin',
            last_name: 'User',
            role: 'Admin',
            email: user.email
        }
    }
    return null
  }

  // ── Path 2: Custom JWT session (member or new-system admin) ───────────────
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const session = await verifySession(token)
  if (!session) return null

  const adminClient = getSupabaseAdmin()

  // If we stored a profile_id during login, use it directly
  if (session.profile_id) {
    const { data: profile } = await adminClient
      .from('profiles')
      .select('*')
      .eq('id', session.profile_id)
      .single()
    if (profile) return { ...profile, email: session.email ?? null }
  }

  // Fallback: match by first_name + last_name (members without a profiles row yet)
  if (session.first_name && session.last_name) {
    const { data: profile } = await adminClient
      .from('profiles')
      .select('*')
      .eq('first_name', session.first_name)
      .eq('last_name', session.last_name)
      .maybeSingle()
    if (profile) return { ...profile, email: session.email ?? null }
  }

  // Final Fallback for Admin Login: If it's an admin session, return a virtual admin profile
  if (session.type === 'admin') {
    return {
      id: session.sub || 'admin',
      first_name: 'System',
      last_name: 'Admin',
      role: 'Admin',
      email: session.email
    }
  }

  return null
}

export async function getPublicProfile(id: string) {
  const cookieStore = await cookies()
  const supabase = getSupabaseServerClient({
    getAll() { return cookieStore.getAll() },
    setAll(cookiesToSet) { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) }
  })
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .eq('is_public', true)
    .single()
  return profile ?? null
}

export async function updateProfile(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = getSupabaseServerClient({
    getAll() { return cookieStore.getAll() },
    setAll(cookiesToSet) { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) }
  })
  const { data: { user } } = await supabase.auth.getUser()

  // Resolve user id — try Supabase Auth first, then JWT session
  let userId: string | null = user?.id ?? null

  if (!userId) {
    const token = cookieStore.get(SESSION_COOKIE)?.value
    if (token) {
      const session = await verifySession(token)
      userId = session?.profile_id ?? null
    }
  }

  if (!userId) return { error: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ' }

  try {
    const adminClient = getSupabaseAdmin()
    const data: Record<string, unknown> = {
      first_name:    formData.get('first_name')    || null,
      last_name:     formData.get('last_name')     || null,
      motto:         formData.get('motto')         || null,
      virtue:        formData.get('virtue')        || null,
      phone:         formData.get('phone')         || null,
      line_id:       formData.get('line_id')       || null,
      line_url:      formData.get('line_url')      || null,
      line_qr_url:   formData.get('line_qr_url')   || null,
      facebook_url:  formData.get('facebook_url')  || null,
      instagram_url: formData.get('instagram_url') || null,
      tiktok_url:    formData.get('tiktok_url')    || null,
      youtube_url:   formData.get('youtube_url')   || null,
      organization:  formData.get('organization')  || null,
      address:       formData.get('address')       || null,
      province:      formData.get('province')      || null,
      avatar_url:    formData.get('avatar_url')    || null,
      is_public:     formData.get('is_public') === 'on',
      updated_at:    new Date().toISOString(),
    }

    try {
      const photosStr = formData.get('activity_photos')
      data.activity_photos = photosStr ? JSON.parse(photosStr as string) : []
    } catch { data.activity_photos = [] }

    const { error } = await adminClient.from('profiles').update(data).eq('id', userId)
    if (error) return { error: `Database Error: ${error.message}` }

    revalidatePath('/profile')
    revalidatePath('/profile/edit')
    revalidatePath(`/card/${userId}`)
    revalidatePath('/')

    return { success: true, message: 'บันทึกข้อมูลเรียบร้อยแล้วครับ' }
  } catch (err: any) {
    return { error: 'เกิดข้อผิดพลาดที่ไม่คาดคิด', details: err.message }
  }
}
