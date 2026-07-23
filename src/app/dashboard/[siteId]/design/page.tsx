import { notFound } from 'next/navigation'
import { and, eq, asc } from 'drizzle-orm'
import { db } from '@/db'
import { sites, blocks } from '@/db/schema'
import { getCurrentUser } from '@/lib/auth/session'
import { themeConfigSchema } from '@/lib/theme'
import { DesignClient } from '@/components/design/DesignClient'

export const metadata = { title: 'Design' }

export default async function DesignPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params
  const user = await getCurrentUser()
  if (!user) notFound()

  const [site] = await db
    .select()
    .from(sites)
    .where(and(eq(sites.id, siteId), eq(sites.ownerId, user.id)))
    .limit(1)
  if (!site) notFound()

  const siteBlocks = await db
    .select()
    .from(blocks)
    .where(eq(blocks.siteId, site.id))
    .orderBy(asc(blocks.position))

  const theme = themeConfigSchema.parse(site.theme)

  return <DesignClient siteId={site.id} plan={user.plan} initialTheme={theme} blocks={siteBlocks} />
}
