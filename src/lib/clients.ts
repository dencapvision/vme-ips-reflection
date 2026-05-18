import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr'

// --- Lazy loaded singletons ---
let supabaseBrowserCache: SupabaseClient | null = null;
let supabaseEdgeCache: SupabaseClient | null = null;
let supabaseAdminCache: SupabaseClient | null = null;

/**
 * 1. getSupabaseBrowserClient (For Client Components)
 * Uses @supabase/ssr to interact with cookies in the browser.
 */
export function getSupabaseBrowserClient() {
  if (supabaseBrowserCache) return supabaseBrowserCache;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

  supabaseBrowserCache = createBrowserClient(url, key);
  return supabaseBrowserCache;
}

/**
 * 2. getSupabaseServerClient (For Server Components / API Routes / Server Actions)
 * Wraps @supabase/ssr createServerClient to access server-side cookies.
 */
export function getSupabaseServerClient(
  cookieStore?: {
    getAll: () => Array<{ name: string; value: string }>;
    setAll: (cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) => void;
  }
) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

  return createServerClient(url, key, {
    cookies: cookieStore ? cookieStore : {
      getAll() { return []; },
      setAll() {},
    },
  });
}

/**
 * 3. getSupabaseAdmin (For internal server logic requiring full bypass of RLS)
 * Uses standard @supabase/supabase-js client without session persistence.
 */
export function getSupabaseAdmin() {
  if (supabaseAdminCache) return supabaseAdminCache;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("Missing Supabase environment variables for admin client. Falling back to placeholder.");
  }

  supabaseAdminCache = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    }
  });
  
  return supabaseAdminCache;
}

/**
 * 4. getSupabase (Standard Edge/Server-safe Client without Cookie Management)
 * For general usage where session cookies are not required.
 */
export function getSupabase() {
  if (supabaseEdgeCache) return supabaseEdgeCache;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("Missing Supabase environment variables for general client. Falling back to placeholder.");
  }

  supabaseEdgeCache = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
  
  return supabaseEdgeCache;
}

/**
 * 5. supabase (Backward-compat proxy for quick usage like `supabase.from(...)`)
 * It will lazily instantiate the general Edge client.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as any)[prop];
  },
});
