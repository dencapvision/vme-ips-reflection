import { getSupabase } from './clients'

function getSupabaseRestConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key || url === 'https://placeholder.supabase.co' || key === 'placeholder') {
    throw new Error('Supabase server credentials are not configured')
  }

  return { url: url.replace(/\/$/, ''), key }
}

async function supabaseRest<T>(
  path: string,
  init: RequestInit,
): Promise<T> {
  const { url, key } = getSupabaseRestConfig()
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(init.headers ?? {}),
    },
  })

  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) {
    const message = data?.message || data?.hint || text || `Supabase REST error ${res.status}`
    throw new Error(message)
  }
  return data as T
}

function normalizeUrl(value: string) {
  return value.trim().replace(/^https\/\//i, 'https://').replace(/^http\/\//i, 'http://')
}

// --- External Links (Drive) ---
export async function listLibraryLinks() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('library_links')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function addLibraryLink(payload: {
  title: string
  url: string
  category: string
  description?: string
  section?: string
  badge_text?: string
  meta_info?: string
  sort_order?: number
}) {
  const row = { section: 'resource', ...payload, url: normalizeUrl(payload.url) }
  const rows = await supabaseRest<any[]>('library_links?select=*', {
    method: 'POST',
    body: JSON.stringify([row]),
  })
  return rows?.[0]
}

export async function deleteLibraryLink(id: string) {
  await supabaseRest<unknown>(`library_links?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
  return { deleted: id }
}

// --- Video Links (YouTube) ---
export async function listLibraryVideos() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('library_videos')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function addLibraryVideo(payload: { title: string, url: string, playlist_name: string, description?: string }) {
  // Simple thumbnail extraction for YouTube
  let thumbnail_url = ''
  try {
    const url = new URL(normalizeUrl(payload.url))
    let videoId = ''
    if (url.hostname.includes('youtube.com')) {
      videoId = url.searchParams.get('v') || ''
    } else if (url.hostname.includes('youtu.be')) {
      videoId = url.pathname.substring(1)
    }
    if (videoId) {
      thumbnail_url = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    }
  } catch (e) {}

  const rows = await supabaseRest<any[]>('library_videos?select=*', {
    method: 'POST',
    body: JSON.stringify([{ ...payload, url: normalizeUrl(payload.url), thumbnail_url }]),
  })
  return rows?.[0]
}

export async function deleteLibraryVideo(id: string) {
  await supabaseRest<unknown>(`library_videos?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
  return { deleted: id }
}
