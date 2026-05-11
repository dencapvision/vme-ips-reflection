'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function loginWithEmail(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/login?mode=email&message=${encodeURIComponent(error.message)}`)
  }

  redirect('/')
}

export async function loginWithName(formData: FormData) {
  const first_name = (formData.get('first_name') as string).trim()
  const last_name = (formData.get('last_name') as string).trim()
  const phone = (formData.get('phone') as string).replace(/\D/g, '')

  // We need to find the user's email first. 
  // Since we don't have an admin client in server actions easily,
  // we'll call the existing API route but with better error handling there,
  // OR we can implement the lookup here if we have a secure way.
  
  // Actually, let's keep the API route for name login but fix it.
}
