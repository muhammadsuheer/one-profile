'use server'

import { AuthError } from 'next-auth'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'
import { hashPassword } from '@/lib/password'
import { signupSchema, loginSchema } from '@/lib/auth/validation'
import { signIn } from '@/lib/auth'

export type AuthState = { error?: string } | undefined

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!parsed.success) return { error: 'Please enter a valid email and password.' }

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: '/dashboard',
    })
  } catch (error) {
    if (error instanceof AuthError) return { error: 'Invalid email or password.' }
    throw error // re-throw the NEXT_REDIRECT on success
  }
  return undefined
}

export async function signupAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input.' }
  }

  const email = parsed.data.email.toLowerCase()
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
  if (existing) return { error: 'An account with this email already exists.' }

  await db.insert(users).values({
    email,
    name: parsed.data.name,
    passwordHash: hashPassword(parsed.data.password),
  })

  try {
    await signIn('credentials', {
      email,
      password: parsed.data.password,
      redirectTo: '/dashboard',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Account created — please log in.' }
    }
    throw error
  }
  return undefined
}

export async function googleSignInAction() {
  await signIn('google', { redirectTo: '/dashboard' })
}
