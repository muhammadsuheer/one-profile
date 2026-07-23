import Link from 'next/link'
import { eq, desc } from 'drizzle-orm'
import { ExternalLink, Pencil } from 'lucide-react'
import { requireUser } from '@/lib/auth/session'
import { db } from '@/db'
import { sites } from '@/db/schema'
import { env } from '@/env'
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
          {userSites.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">/{s.slug}</p>
                  <span
                    className={`mt-1 inline-flex items-center gap-1.5 text-xs ${
                      s.isPublished ? 'text-green-600' : 'text-neutral-400'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        s.isPublished ? 'bg-green-500' : 'bg-neutral-300'
                      }`}
                    />
                    {s.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <DeleteSiteButton siteId={s.id} slug={s.slug} />
              </div>

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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
