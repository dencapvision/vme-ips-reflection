/**
 * Custom JWT session using Web Crypto API (works in both Edge and Node.js runtimes).
 * No external dependencies required.
 */

const SECRET = process.env.SESSION_SECRET || 'dev-secret-please-change-in-production'
export const SESSION_COOKIE = 'ips-session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

export type SessionPayload = {
  sub: string          // members.id or admins.id
  type: 'member' | 'admin'
  first_name?: string
  last_name?: string
  email?: string
  profile_id?: string  // profiles.id (= auth.users.id) — used to query the profiles table
  iat: number
  exp: number
}

// ─── Helpers (Portable Web APIs) ─────────────────────────────────────────────

function b64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

function b64urlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '=='.slice((base64.length + 4) % 4 || 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

async function getHmacKey(usage: 'sign' | 'verify') {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    [usage]
  )
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function signSession(
  payload: Omit<SessionPayload, 'iat' | 'exp'>
): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const full: SessionPayload = { ...payload, iat: now, exp: now + SESSION_MAX_AGE }

  const header = b64url(new TextEncoder().encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })))
  const body   = b64url(new TextEncoder().encode(JSON.stringify(full)))
  const key    = await getHmacKey('sign')
  const sig    = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${header}.${body}`))

  return `${header}.${body}.${b64url(sig)}`
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [header, body, sigStr] = parts
    const key = await getHmacKey('verify')

    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      b64urlDecode(sigStr),
      new TextEncoder().encode(`${header}.${body}`)
    )
    if (!valid) return null

    const payloadStr = new TextDecoder().decode(b64urlDecode(body))
    const payload: SessionPayload = JSON.parse(payloadStr)
    if (payload.exp < Math.floor(Date.now() / 1000)) return null

    return payload
  } catch (err) {
    console.error('[verifySession] error:', err)
    return null
  }
}

export function sessionCookieOptions(maxAge = SESSION_MAX_AGE) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }
}
