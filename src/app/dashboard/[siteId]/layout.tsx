import { notFound } from 'next/navigation'
import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { sites } from '@/db/schema'
import { getCurrentUser } from '@/lib/auth/session'
import { SiteTabs } from '@/components/dashboard/SiteTabs'

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ siteId: string }>
}) {
  const { siteId } = await params
  const user = await getCurrentUser()
  if (!user) notFound()

  const [site] = await db
    .select({ id: sites.id })
    .from(sites)
    .where(and(eq(sites.id, siteId), eq(sites.ownerId, user.id)))
    .limit(1)
  if (!site) notFound()

  return (
    <div className="space-y-5">
      <SiteTabs siteId={siteId} />
      {children}
    </div>
  )
}
