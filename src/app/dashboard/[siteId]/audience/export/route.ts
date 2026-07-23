import { and, eq, desc } from 'drizzle-orm'
import { db } from '@/db'
import { sites, subscribers } from '@/db/schema'
import { getCurrentUser } from '@/lib/auth/session'

/** Escape a CSV cell and neutralize spreadsheet formula injection. */
function csvCell(value: string): string {
  let s = value
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`
  if (/[",\n]/.test(s)) s = `"${s.replace(/"/g, '""')}"`
  return s
}

export async function GET(_req: Request, ctx: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await ctx.params
  const user = await getCurrentUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const [site] = await db
    .select({ id: sites.id, slug: sites.slug })
    .from(sites)
    .where(and(eq(sites.id, siteId), eq(sites.ownerId, user.id)))
    .limit(1)
  if (!site) return new Response('Not found', { status: 404 })

  const subs = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.siteId, siteId))
    .orderBy(desc(subscribers.createdAt))

  const rows: string[][] = [
    ['email', 'subscribed_at'],
    ...subs.map((s) => [s.email, new Date(s.createdAt).toISOString()]),
  ]
  const csv = rows.map((r) => r.map(csvCell).join(',')).join('\n')

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="subscribers-${site.slug}.csv"`,
    },
  })
}
