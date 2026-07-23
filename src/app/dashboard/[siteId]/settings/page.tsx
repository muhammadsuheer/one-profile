import { notFound } from 'next/navigation'
import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { sites } from '@/db/schema'
import { getCurrentUser } from '@/lib/auth/session'
import { env } from '@/env'
import { seoConfigSchema } from '@/lib/theme'
import { SettingsForm } from '@/components/dashboard/SettingsForm'
import { DeleteSiteButton } from '@/components/dashboard/DeleteSiteButton'

export const metadata = { title: 'Settings' }

export default async function SettingsPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params
  const user = await getCurrentUser()
  if (!user) notFound()

  const [site] = await db
    .select()
    .from(sites)
    .where(and(eq(sites.id, siteId), eq(sites.ownerId, user.id)))
    .limit(1)
  if (!site) notFound()

  const seo = site.seo ? seoConfigSchema.parse(site.seo) : null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-neutral-500">Manage your page URL, domain, SEO and visibility.</p>
      </div>

      <SettingsForm
        site={{
          id: site.id,
          slug: site.slug,
          customDomain: site.customDomain,
          isPublished: site.isPublished,
          seo,
        }}
        plan={user.plan}
        appHost={new URL(env.NEXT_PUBLIC_APP_URL).host}
      />

      <div className="max-w-xl rounded-xl border border-red-200 bg-red-50/50 p-4">
        <h2 className="text-sm font-semibold text-red-700">Danger zone</h2>
        <p className="mt-1 text-xs text-neutral-500">
          Deleting this site permanently removes its blocks, subscribers and analytics.
        </p>
        <div className="mt-3">
          <DeleteSiteButton siteId={site.id} slug={site.slug} />
        </div>
      </div>
    </div>
  )
}
