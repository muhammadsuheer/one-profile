'use server'

import { eq, count } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { sites, blocks, type NewBlock } from '@/db/schema'
import { getCurrentUser } from '@/lib/auth/session'
import { slugSchema, normalizeSlug } from '@/lib/slug'
import { socialPlatformSchema } from '@/lib/blocks/schemas'
import { resolveRole, resolveVibe } from '@/lib/onboarding'
import { aiEnabled, groqComplete } from '@/lib/ai'
import { normalizeSocialUrl, isSocialLink } from '@/lib/social'
import type { ThemeConfig } from '@/lib/theme'
import type { ActionResult } from '@/lib/actions'

const inputSchema = z.object({
  slug: z.string(),
  role: z.string(),
  mode: z.enum(['light', 'dark']),
  mood: z.string(),
  socials: z.array(z.object({ platform: socialPlatformSchema, url: z.string() })).max(12),
})

export async function createSiteFromOnboarding(
  input: z.infer<typeof inputSchema>,
): Promise<ActionResult<{ siteId: string }>> {
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid input.' }

  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'You must be signed in.' }

  const slugParsed = slugSchema.safeParse(normalizeSlug(parsed.data.slug))
  if (!slugParsed.success) {
    return { ok: false, error: slugParsed.error.issues[0]?.message ?? 'Invalid URL' }
  }
  const slug = slugParsed.data

  if (user.plan === 'free') {
    const [row] = await db.select({ value: count() }).from(sites).where(eq(sites.ownerId, user.id))
    if ((row?.value ?? 0) >= 1) {
      return { ok: false, error: 'The free plan allows 1 site. Upgrade to Pro for more.' }
    }
  }

  const [existing] = await db.select({ id: sites.id }).from(sites).where(eq(sites.slug, slug)).limit(1)
  if (existing) return { ok: false, error: 'That URL is already taken.' }

  // ---- rule-based recommendation → theme + profile ----
  const role = resolveRole(parsed.data.role)
  const vibe = resolveVibe(parsed.data.mood)
  const paletteId = vibe
    ? parsed.data.mode === 'light'
      ? vibe.lightPalette
      : vibe.darkPalette
    : parsed.data.mode === 'light'
      ? 'light'
      : 'midnight'

  const theme: ThemeConfig = {
    preset: paletteId,
    accentColor: vibe?.accent ?? '#F5124A',
    fontFamily: 'Inter',
    buttonStyle: 'rounded',
    hideBranding: false,
  }

  let site: { id: string } | undefined
  try {
    const rows = await db
      .insert(sites)
      .values({ ownerId: user.id, slug, theme, isPublished: false })
      .returning({ id: sites.id })
    site = rows[0]
  } catch {
    return { ok: false, error: 'Could not create your page. Please try again.' }
  }
  if (!site) return { ok: false, error: 'Could not create your page. Please try again.' }

  // AI-enhance the tagline when Groq is configured; otherwise use the rule-based one.
  let tagline = role?.tagline ?? ''
  if (aiEnabled()) {
    const aiTag = await groqComplete(
      'Write one bio-link tagline, under 8 words. No quotes, emojis or hashtags.',
      `${user.name ?? 'Someone'}, ${role?.label ?? 'creator'}`,
      { maxTokens: 28 },
    )
    if (aiTag) tagline = aiTag
  }

  const blockValues: NewBlock[] = [
    {
      siteId: site.id,
      type: 'profile',
      position: 1000,
      data: {
        type: 'profile',
        avatarUrl: '',
        name: user.name ?? 'Your name',
        tagline,
        badgeText: role?.badge ?? '',
        badgeIcon: role?.badgeIcon ?? '',
      },
    },
  ]

  const validSocials = parsed.data.socials
    .map((s) => ({ platform: s.platform, url: normalizeSocialUrl(s.platform, s.url) }))
    .filter((s) => isSocialLink(s.url))
  if (validSocials.length > 0) {
    blockValues.push({
      siteId: site.id,
      type: 'socialRow',
      position: 2000,
      data: { type: 'socialRow', items: validSocials },
    })
  }

  try {
    await db.insert(blocks).values(blockValues)
  } catch {
    return { ok: false, error: 'Could not create your page. Please try again.' }
  }

  return { ok: true, data: { siteId: site.id } }
}
