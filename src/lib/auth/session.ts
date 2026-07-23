import { cache } from 'react'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { users, type User } from '@/db/schema'

/**
 * Current user, read fresh from the DB (so `plan` is always authoritative for
 * server-side gating — §9). `cache` dedupes within a single request.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const session = await auth()
  if (!session?.user?.id) return null
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)
  return user ?? null
})

/** Require a logged-in user or redirect to /login. */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}
