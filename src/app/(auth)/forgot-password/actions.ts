'use server'

import { randomBytes } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { users, passwordResetTokens } from '@/db/schema'
import { env } from '@/env'
import { sendEmail, renderEmail } from '@/lib/email'
import { rateLimit } from '@/lib/ratelimit'

export type ForgotState = { ok?: boolean; error?: string } | undefined

const TOKEN_TTL_MS = 60 * 60 * 1000 // 1 hour

// Deliberately identical for "sent" and "no such user" so the form never
// reveals whether an email is registered.
const GENERIC = { ok: true as const }

export async function requestPasswordReset(
  _prev: ForgotState,
  formData: FormData,
): Promise<ForgotState> {
  const parsed = z.string().email().safeParse(String(formData.get('email') ?? '').trim().toLowerCase())
  if (!parsed.success) return { error: 'Enter a valid email address.' }
  const email = parsed.data

  // Throttle by email to prevent inbox flooding / token churn.
  if (!rateLimit(`pwreset:${email}`, 3, 15 * 60 * 1000)) return GENERIC

  try {
    const [user] = await db
      .select({ id: users.id, passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    // Only send for accounts that actually have a password (not Google-only).
    if (user?.passwordHash) {
      const token = randomBytes(32).toString('hex')
      await db.insert(passwordResetTokens).values({
        token,
        userId: user.id,
        expires: new Date(Date.now() + TOKEN_TTL_MS),
      })
      const url = `${env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')}/reset-password?token=${token}`
      await sendEmail({
        to: email,
        subject: 'Reset your OnePage password',
        html: renderEmail({
          heading: 'Reset your password',
          body: 'We received a request to reset your password. This link expires in 1 hour.',
          ctaLabel: 'Reset password',
          ctaUrl: url,
        }),
      })
    }
  } catch {
    // Swallow — still return generic success to avoid leaking state.
  }

  return GENERIC
}
