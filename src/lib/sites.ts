import { and, eq, asc } from 'drizzle-orm'
import { db } from '@/db'
import { sites, blocks, users, type Site, type Block } from '@/db/schema'

export interface PublicSite {
  site: Site
  blocks: Block[]
}

/** Published site + its visible blocks (ordered), or null. Used by /[slug]. */
export async function getPublishedSiteBySlug(slug: string): Promise<PublicSite | null> {
  const [site] = await db
    .select()
    .from(sites)
    .where(and(eq(sites.slug, slug), eq(sites.isPublished, true)))
    .limit(1)
  if (!site) return null

  const siteBlocks = await db
    .select()
    .from(blocks)
    .where(and(eq(blocks.siteId, site.id), eq(blocks.isVisible, true)))
    .orderBy(asc(blocks.position))

  return { site, blocks: siteBlocks }
}

/** Owner's plan for a site (drives footer branding + Pro block gating). */
export async function getSiteOwnerPlan(ownerId: string): Promise<'free' | 'pro'> {
  const [row] = await db
    .select({ plan: users.plan })
    .from(users)
    .where(eq(users.id, ownerId))
    .limit(1)
  return row?.plan ?? 'free'
}
