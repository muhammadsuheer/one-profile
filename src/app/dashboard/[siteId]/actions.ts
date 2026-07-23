'use server'

import { revalidatePath } from 'next/cache'
import { and, eq, ne, asc, desc, gt } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { sites, blocks, type Block, type Site } from '@/db/schema'
import { getCurrentUser } from '@/lib/auth/session'
import { blockDataSchema, type BlockType } from '@/lib/blocks/schemas'
import { BLOCK_REGISTRY } from '@/lib/blocks/registry'
import { sanitizeHtml } from '@/lib/sanitize'
import { themeConfigSchema, seoConfigSchema } from '@/lib/theme'
import { slugSchema, normalizeSlug } from '@/lib/slug'
import type { ActionResult } from '@/lib/actions'
import type { User } from '@/db/schema'

/** Verify the caller owns the site (§10 — re-check on every action). */
async function ownedSite(siteId: string): Promise<{ user: User; site: Site } | null> {
  const user = await getCurrentUser()
  if (!user) return null
  const [site] = await db
    .select()
    .from(sites)
    .where(and(eq(sites.id, siteId), eq(sites.ownerId, user.id)))
    .limit(1)
  return site ? { user, site } : null
}

const idPair = z.object({ siteId: z.string().uuid(), blockId: z.string().uuid() })

