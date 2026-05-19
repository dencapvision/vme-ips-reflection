/**
 * Auth helpers — DB queries for `members` and `admins` tables,
 * plus password hashing using Node.js built-in `crypto` (PBKDF2).
 *
 * If you prefer bcrypt, run:  npm install bcryptjs @types/bcryptjs
 * Then swap the hash/verify functions as shown in the comments below.
 */

import { getSupabaseAdmin } from '@/lib/clients'

// ─── Member helpers ───────────────────────────────────────────────────────────

export type MemberRow = {
  id: string
  first_name: string
  last_name: string
}

/**
 * Look up a member by exact first + last name.
 * Returns the row or null if not found.
 */
export async function getMemberByName(
  first_name: string,
  last_name: string
): Promise<MemberRow | null> {
  const normFirstName = first_name.trim().replace(/\s+/g, ' ')
  const normLastName = last_name.trim().replace(/\s+/g, ' ')
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('members')
    .select('id, first_name, last_name')
    .eq('first_name', normFirstName)
    .eq('last_name', normLastName)
    .maybeSingle()
  if (error) throw error
  return data
}

// ─── Admin helpers ────────────────────────────────────────────────────────────

export type AdminRow = {
  id: string
  email: string
  password_hash: string
}

/**
 * Look up an admin account by email.
 */
export async function getAdminByEmail(email: string): Promise<AdminRow | null> {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('admins')
    .select('id, email, password_hash')
    .eq('email', email.toLowerCase())
    .maybeSingle()
  if (error) throw error
  return data
}

// ─── Password utilities (PBKDF2 via Web Crypto — works in Cloudflare Workers) ─
// Format stored:  "<hex-salt>:<hex-hash>"
// Uses Web Crypto API (async) — no CPU time limit issues in edge runtimes.

const PBKDF2_ITERATIONS = 100_000
const PBKDF2_KEYLEN     = 64    // bytes → 512 bits

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return bytes
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function hashPassword(password: string): Promise<string> {
  const webCrypto = typeof crypto !== 'undefined' ? crypto : (globalThis as any).crypto;
  
  if (webCrypto?.subtle) {
    const salt = webCrypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await webCrypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    const derivedBits = await webCrypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-512' },
      keyMaterial,
      PBKDF2_KEYLEN * 8
    );
    const saltHex = bytesToHex(salt);
    const hashHex = bytesToHex(new Uint8Array(derivedBits));
    return `${saltHex}:${hashHex}`;
  }

  // Fallback to Node.js crypto if Web Crypto is not fully available
  const nodeCrypto = eval("require")('crypto');
  const salt = nodeCrypto.randomBytes(16).toString('hex');
  const hash = nodeCrypto
    .pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, 'sha512')
    .toString('hex');
  return `${salt}:${hash}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, expectedHashHex] = stored.split(':')
  if (!saltHex || !expectedHashHex) return false
  try {
    // Use globalThis.crypto to ensure we use the native Web Crypto API in edge
    const webCrypto = typeof crypto !== 'undefined' ? crypto : (globalThis as any).crypto;
    
    const keyMaterial = await webCrypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    )

    const checkWithSalt = async (salt: Uint8Array): Promise<boolean> => {
      const derivedBits = await webCrypto.subtle.deriveBits(
        { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-512' },
        keyMaterial,
        PBKDF2_KEYLEN * 8
      )
      return bytesToHex(new Uint8Array(derivedBits)) === expectedHashHex
    }

    // Try binary salt first (newer/intended format)
    const isBinaryMatch = await checkWithSalt(hexToBytes(saltHex))
    if (isBinaryMatch) return true

    // Fallback: Try string salt (legacy/backward compatibility format)
    const isStringMatch = await checkWithSalt(new TextEncoder().encode(saltHex))
    return isStringMatch
  } catch {
    return false
  }
}
