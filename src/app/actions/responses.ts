'use server'

import { getSupabaseAdmin } from '@/lib/clients'
import { getProfile } from './profile'
import { revalidatePath } from 'next/cache'

export async function saveUserResponse(category: string, data: any) {
  const profile = await getProfile()
  if (!profile) return { error: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ' }

  const adminClient = getSupabaseAdmin()
  
  const { error } = await adminClient
    .from('user_responses')
    .upsert({
      user_id: profile.id,
      category: category,
      data: data,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id, category' })

  if (error) {
    console.error('saveUserResponse error:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath(`/${category}`)
  return { success: true }
}

export async function getUserResponse(category: string) {
  const profile = await getProfile()
  if (!profile) return null

  const adminClient = getSupabaseAdmin()
  
  const { data, error } = await adminClient
    .from('user_responses')
    .select('data')
    .eq('user_id', profile.id)
    .eq('category', category)
    .maybeSingle()

  if (error) {
    console.error('getUserResponse error:', error)
    return null
  }

  return data?.data || null
}

export async function getUserProgress() {
  const profile = await getProfile()
  if (!profile) return { percentage: 0, completed: 0, total: 3 }

  const adminClient = getSupabaseAdmin()
  
  const { data, error } = await adminClient
    .from('user_responses')
    .select('category, data')
    .eq('user_id', profile.id)

  if (error) {
    console.error('getUserProgress error:', error)
    return { percentage: 0, completed: 0, total: 3 }
  }

  const categories = ['swot', 'smart', 'reflect']
  let completedCount = 0

  categories.forEach(cat => {
    const resp = data?.find(r => r.category === cat)
    if (resp && resp.data) {
      // Basic check: if data has at least one non-empty field
      const values = Object.values(resp.data)
      if (values.length > 0 && values.some(v => Array.isArray(v) ? v.length > 0 : !!v)) {
        completedCount++
      }
    }
  })

  return {
    percentage: Math.round((completedCount / categories.length) * 100),
    completed: completedCount,
    total: categories.length
  }
}

export async function getUsersSummary() {
  const adminClient = getSupabaseAdmin()
  
  const { data: members, error: mError } = await adminClient
    .from('profiles')
    .select('id, first_name, last_name, email, role')
  
  if (mError) {
    console.error('getUsersSummary members error:', mError)
    return []
  }

  const { data: responses, error: rError } = await adminClient
    .from('user_responses')
    .select('user_id, category, updated_at, data')

  if (rError) {
    console.error('getUsersSummary responses error:', rError)
    return []
  }

  const categories = ['swot', 'smart', 'reflect']

  const summary = members.map(m => {
    const userResps = responses.filter(r => r.user_id === m.id)
    
    let completedCount = 0
    categories.forEach(cat => {
      const resp = userResps.find(r => r.category === cat)
      if (resp && resp.data) {
        const values = Object.values(resp.data)
        if (values.length > 0 && values.some(v => Array.isArray(v) ? v.length > 0 : !!v)) {
          completedCount++
        }
      }
    })

    return {
      id: m.id,
      first_name: m.first_name,
      last_name: m.last_name,
      email: m.email,
      role: m.role,
      completed: completedCount,
      total: categories.length,
      percentage: Math.round((completedCount / categories.length) * 100),
      last_updated: userResps.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0]?.updated_at
    }
  })

  return summary
}