export async function addBlock(input: { siteId: string; type: string }): Promise<ActionResult<Block>> {
  const parsed = z.object({ siteId: z.string().uuid(), type: z.string() }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid request' }

  const ctx = await ownedSite(parsed.data.siteId)
  if (!ctx) return { ok: false, error: 'Site not found' }

  const entry = BLOCK_REGISTRY[parsed.data.type as BlockType]
  if (!entry) return { ok: false, error: 'Unknown block type' }
  if (entry.proOnly && ctx.user.plan !== 'pro') {
    return { ok: false, error: 'Upgrade to Pro to use this block' }
  }

  const [last] = await db
    .select({ position: blocks.position })
    .from(blocks)
    .where(eq(blocks.siteId, ctx.site.id))
    .orderBy(desc(blocks.position))
    .limit(1)
  const position = (last?.position ?? 0) + 1000

  const [created] = await db
    .insert(blocks)
    .values({ siteId: ctx.site.id, type: entry.type, position, data: entry.defaultData })
    .returning()
  if (!created) return { ok: false, error: 'Could not add block' }

  revalidatePath(`/${ctx.site.slug}`)
  return { ok: true, data: created }
}

export async function updateBlockData(input: {
  siteId: string
  blockId: string
  data: unknown
}): Promise<ActionResult<undefined>> {
  const parsed = z
    .object({ siteId: z.string().uuid(), blockId: z.string().uuid(), data: blockDataSchema })
    .safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid block data' }

  const ctx = await ownedSite(parsed.data.siteId)
  if (!ctx) return { ok: false, error: 'Site not found' }

  const [block] = await db
    .select()
    .from(blocks)
    .where(and(eq(blocks.id, parsed.data.blockId), eq(blocks.siteId, ctx.site.id)))
    .limit(1)
  if (!block) return { ok: false, error: 'Block not found' }
  if (block.type !== parsed.data.data.type) return { ok: false, error: 'Block type mismatch' }

  // Sanitize rich text server-side before storage (§10).
  const data =
    parsed.data.data.type === 'richText'
      ? { ...parsed.data.data, html: sanitizeHtml(parsed.data.data.html) }
      : parsed.data.data

  await db.update(blocks).set({ data }).where(eq(blocks.id, block.id))
  revalidatePath(`/${ctx.site.slug}`)
  return { ok: true, data: undefined }
}

export async function moveBlock(input: {
  siteId: string
  blockId: string
  position: number
}): Promise<ActionResult<undefined>> {
  const parsed = idPair.extend({ position: z.number().finite() }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid request' }

  const ctx = await ownedSite(parsed.data.siteId)
  if (!ctx) return { ok: false, error: 'Site not found' }

  // Only the moved row is updated (gap-based positions, §5).
  await db
    .update(blocks)
    .set({ position: Math.round(parsed.data.position) })
    .where(and(eq(blocks.id, parsed.data.blockId), eq(blocks.siteId, ctx.site.id)))
  revalidatePath(`/${ctx.site.slug}`)
  return { ok: true, data: undefined }
}

export async function setBlockVisibility(input: {
  siteId: string
  blockId: string
  isVisible: boolean
}): Promise<ActionResult<undefined>> {
  const parsed = idPair.extend({ isVisible: z.boolean() }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid request' }

  const ctx = await ownedSite(parsed.data.siteId)
  if (!ctx) return { ok: false, error: 'Site not found' }

  await db
    .update(blocks)
    .set({ isVisible: parsed.data.isVisible })
    .where(and(eq(blocks.id, parsed.data.blockId), eq(blocks.siteId, ctx.site.id)))
  revalidatePath(`/${ctx.site.slug}`)
  return { ok: true, data: undefined }
}

export async function duplicateBlock(input: {
  siteId: string
  blockId: string
}): Promise<ActionResult<Block>> {
  const parsed = idPair.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid request' }

  const ctx = await ownedSite(parsed.data.siteId)
  if (!ctx) return { ok: false, error: 'Site not found' }

  const [orig] = await db
    .select()
    .from(blocks)
    .where(and(eq(blocks.id, parsed.data.blockId), eq(blocks.siteId, ctx.site.id)))
    .limit(1)
  if (!orig) return { ok: false, error: 'Block not found' }

  const [next] = await db
    .select({ position: blocks.position })
    .from(blocks)
    .where(and(eq(blocks.siteId, ctx.site.id), gt(blocks.position, orig.position)))
    .orderBy(asc(blocks.position))
    .limit(1)
  const newPos = next ? Math.floor((orig.position + next.position) / 2) : orig.position + 1000
  const position = newPos === orig.position ? orig.position + 1 : newPos

  const [created] = await db
    .insert(blocks)
    .values({ siteId: ctx.site.id, type: orig.type, position, isVisible: orig.isVisible, data: orig.data })
    .returning()
  if (!created) return { ok: false, error: 'Could not duplicate block' }

  revalidatePath(`/${ctx.site.slug}`)
  return { ok: true, data: created }
}

export async function deleteBlock(input: {
  siteId: string
  blockId: string
}): Promise<ActionResult<undefined>> {
  const parsed = idPair.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid request' }

  const ctx = await ownedSite(parsed.data.siteId)
  if (!ctx) return { ok: false, error: 'Site not found' }

  await db
    .delete(blocks)
    .where(and(eq(blocks.id, parsed.data.blockId), eq(blocks.siteId, ctx.site.id)))
  revalidatePath(`/${ctx.site.slug}`)
  return { ok: true, data: undefined }
}

export async function setPublished(input: {
  siteId: string
  isPublished: boolean
}): Promise<ActionResult<undefined>> {
  const parsed = z.object({ siteId: z.string().uuid(), isPublished: z.boolean() }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid request' }

  const ctx = await ownedSite(parsed.data.siteId)
  if (!ctx) return { ok: false, error: 'Site not found' }

  await db.update(sites).set({ isPublished: parsed.data.isPublished }).where(eq(sites.id, ctx.site.id))
  revalidatePath(`/${ctx.site.slug}`)
  revalidatePath('/dashboard')
  return { ok: true, data: undefined }
}

export async function updateTheme(input: {
  siteId: string
  theme: unknown
}): Promise<ActionResult<undefined>> {
  const parsed = z.object({ siteId: z.string().uuid(), theme: themeConfigSchema }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid theme' }

  const ctx = await ownedSite(parsed.data.siteId)
  if (!ctx) return { ok: false, error: 'Site not found' }

  // hideBranding is Pro-only — enforced server-side (§9).
  const theme =
    ctx.user.plan === 'pro' ? parsed.data.theme : { ...parsed.data.theme, hideBranding: false }

  await db.update(sites).set({ theme }).where(eq(sites.id, ctx.site.id))
  revalidatePath(`/${ctx.site.slug}`)
  return { ok: true, data: undefined }
}

export type SettingsState = { ok?: boolean; error?: string } | undefined

const domainRegex = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$/i

export async function updateSettings(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const ctx = await ownedSite(String(formData.get('siteId') ?? ''))
  if (!ctx) return { error: 'Site not found' }

  const slugParsed = slugSchema.safeParse(normalizeSlug(String(formData.get('slug') ?? '')))
  if (!slugParsed.success) return { error: slugParsed.error.issues[0]?.message ?? 'Invalid URL' }
  const slug = slugParsed.data

  if (slug !== ctx.site.slug) {
    const [taken] = await db
      .select({ id: sites.id })
      .from(sites)
      .where(and(eq(sites.slug, slug), ne(sites.id, ctx.site.id)))
      .limit(1)
    if (taken) return { error: 'That URL is already taken.' }
  }

  // Custom domain — Pro only (§9). Free users can't set it.
  let customDomain: string | null = ctx.site.customDomain
  if (ctx.user.plan === 'pro') {
    const raw = String(formData.get('customDomain') ?? '').trim().toLowerCase()
    if (raw === '') {
      customDomain = null
    } else if (!domainRegex.test(raw)) {
      return { error: 'Enter a valid domain, e.g. links.example.com' }
    } else {
      const [taken] = await db
        .select({ id: sites.id })
        .from(sites)
        .where(and(eq(sites.customDomain, raw), ne(sites.id, ctx.site.id)))
        .limit(1)
      if (taken) return { error: 'That domain is already in use.' }
      customDomain = raw
    }
  }

  const seoParsed = seoConfigSchema.safeParse({
    title: String(formData.get('seoTitle') ?? '').trim() || undefined,
    description: String(formData.get('seoDescription') ?? '').trim() || undefined,
    ogImageUrl: String(formData.get('seoOgImageUrl') ?? '').trim() || undefined,
  })
  if (!seoParsed.success) return { error: 'The OG image must be a valid URL.' }

  const oldSlug = ctx.site.slug
  await db
    .update(sites)
    .set({
      slug,
      customDomain,
      seo: seoParsed.data,
      isPublished: formData.get('isPublished') === 'on',
    })
    .where(eq(sites.id, ctx.site.id))

  revalidatePath(`/${oldSlug}`)
  revalidatePath(`/${slug}`)
  revalidatePath('/dashboard')
  return { ok: true }
}
