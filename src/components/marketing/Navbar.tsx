import { auth } from '@/lib/auth'
import NavbarClient from './NavbarClient'

/**
 * Marketing navbar. Reads the session so a signed-in visitor sees Dashboard
 * instead of being asked to log in or sign up on a site they're already using.
 *
 * Only the session cookie is read — no database round trip, since all this needs
 * to know is whether someone is signed in, not who they are.
 *
 * Reading the cookie does opt the marketing pages out of static rendering, which
 * is a real cost: their HTML can no longer be served straight from the CDN. It's
 * taken deliberately. The alternative is resolving the session in the browser,
 * which keeps the pages static but means a signed-in visitor is briefly shown
 * "Log in" before it corrects itself — and a signed-in visitor landing on the
 * homepage is exactly the case this is here to fix.
 */
export default async function Navbar() {
  const session = await auth()
  return <NavbarClient isLoggedIn={!!session?.user} />
}
