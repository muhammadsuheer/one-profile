import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/db'
import { clicks } from '@/db/schema'
import { detectDevice } from '@/lib/clicks'
import { rateLimit } from '@/lib/ratelimit'

function clientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0] ??
    req.headers.get('x-real-ip') ??
    'unknown'
  ).trim()
}

// 1x1 transparent GIF.
const PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64',
)
const idSchema = z.string().uuid()

/**
 * Zero-JS page-view beacon. The public page embeds this as a 1x1 image, so a
 * view is logged on every real load (bypassing ISR HTML caching) without any
 * client JavaScript. A page view is a clicks row with blockId = null.
 */
export async function GET(req: NextRequest, ctx: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await ctx.params
  // Cap logged views per IP+site so refresh loops / bots can't inflate counts
  // or flood the clicks table. Over the cap, still serve the pixel silently.
  const withinLimit = rateLimit(`pv:${clientIp(req)}:${siteId}`, 30, 60_000)
  if (withinLimit && idSchema.safeParse(siteId).success) {
    try {
      await db.insert(clicks).values({
        siteId,
        blockId: null,
        device: detectDevice(req.headers.get('user-agent') ?? ''),
        referrer: req.headers.get('referer'),
        country: req.headers.get('x-vercel-ip-country'),
      })
    } catch {
      // Unknown siteId (FK violation) or logging error — never fail the pixel.
    }
  }

  return new NextResponse(new Uint8Array(PIXEL), {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Content-Length': String(PIXEL.length),
    },
  })
}
