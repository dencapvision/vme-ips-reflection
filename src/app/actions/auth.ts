'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Login for admin — uses email + password
export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect(`/login?mode=email&message=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

// Login for members — uses first name + last name + phone (phone = password)
export async function loginByName(formData: FormData) {
  const first_name = (formData.get('first_name') as string).trim()
  const last_name = (formData.get('last_name') as string).trim()
  const phone = (formData.get('phone') as string).replace(/\D/g, '')

  const supabaseAdmin = createAdminClient()

  // Lookup profile by name
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('first_name', first_name)
    .eq('last_name', last_name)
    .maybeSingle()

  if (!profile) {
    redirect(`/login?message=${encodeURIComponent('ไม่พบข้อมูลผู้ใช้งาน กรุณาตรวจสอบชื่อ-นามสกุล')}`)
  }

  // Get auth user email by profile ID
  const { data: { user: authUser } } = await supabaseAdmin.auth.admin.getUserById(profile.id)

  if (!authUser?.email) {
    redirect(`/login?message=${encodeURIComponent('ไม่พบข้อมูลการเข้าสู่ระบบ กรุณาติดต่อผู้ดูแลระบบ')}`)
  }

  // Sign in with email + phone as password
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: authUser.email,
    password: phone,
  })

  if (error) {
    redirect(`/login?message=${encodeURIComponent('เบอร์โทรศัพท์ไม่ถูกต้อง')}`)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
