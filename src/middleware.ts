import { NextResponse, type NextRequest } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { sites } from '@/db/schema'
import { env } from '@/env'

const APP_HOST = new URL(env.NEXT_PUBLIC_APP_URL).host.split(':')[0].toLowerCase()

/** Hosts we serve directly (the app itself) — never treated as custom domains. */
function isPlatformHost(host: string): boolean {
  const h = host.split(':')[0].toLowerCase()
  return (
    h === APP_HOST ||
    h === 'localhost' ||
    h === '127.0.0.1' ||
    h === '0.0.0.0' ||
    h.endsWith('.vercel.app')
  )
}

/**
 * Custom-domain routing. For requests arriving on a host that isn't the app
 * itself, look up the site that claimed that domain and rewrite to its public
 * page. Platform hosts short-circuit with zero DB work, and any failure falls
 * through to normal handling — a lookup error must never break the request.
 */
export async function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? ''
  if (!host || isPlatformHost(host)) return NextResponse.next()

  try {
    const domain = host.split(':')[0].toLowerCase()
    const [site] = await db
      .select({ slug: sites.slug, isPublished: sites.isPublished })
      .from(sites)
      .where(eq(sites.customDomain, domain))
      .limit(1)

    if (site?.isPublished) {
      const url = req.nextUrl.clone()
      url.pathname = `/${site.slug}`
      return NextResponse.rewrite(url)
    }
  } catch {
    // Never let a routing lookup failure take down the request.
  }

  return NextResponse.next()
}

// Skip API, Next internals, and any path with a file extension (static assets).
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
