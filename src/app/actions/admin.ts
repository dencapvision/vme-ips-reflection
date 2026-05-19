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

  const first_name = (formData.get('first_name') as string).trim().replace(/\s+/g, ' ')
  const last_name = (formData.get('last_name') as string).trim().replace(/\s+/g, ' ')
  const role = (formData.get('role') as string) || 'member'
  const group_name = (formData.get('group_name') as string || '').trim() || null

  const supabaseAdmin = getSupabaseAdmin()

  if (role === 'admin') {
    const email = (formData.get('email') as string || '').trim().toLowerCase()
    const password = (formData.get('password') as string || '')

    if (!first_name || !last_name || !email || !password) {
      redirect('/admin/users?error=กรุณากรอกข้อมูลสำหรับผู้ดูแลระบบให้ครบถ้วน (ชื่อ, นามสกุล, อีเมล, รหัสผ่าน)')
    }

    // 1. Create Supabase auth user
    const { data: newUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { first_name, last_name },
    })

    if (authError) {
      redirect(`/admin/users?error=${encodeURIComponent(authError.message)}`)
    }

    // Small delay to ensure database trigger has run and created the profile row
    await new Promise((r) => setTimeout(r, 500))

    // 2. Update profile with role = 'admin'
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        first_name,
        last_name,
        phone: null,
        role: 'admin',
        group_name: null,
      })
      .eq('id', newUser.user.id)

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
      redirect(`/admin/users?error=${encodeURIComponent('ไม่สามารถสร้างโปรไฟล์ผู้ดูแลระบบได้: ' + profileError.message)}`)
    }

    // 3. Save into admins table with PBKDF2 hash
    const { hashPassword } = await import('@/lib/auth')
    const passwordHash = await hashPassword(password)
    const { error: adminTableError } = await supabaseAdmin
      .from('admins')
      .insert({
        id: newUser.user.id,
        email,
        password_hash: passwordHash,
      })

    if (adminTableError) {
      console.error('Error inserting into admins table:', adminTableError)
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
      redirect(`/admin/users?error=${encodeURIComponent('ไม่สามารถบันทึกข้อมูลผู้ดูแลระบบลงตาราง admins ได้: ' + adminTableError.message)}`)
    }

  } else {
    // Member flow
    const phone = (formData.get('phone') as string || '').replace(/\D/g, '')
    if (!first_name || !last_name || !phone) {
      redirect('/admin/users?error=กรุณากรอกข้อมูลให้ครบถ้วน')
    }

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

    // Small delay to ensure database trigger has run and created the profile row
    await new Promise((r) => setTimeout(r, 500))

    // Update profile with additional fields
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        first_name,
        last_name,
        phone,
        role,
        group_name,
      })
      .eq('id', newUser.user.id)

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
      redirect(`/admin/users?error=${encodeURIComponent('ไม่สามารถสร้างโปรไฟล์ได้: ' + profileError.message)}`)
    }

    // Insert into members table to whitelist this user for name-based login
    const normFirstName = first_name.trim().replace(/\s+/g, ' ')
    const normLastName = last_name.trim().replace(/\s+/g, ' ')
    const { error: memberError } = await supabaseAdmin
      .from('members')
      .insert({
        first_name: normFirstName,
        last_name: normLastName,
      })

    if (memberError && memberError.code !== '23505') {
      console.error('Error whitelisting member in members table:', memberError)
    }
  }

  revalidatePath('/admin/users')
  redirect('/admin/users?success=สร้างผู้ใช้งานสำเร็จ')
}

export async function deleteUser(id: string) {
  await requireAdmin()
  const supabaseAdmin = getSupabaseAdmin()

  // 1. Get the profile info before deleting the user
  const { data: profileToDelete } = await supabaseAdmin
    .from('profiles')
    .select('first_name, last_name, role')
    .eq('id', id)
    .maybeSingle()

  // 2. If the user is admin, delete from custom admins table first
  if (profileToDelete?.role?.toLowerCase().includes('admin')) {
    const { error: adminDelError } = await supabaseAdmin
      .from('admins')
      .delete()
      .eq('id', id)
    if (adminDelError) {
      console.error('Error deleting from admins table:', adminDelError)
    }
  }

  // 3. Delete Supabase auth user (this cascades and deletes from profiles too)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id)
  if (error) {
    redirect(`/admin/users?error=${encodeURIComponent(error.message)}`)
  }

  // 4. Delete from members table so they can no longer log in by name (for members)
  if (profileToDelete?.first_name && profileToDelete?.last_name) {
    const normFirstName = profileToDelete.first_name.trim().replace(/\s+/g, ' ')
    const normLastName = profileToDelete.last_name.trim().replace(/\s+/g, ' ')

    const { error: memberDelError } = await supabaseAdmin
      .from('members')
      .delete()
      .eq('first_name', normFirstName)
      .eq('last_name', normLastName)

    if (memberDelError) {
      console.error('Error deleting from members table:', memberDelError)
    }
  }

  revalidatePath('/admin/users')
}
