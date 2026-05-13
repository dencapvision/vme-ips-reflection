/**
 * Auth helpers — DB queries for `members` and `admins` tables,
 * plus password hashing using Node.js built-in `crypto` (PBKDF2).
 *
 * If you prefer bcrypt, run:  npm install bcryptjs @types/bcryptjs
 * Then swap the hash/verify functions as shown in the comments below.
 */

import { createAdminClient } from '@/lib/supabase/admin'
import crypto from 'crypto'

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
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('members')
    .select('id, first_name, last_name')
    .eq('first_name', first_name)
    .eq('last_name', last_name)
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
  const admin = createAdminClient()
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

export function hashPassword(password: string): string {
  // Node.js-only helper for seeding scripts (not called in CF Workers runtime)
  const nodeCrypto = require('crypto')
  const salt = nodeCrypto.randomBytes(16).toString('hex')
  const hash = nodeCrypto
    .pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, 'sha512')
    .toString('hex')
  return `${salt}:${hash}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, expectedHashHex] = stored.split(':')
  if (!saltHex || !expectedHashHex) return false
  try {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    )
    const derivedBits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt: hexToBytes(saltHex), iterations: PBKDF2_ITERATIONS, hash: 'SHA-512' },
      keyMaterial,
      PBKDF2_KEYLEN * 8
    )
    return bytesToHex(new Uint8Array(derivedBits)) === expectedHashHex
  } catch {
    return false
  }
}
