import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { and, eq, asc } from 'drizzle-orm'
import { db } from '@/db'
import { sites, clicks } from '@/db/schema'
import { getCurrentUser } from '@/lib/auth/session'

const paramsSchema = z.object({ siteId: z.string().uuid() })

/** Quote a value for CSV (RFC 4180): wrap in quotes, double any inner quotes. */
function csv(v: string | number | null): string {
  if (v === null || v === undefined) return ''
  const s = String(v)
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ siteId: string }> }) {
  const parsed = paramsSchema.safeParse(await ctx.params)
  if (!parsed.success) return new NextResponse('Not found', { status: 404 })

  const user = await getCurrentUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  // CSV export is a Pro feature.
  if (user.plan !== 'pro') return new NextResponse('Upgrade to Pro to export data', { status: 403 })

  const [site] = await db
    .select({ id: sites.id, slug: sites.slug })
    .from(sites)
    .where(and(eq(sites.id, parsed.data.siteId), eq(sites.ownerId, user.id)))
    .limit(1)
  if (!site) return new NextResponse('Not found', { status: 404 })

  const rows = await db
    .select({
      createdAt: clicks.createdAt,
      type: clicks.blockId,
      device: clicks.device,
      country: clicks.country,
      referrer: clicks.referrer,
    })
    .from(clicks)
    .where(eq(clicks.siteId, site.id))
    .orderBy(asc(clicks.createdAt))

  const header = ['timestamp', 'event', 'block_id', 'device', 'country', 'referrer']
  const lines = [header.join(',')]
  for (const r of rows) {
    lines.push(
      [
        csv(r.createdAt.toISOString()),
        csv(r.type ? 'click' : 'view'),
        csv(r.type),
        csv(r.device),
        csv(r.country),
        csv(r.referrer),
      ].join(','),
    )
  }
  const body = lines.join('\r\n')

  const date = new Date().toISOString().slice(0, 10)
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${site.slug}-analytics-${date}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
