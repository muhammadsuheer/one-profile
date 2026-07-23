import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth/config'

// Edge middleware uses ONLY the edge-safe config (verifies the JWT; the
// `authorized` callback gates /dashboard). No adapter, no node:crypto here.
const { auth } = NextAuth(authConfig)

export default auth

export const config = {
  matcher: ['/dashboard/:path*'],
}
