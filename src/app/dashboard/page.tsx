import Link from 'next/link'
import Image from 'next/image'
import { eq, desc, and, inArray, gte, sql } from 'drizzle-orm'
import { ExternalLink, Pencil, Eye, MousePointerClick } from 'lucide-react'
import { requireUser } from '@/lib/auth/session'
import { db } from '@/db'
import { sites, blocks, clicks } from '@/db/schema'
import { env } from '@/env'
import { isHttpUrl } from '@/lib/utils'
import { CreateSiteForm } from '@/components/dashboard/CreateSiteForm'
import { DeleteSiteButton } from '@/components/dashboard/DeleteSiteButton'
import { Button } from '@/components/ui/button'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const user = await requireUser()
  const userSites = await db
    .select()
    .from(sites)
    .where(eq(sites.ownerId, user.id))
    .orderBy(desc(sites.createdAt))
  const appHost = new URL(env.NEXT_PUBLIC_APP_URL).host
  const siteIds = userSites.map((s) => s.id)

  const profileMap = new Map<string, { name: string; avatarUrl: string }>()
  const statMap = new Map<string, { views: number; clicks: number }>()

  if (siteIds.length > 0) {
    const profileRows = await db
      .select({ siteId: blocks.siteId, data: blocks.data })
      .from(blocks)
      .where(and(inArray(blocks.siteId, siteIds), eq(blocks.type, 'profile')))
    for (const r of profileRows) {
      if (r.data.type === 'profile' && !profileMap.has(r.siteId)) {
        profileMap.set(r.siteId, { name: r.data.name, avatarUrl: r.data.avatarUrl })
      }
    }

    const since = new Date(Date.now() - 7 * 86_400_000)
    const statRows = await db
      .select({
        siteId: clicks.siteId,
        views: sql<number>`count(*) filter (where ${clicks.blockId} is null)`.mapWith(Number),
        clicks: sql<number>`count(*) filter (where ${clicks.blockId} is not null)`.mapWith(Number),
      })
      .from(clicks)
      .where(and(inArray(clicks.siteId, siteIds), gte(clicks.createdAt, since)))
      .groupBy(clicks.siteId)
    for (const r of statRows) statMap.set(r.siteId, { views: r.views, clicks: r.clicks })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Your sites</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Plan: <span className="font-medium capitalize">{user.plan}</span>
          {user.plan === 'free' && ' · 1 site included'}
        </p>
      </div>

      <CreateSiteForm canCreate={user.plan === 'pro' || userSites.length === 0} appHost={appHost} />

      {userSites.length === 0 ? (
        <p className="text-sm text-neutral-400">No sites yet — create your first above.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {userSites.map((s) => {
            const profile = profileMap.get(s.id)
            const avatarUrl = profile?.avatarUrl
            const stats = statMap.get(s.id) ?? { views: 0, clicks: 0 }
            const name = profile?.name?.trim() || s.slug
            return (
              <div
                key={s.id}
                className="group rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
              >
                <div className="flex items-start gap-3">
                  {isHttpUrl(avatarUrl) ? (
                    <Image
                      src={avatarUrl}
                      alt=""
                      width={44}
                      height={44}
                      className="h-11 w-11 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 text-lg font-semibold text-neutral-500">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/dashboard/${s.id}/editor`}
                      className="block truncate font-semibold text-neutral-900 hover:underline"
                    >
                      {name}
                    </Link>
                    <p className="truncate text-sm text-neutral-400">
                      {appHost}/{s.slug}
                    </p>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${
                      s.isPublished ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${s.isPublished ? 'bg-green-500' : 'bg-neutral-300'}`}
                    />
                    {s.isPublished ? 'Live' : 'Draft'}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <StatTile icon={<Eye className="h-3.5 w-3.5" />} label="Views" value={stats.views} />
                  <StatTile
                    icon={<MousePointerClick className="h-3.5 w-3.5" />}
                    label="Clicks"
                    value={stats.clicks}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-neutral-400">Last 7 days</p>

                <div className="mt-4 flex items-center gap-2">
                  <Link href={`/dashboard/${s.id}/editor`} className="flex-1">
                    <Button variant="default" size="sm" className="w-full">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                  </Link>
                  {s.isPublished && (
                    <Link href={`/${s.slug}`} target="_blank">
                      <Button variant="outline" size="sm" aria-label="View live page">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  )}
                  <DeleteSiteButton siteId={s.id} slug={s.slug} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <div className="rounded-xl bg-neutral-50 px-3 py-2">
      <div className="flex items-center gap-1.5 text-xs text-neutral-400">
        {icon}
        {label}
      </div>
      <p className="mt-0.5 text-lg font-semibold tabular-nums text-neutral-900">
        {value.toLocaleString()}
      </p>
    </div>
  )
}
