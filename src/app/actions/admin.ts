'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getProfile } from '@/app/actions/profile'
import { getSupabaseAdmin } from '@/lib/clients'

async function requireAdmin() {
  const profile = await getProfile()
  if (!profile) redirect('/login')

  if (!profile.role?.toLowerCase().includes('admin')) {
    redirect('/')
  }
}

export async function createUser(formData: FormData) {
  await requireAdmin()

  const first_name = (formData.get('first_name') as string).trim()
  const last_name = (formData.get('last_name') as string).trim()
  const phone = (formData.get('phone') as string).replace(/\D/g, '')
  const role = (formData.get('role') as string) || 'member'
  const group_name = (formData.get('group_name') as string).trim() || null

  if (!first_name || !last_name || !phone) {
    redirect('/admin/users?error=กรุณากรอกข้อมูลให้ครบถ้วน')
  }

  const supabaseAdmin = getSupabaseAdmin()
  const email = `${phone}@vme-ips.local`

  // Create Supabase auth user
  const { data: newUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: phone,
    email_confirm: true,
    user_metadata: { first_name, last_name },
  })

  if (authError) {
    redirect(`/admin/users?error=${encodeURIComponent(authError.message)}`)
  }

  // Update profile with additional fields (trigger may have already created the row)
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .upsert({
      id: newUser.user.id,
      first_name,
      last_name,
      phone,
      role,
      group_name,
    })

  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
    redirect(`/admin/users?error=${encodeURIComponent('ไม่สามารถสร้างโปรไฟล์ได้: ' + profileError.message)}`)
  }

  revalidatePath('/admin/users')
  redirect('/admin/users?success=สร้างผู้ใช้งานสำเร็จ')
}

export async function deleteUser(id: string) {
  await requireAdmin()
  const supabaseAdmin = getSupabaseAdmin()

  const { error } = await supabaseAdmin.auth.admin.deleteUser(id)
  if (error) {
    redirect(`/admin/users?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/users')
}
