import { notFound } from 'next/navigation'
import { and, eq, asc } from 'drizzle-orm'
import { db } from '@/db'
import { sites, blocks } from '@/db/schema'
import { getCurrentUser } from '@/lib/auth/session'
import { themeConfigSchema } from '@/lib/theme'
import { env } from '@/env'
import { EditorClient } from '@/components/editor/EditorClient'

export const metadata = { title: 'Editor' }

export default async function EditorPage({ params }: { params: Promise<{ siteId: string }> }) {
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

  return (
    <EditorClient
      siteId={site.id}
      slug={site.slug}
      appUrl={env.NEXT_PUBLIC_APP_URL}
      initialIsPublished={site.isPublished}
      theme={theme}
      plan={user.plan}
      initialBlocks={siteBlocks}
    />
  )
}
