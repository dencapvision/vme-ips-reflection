'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProfile() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return { ...profile, email: user.email }
}

export async function getPublicProfile(id: string) {
  const supabase = createClient()
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .eq('is_public', true)
    .single()

  if (error) {
    console.error('Error fetching public profile:', error)
    return null
  }

  return profile
}

export async function updateProfile(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Unauthorized')

  const data = {
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    motto: formData.get('motto') as string,
    virtue: formData.get('virtue') as string,
    phone: formData.get('phone') as string,
    line_id: formData.get('line_id') as string,
    province: formData.get('province') as string,
    is_public: formData.get('is_public') === 'on',
  }

  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', user.id)

  if (error) {
    throw new Error('Failed to update profile')
  }

  revalidatePath('/profile')
}
