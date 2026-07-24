'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { users } from '@/db/schema'
import { getCurrentUser } from '@/lib/auth/session'
import { hashPassword, verifyPassword } from '@/lib/password'

export type AccountState = { ok?: boolean; error?: string; message?: string } | undefined

export async function updateName(_prev: AccountState, formData: FormData): Promise<AccountState> {
  const user = await getCurrentUser()
  if (!user) return { error: 'You must be signed in.' }

  const parsed = z.string().min(1).max(80).safeParse(String(formData.get('name') ?? '').trim())
  if (!parsed.success) return { error: 'Name must be 1–80 characters.' }

  try {
    await db.update(users).set({ name: parsed.data }).where(eq(users.id, user.id))
  } catch {
    return { error: 'Could not save. Please try again.' }
  }
  revalidatePath('/dashboard/account')
  revalidatePath('/dashboard')
  return { ok: true, message: 'Name updated.' }
}

export async function changePassword(_prev: AccountState, formData: FormData): Promise<AccountState> {
  const user = await getCurrentUser()
  if (!user) return { error: 'You must be signed in.' }
  if (!user.passwordHash) {
    return { error: 'Your account uses Google sign-in — there’s no password to change.' }
  }

  const current = String(formData.get('current') ?? '')
  const next = String(formData.get('next') ?? '')
  if (next.length < 8) return { error: 'New password must be at least 8 characters.' }
  if (!verifyPassword(current, user.passwordHash)) return { error: 'Current password is incorrect.' }

  try {
    await db.update(users).set({ passwordHash: hashPassword(next) }).where(eq(users.id, user.id))
  } catch {
    return { error: 'Could not save. Please try again.' }
  }
  return { ok: true, message: 'Password changed.' }
}

export async function deleteAccount(_prev: AccountState, formData: FormData): Promise<AccountState> {
  const user = await getCurrentUser()
  if (!user) return { error: 'You must be signed in.' }

  const confirm = String(formData.get('confirm') ?? '')
  // Password users must re-enter their password; OAuth-only users type DELETE.
  if (user.passwordHash) {
    if (!verifyPassword(confirm, user.passwordHash)) return { error: 'Password is incorrect.' }
  } else if (confirm.trim().toUpperCase() !== 'DELETE') {
    return { error: 'Type DELETE to confirm.' }
  }

  try {
    // Cascades to sessions, accounts, reset tokens, and all sites/blocks/clicks.
    await db.delete(users).where(eq(users.id, user.id))
  } catch {
    return { error: 'Could not delete your account. Please try again.' }
  }
  return { ok: true, message: 'Account deleted.' }
}
