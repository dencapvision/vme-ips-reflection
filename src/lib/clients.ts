import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr'

// --- Lazy loaded singletons (Browser only) ---
let supabaseBrowserCache: SupabaseClient | null = null;

/**
 * 1. getSupabaseBrowserClient (For Client Components)
 * Uses @supabase/ssr to interact with cookies in the browser.
 */
export function getSupabaseBrowserClient() {
  if (typeof window === 'undefined') {
    // If somehow called on the server, don't use the cache
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
    return createBrowserClient(url, key);
  }

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
 * Note: We DO NOT cache this globally, to ensure `process.env` is correctly read per-request in Edge environments.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("Missing Supabase environment variables for admin client. Falling back to placeholder.");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    }
  });
}

/**
 * 4. getSupabase (Standard Edge/Server-safe Client without Cookie Management)
 * For general usage where session cookies are not required.
 * Note: We DO NOT cache this globally, to ensure `process.env` is correctly read per-request in Edge environments.
 */
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("Missing Supabase environment variables for general client. Falling back to placeholder.");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
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
