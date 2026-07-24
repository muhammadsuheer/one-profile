'use server'

import { and, eq, gt, lt } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { users, passwordResetTokens } from '@/db/schema'
import { hashPassword } from '@/lib/password'

export type ResetState = { ok?: boolean; error?: string } | undefined

const schema = z.object({
  token: z.string().min(16).max(200),
  password: z.string().min(8, 'Password must be at least 8 characters.').max(200),
})

export async function resetPassword(_prev: ResetState, formData: FormData): Promise<ResetState> {
  const parsed = schema.safeParse({
    token: String(formData.get('token') ?? ''),
    password: String(formData.get('password') ?? ''),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid request.' }
  }
  const { token, password } = parsed.data

  try {
    const [row] = await db
      .select({ userId: passwordResetTokens.userId, expires: passwordResetTokens.expires })
      .from(passwordResetTokens)
      .where(and(eq(passwordResetTokens.token, token), gt(passwordResetTokens.expires, new Date())))
      .limit(1)

    if (!row) return { error: 'This reset link is invalid or has expired. Request a new one.' }

    await db.update(users).set({ passwordHash: hashPassword(password) }).where(eq(users.id, row.userId))
    // Consume this token and clear any other outstanding tokens for the user.
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, row.userId))
    // Opportunistic cleanup of expired rows.
    await db.delete(passwordResetTokens).where(lt(passwordResetTokens.expires, new Date()))
  } catch {
    return { error: 'Could not reset your password. Please try again.' }
  }

  return { ok: true }
}
