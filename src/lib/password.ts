import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto'

const KEYLEN = 64

/**
 * Hash a password with scrypt (Node stdlib — no external dependency).
 * Stored as `salt:derivedKey`, both hex.
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const derived = scryptSync(password, salt, KEYLEN).toString('hex')
  return `${salt}:${derived}`
}

/** Constant-time verification of a password against a stored `salt:key` hash. */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(':')
  if (!salt || !key) return false
  const derived = scryptSync(password, salt, KEYLEN)
  const keyBuffer = Buffer.from(key, 'hex')
  if (keyBuffer.length !== derived.length) return false
  return timingSafeEqual(keyBuffer, derived)
}
