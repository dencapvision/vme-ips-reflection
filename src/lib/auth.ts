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

// ─── Password utilities (PBKDF2 — built-in Node.js) ──────────────────────────
// Format stored:  "<hex-salt>:<hex-hash>"
//
// To use bcrypt instead:
//   import bcrypt from 'bcryptjs'
//   export const hashPassword   = (p: string) => bcrypt.hash(p, 12)
//   export const verifyPassword = (p: string, h: string) => bcrypt.compare(p, h)

const PBKDF2_ITERATIONS = 100_000
const PBKDF2_KEYLEN     = 64
const PBKDF2_DIGEST     = 'sha512'

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST)
    .toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, expectedHash] = stored.split(':')
  if (!salt || !expectedHash) return false
  const attemptHash = crypto
    .pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST)
    .toString('hex')
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedHash, 'hex'),
      Buffer.from(attemptHash, 'hex')
    )
  } catch {
    return false
  }
}
