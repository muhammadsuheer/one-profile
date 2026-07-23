import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import { env, googleAuthEnabled } from '@/env'

/**
 * Edge-safe base config. Used by the middleware (which runs on the Edge
 * runtime and can only VERIFY the JWT — no adapter, no `node:crypto`).
 * The full config in ./index.ts extends this with the Drizzle adapter and
 * the Credentials provider (Node-only).
 */
export const authConfig = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: googleAuthEnabled
    ? [
        Google({
          clientId: env.AUTH_GOOGLE_ID,
          clientSecret: env.AUTH_GOOGLE_SECRET,
          allowDangerousEmailAccountLinking: true,
        }),
      ]
    : [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
      if (isDashboard) return isLoggedIn
      return true
    },
    jwt({ token, user }) {
      if (user?.id) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (typeof token.id === 'string' && session.user) {
        session.user.id = token.id
      }
      return session
    },
  },
} satisfies NextAuthConfig
