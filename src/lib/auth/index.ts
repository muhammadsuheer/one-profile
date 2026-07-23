import NextAuth from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import Credentials from 'next-auth/providers/credentials'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users, accounts, sessions, verificationTokens } from '@/db/schema'
import { verifyPassword } from '@/lib/password'
import { loginSchema } from '@/lib/auth/validation'
import { authConfig } from '@/lib/auth/config'

/**
 * Full server-side auth (Node runtime). Adds the Drizzle adapter (Google OAuth
 * account persistence) and the Credentials provider (scrypt via node:crypto).
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (raw) => {
        const parsed = loginSchema.safeParse(raw)
        if (!parsed.success) return null

        const email = parsed.data.email.toLowerCase()
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1)

        if (!user?.passwordHash) return null
        if (!verifyPassword(parsed.data.password, user.passwordHash)) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
        }
      },
    }),
  ],
})
