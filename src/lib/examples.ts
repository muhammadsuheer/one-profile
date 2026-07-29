import { and, asc, eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import { blocks, sites } from '@/db/schema'
import { BLOCK_REGISTRY } from '@/lib/blocks/registry'
import { getPalette, parseThemeConfig } from '@/lib/theme'
import type { BlockData, BlockType } from '@/lib/blocks/schemas'

/**
 * The showcase pages behind /examples, read from the database.
 *
 * This was a hard-coded array duplicating what the seed inserted — two lists kept
 * in step by hand, which drifted. A site now carries `isExample` and
 * `exampleMeta`, so the seed is the only place an example is defined and adding one
 * is a data change rather than a deploy.
 *
 * Most of what the gallery shows is derived rather than stored: the name and avatar
 * come from the page's own profile block, the palette and accent from its theme,
 * and the chips from the blocks it actually has. Only `field`, `summary` and
 * `highlight` are editorial, which is all `exampleMeta` holds. Deriving the rest
 * means the gallery can't describe a page that isn't there — change a page's blocks
 * and its chips follow.
 *
 * Everything here returns empty rather than throwing when nothing is seeded. The
 * gallery is a marketing page: an environment without the seed should render an
 * honest empty state, not a 500.
 */
export type ExampleProfile = {
  slug: string
  name: string
  avatarUrl: string
  field: string
  summary: string
  highlight: string
  /** Human labels for the blocks this page uses, in page order. */
  blocks: string[]
  /** Palette display name, e.g. "Plum". */
  palette: string
  accent: string
}

type ProfileData = Extract<BlockData, { type: 'profile' }>

/** All published examples, oldest first so the gallery order is stable. */
export async function getExampleProfiles(): Promise<ExampleProfile[]> {
  const rows = await db
    .select({
      id: sites.id,
      slug: sites.slug,
      theme: sites.theme,
      exampleMeta: sites.exampleMeta,
    })
    .from(sites)
    .where(and(eq(sites.isExample, true), eq(sites.isPublished, true)))
    .orderBy(asc(sites.createdAt))

  if (rows.length === 0) return []

  // Scoped to these sites: without the `inArray` this read every visible block in
  // the database and threw all but a handful away.
  const siteIds = rows.map((r) => r.id)
  const allBlocks = await db
    .select({ siteId: blocks.siteId, type: blocks.type, data: blocks.data })
    .from(blocks)
    .where(and(inArray(blocks.siteId, siteIds), eq(blocks.isVisible, true)))
    .orderBy(asc(blocks.position))

  return rows.map((row) => {
    const own = allBlocks.filter((b) => b.siteId === row.id)
    const profile = own.find((b) => b.type === 'profile')?.data as ProfileData | undefined

    const theme = parseThemeConfig(row.theme)
    const meta = row.exampleMeta

    return {
      slug: row.slug,
      name: profile?.name ?? row.slug,
      avatarUrl: profile?.avatarUrl ?? '',
      field: meta?.field ?? '',
      summary: meta?.summary ?? '',
      highlight: meta?.highlight ?? '',
      // Deduped: a page with three link cards should show one "Link card" chip.
      blocks: [
        ...new Set(own.map((b) => BLOCK_REGISTRY[b.type as BlockType]?.label ?? b.type)),
      ],
      palette: getPalette(theme.preset).name,
      accent: theme.accentColor,
    }
  })
}

/** True if this slug is one of the showcase pages. One narrow query. */
export async function isExampleSlug(slug: string): Promise<boolean> {
  const [row] = await db
    .select({ id: sites.id })
    .from(sites)
    .where(and(eq(sites.slug, slug), eq(sites.isExample, true), eq(sites.isPublished, true)))
    .limit(1)

  return Boolean(row)
}

/**
 * The back/next pair for an example page, or null if this slug isn't an example.
 *
 * Next wraps around, so paging through the examples never dead-ends.
 *
 * This runs on every public page render — a real customer's page included — so it
 * deliberately doesn't go through `getExampleProfiles`. That would read every
 * example's blocks to build data this needs one field of. Instead: one narrow query
 * for the running order, and a second for the next page's name only, which a
 * customer's page never reaches because the slug isn't in the first result.
 */
export async function getExampleNav(
  slug: string,
): Promise<{ currentSlug: string; nextSlug: string; nextName: string } | null> {
  const rows = await db
    .select({ id: sites.id, slug: sites.slug })
    .from(sites)
    .where(and(eq(sites.isExample, true), eq(sites.isPublished, true)))
    .orderBy(asc(sites.createdAt))

  const i = rows.findIndex((r) => r.slug === slug)
  if (i === -1) return null

  const next = rows[(i + 1) % rows.length]
  const [profileBlock] = await db
    .select({ data: blocks.data })
    .from(blocks)
    .where(and(eq(blocks.siteId, next.id), eq(blocks.type, 'profile')))
    .limit(1)

  const name = (profileBlock?.data as ProfileData | undefined)?.name ?? next.slug
  return { currentSlug: slug, nextSlug: next.slug, nextName: name.split(' ')[0] }
}
