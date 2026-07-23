import { notFound } from 'next/navigation'
import { and, eq } from 'drizzle-orm'
import { Lock } from 'lucide-react'
import { db } from '@/db'
import { sites } from '@/db/schema'
import { getCurrentUser } from '@/lib/auth/session'
import {
  windowForPlan,
  getSummary,
  getDailySeries,
  getBlockClicks,
  getDeviceSplit,
  getTopCountries,
  type DailyPoint,
} from '@/lib/analytics'
import { BLOCK_REGISTRY } from '@/lib/blocks/registry'
import type { BlockData, BlockType } from '@/lib/blocks/schemas'
import { StatCard } from '@/components/analytics/StatCard'
import { LineChart } from '@/components/analytics/LineChart'
import { BarList } from '@/components/analytics/BarList'

export const metadata = { title: 'Analytics' }

function blockLabel(type: string | null, data: BlockData | null): string {
  if (!type) return 'Deleted block'
  const entry = BLOCK_REGISTRY[type as BlockType]
  if (!entry) return type
  const summary = data ? entry.summary(data) : ''
  return summary ? `${entry.label} · ${summary}` : entry.label
}

function buildBuckets(series: DailyPoint[], days: number) {
  const map = new Map(series.map((s) => [s.day, s]))
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const out: { label: string; views: number; clicks: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setUTCDate(d.getUTCDate() - i)
    const key = d.toISOString().slice(0, 10)
    const hit = map.get(key)
    out.push({
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
      views: hit?.views ?? 0,
      clicks: hit?.clicks ?? 0,
    })
  }
  return out
}

export default async function AnalyticsPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params
  const user = await getCurrentUser()
  if (!user) notFound()

  const [site] = await db
    .select({ id: sites.id })
    .from(sites)
    .where(and(eq(sites.id, siteId), eq(sites.ownerId, user.id)))
    .limit(1)
  if (!site) notFound()

  const { since, days } = windowForPlan(user.plan)
  const [summary, series, blockClicks, devices, countries] = await Promise.all([
    getSummary(siteId, since),
    getDailySeries(siteId, since),
    getBlockClicks(siteId, since),
    getDeviceSplit(siteId, since),
    getTopCountries(siteId, since),
  ])

  const buckets = buildBuckets(series, days)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold tracking-tight">Analytics</h1>
        <span className="text-sm text-neutral-500">Last {days} days</span>
      </div>

      {user.plan === 'free' && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          <Lock className="h-4 w-4" />
          You&apos;re seeing the last 7 days. Upgrade to Pro for 30-day analytics.
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Views" value={summary.views.toLocaleString()} />
        <StatCard label="Clicks" value={summary.clicks.toLocaleString()} />
        <StatCard label="Click rate" value={`${(summary.ctr * 100).toFixed(1)}%`} sub="clicks ÷ views" />
      </div>

      <LineChart data={buckets} />

      <div className="grid gap-3 md:grid-cols-2">
        <BarList
          title="Top blocks"
          empty="No clicks yet."
          items={blockClicks.map((b) => ({ label: blockLabel(b.type, b.data), count: b.count }))}
        />
        <div className="space-y-3">
          <BarList
            title="Devices"
            empty="No traffic yet."
            items={devices.map((d) => ({
              label: d.label.charAt(0).toUpperCase() + d.label.slice(1),
              count: d.count,
            }))}
          />
          <BarList
            title="Top countries"
            empty="No country data yet."
            items={countries.map((c) => ({ label: c.label, count: c.count }))}
          />
        </div>
      </div>
    </div>
  )
}
