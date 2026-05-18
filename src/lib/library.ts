import { getSupabase } from './clients'

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
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('library_links')
    .insert([{ section: 'resource', ...payload }])
    .select()
  if (error) throw error
  return data?.[0]
}

export async function deleteLibraryLink(id: string) {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('library_links')
    .delete()
    .eq('id', id)
  if (error) throw error
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
  const supabase = getSupabase()
  // Simple thumbnail extraction for YouTube
  let thumbnail_url = ''
  try {
    const url = new URL(payload.url)
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

  const { data, error } = await supabase
    .from('library_videos')
    .insert([{ ...payload, thumbnail_url }])
    .select()
  if (error) throw error
  return data?.[0]
}

export async function deleteLibraryVideo(id: string) {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('library_videos')
    .delete()
    .eq('id', id)
  if (error) throw error
  return { deleted: id }
}
