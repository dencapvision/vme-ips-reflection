import { createClient, SupabaseClient } from '@supabase/supabase-js'
let supabaseCache: SupabaseClient | null = null

/**
 * ฟังก์ชันสำหรับดึง Supabase Client แบบ Lazy Loading และ Caching
 * เพื่อให้มั่นใจว่า Environment Variables พร้อมใช้งานบน Cloudflare
 * และประหยัดทรัพยากรโดยการใช้ Instance เดิมซ้ำ
 */
export function getSupabase() {
  if (supabaseCache) return supabaseCache

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Supabase Config Missing: Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Cloudflare Dashboard.');
  }

  supabaseCache = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
  
  return supabaseCache
}
