import { and, eq, gte, isNotNull, desc, sql } from 'drizzle-orm'
import { db } from '@/db'
import { clicks, blocks } from '@/db/schema'
import type { BlockData } from '@/lib/blocks/schemas'

/** Free = 7-day window, Pro = 30-day window (§9). */
export function windowForPlan(plan: 'free' | 'pro'): { since: Date; days: number } {
  const days = plan === 'pro' ? 30 : 7
  return { since: new Date(Date.now() - days * 86_400_000), days }
}

export interface Summary {
  views: number
  clicks: number
  ctr: number
}

export async function getSummary(siteId: string, since: Date): Promise<Summary> {
  const [row] = await db
    .select({
      views: sql<number>`count(*) filter (where ${clicks.blockId} is null)`.mapWith(Number),
      clicks: sql<number>`count(*) filter (where ${clicks.blockId} is not null)`.mapWith(Number),
    })
    .from(clicks)
    .where(and(eq(clicks.siteId, siteId), gte(clicks.createdAt, since)))

  const views = row?.views ?? 0
  const clk = row?.clicks ?? 0
  return { views, clicks: clk, ctr: views > 0 ? clk / views : 0 }
}

export interface DailyPoint {
  day: string
  views: number
  clicks: number
}

export async function getDailySeries(siteId: string, since: Date): Promise<DailyPoint[]> {
  return db
    .select({
      day: sql<string>`to_char(date_trunc('day', ${clicks.createdAt}), 'YYYY-MM-DD')`,
      views: sql<number>`count(*) filter (where ${clicks.blockId} is null)`.mapWith(Number),
      clicks: sql<number>`count(*) filter (where ${clicks.blockId} is not null)`.mapWith(Number),
    })
    .from(clicks)
    .where(and(eq(clicks.siteId, siteId), gte(clicks.createdAt, since)))
    .groupBy(sql`date_trunc('day', ${clicks.createdAt})`)
    .orderBy(sql`date_trunc('day', ${clicks.createdAt})`)
}

export interface BlockStat {
  blockId: string | null
  type: string | null
  data: BlockData | null
  count: number
}

export async function getBlockClicks(siteId: string, since: Date): Promise<BlockStat[]> {
  return db
    .select({
      blockId: clicks.blockId,
      type: blocks.type,
      data: blocks.data,
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(clicks)
    .leftJoin(blocks, eq(clicks.blockId, blocks.id))
    .where(and(eq(clicks.siteId, siteId), isNotNull(clicks.blockId), gte(clicks.createdAt, since)))
    .groupBy(clicks.blockId, blocks.type, blocks.data)
    .orderBy(desc(sql`count(*)`))
}

export interface Bucket {
  label: string
  count: number
}

export async function getDeviceSplit(siteId: string, since: Date): Promise<Bucket[]> {
  const rows = await db
    .select({
      label: sql<string>`coalesce(${clicks.device}, 'unknown')`,
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(clicks)
    .where(and(eq(clicks.siteId, siteId), gte(clicks.createdAt, since)))
    .groupBy(clicks.device)
    .orderBy(desc(sql`count(*)`))
  return rows
}

export async function getTopCountries(siteId: string, since: Date, limit = 5): Promise<Bucket[]> {
  const rows = await db
    .select({
      label: sql<string>`${clicks.country}`,
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(clicks)
    .where(and(eq(clicks.siteId, siteId), isNotNull(clicks.country), gte(clicks.createdAt, since)))
    .groupBy(clicks.country)
    .orderBy(desc(sql`count(*)`))
    .limit(limit)
  return rows
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/**
 * Total events per weekday (UTC) across the window, as a fixed 7-entry list
 * ordered Mon..Sun so "busiest day" reads naturally. Missing days are 0.
 */
export async function getWeekdayActivity(siteId: string, since: Date): Promise<Bucket[]> {
  const rows = await db
    .select({
      dow: sql<number>`extract(dow from ${clicks.createdAt})`.mapWith(Number),
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(clicks)
    .where(and(eq(clicks.siteId, siteId), gte(clicks.createdAt, since)))
    .groupBy(sql`extract(dow from ${clicks.createdAt})`)

  const counts = new Map(rows.map((r) => [r.dow, r.count]))
  // Mon(1)..Sat(6), then Sun(0).
  const order = [1, 2, 3, 4, 5, 6, 0]
  return order.map((d) => ({ label: WEEKDAYS[d], count: counts.get(d) ?? 0 }))
}

export async function getTopReferrers(siteId: string, since: Date, limit = 5): Promise<Bucket[]> {
  const rows = await db
    .select({
      label: sql<string>`coalesce(nullif(${clicks.referrer}, ''), 'Direct')`,
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(clicks)
    .where(and(eq(clicks.siteId, siteId), gte(clicks.createdAt, since)))
    .groupBy(sql`coalesce(nullif(${clicks.referrer}, ''), 'Direct')`)
    .orderBy(desc(sql`count(*)`))
    .limit(limit)
  return rows
}
