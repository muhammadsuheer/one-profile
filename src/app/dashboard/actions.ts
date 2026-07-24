'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { and, eq, count } from 'drizzle-orm'
import { db } from '@/db'
import { sites, blocks } from '@/db/schema'
import { getCurrentUser } from '@/lib/auth/session'
import { slugSchema, normalizeSlug } from '@/lib/slug'
import { DEFAULT_THEME } from '@/lib/theme'

export type CreateSiteState = { error?: string } | undefined

export async function createSite(
  _prev: CreateSiteState,
  formData: FormData,
): Promise<CreateSiteState> {
  const user = await getCurrentUser()
  if (!user) return { error: 'You must be signed in.' }

  const parsed = slugSchema.safeParse(normalizeSlug(String(formData.get('slug') ?? '')))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid URL' }
  const slug = parsed.data

  // Plan gating (§9): free plan is limited to 1 site. Enforced server-side.
  if (user.plan === 'free') {
    const [row] = await db.select({ value: count() }).from(sites).where(eq(sites.ownerId, user.id))
    if ((row?.value ?? 0) >= 1) {
      return { error: 'The free plan allows 1 site. Upgrade to Pro for unlimited sites.' }
    }
  }

  const [existing] = await db.select({ id: sites.id }).from(sites).where(eq(sites.slug, slug)).limit(1)
  if (existing) return { error: 'That URL is already taken.' }

  let siteId: string
  try {
    const [site] = await db
      .insert(sites)
      .values({ ownerId: user.id, slug, theme: DEFAULT_THEME, isPublished: false })
      .returning()
    if (!site) return { error: 'Could not create the site. Please try again.' }

    // Seed a starter profile block so the page isn't blank.
    await db.insert(blocks).values({
      siteId: site.id,
      type: 'profile',
      position: 1000,
      data: { type: 'profile', avatarUrl: '', name: user.name ?? 'Your name', tagline: '' },
    })
    siteId = site.id
  } catch {
    return { error: 'Could not create the site. Please try again.' }
  }

  revalidatePath('/dashboard')
  redirect(`/dashboard/${siteId}/editor`)
}

export async function deleteSite(
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'You must be signed in.' }
  const siteId = String(formData.get('siteId') ?? '')
  if (!siteId) return { ok: false, error: 'Invalid site.' }

  try {
    // Cascade removes blocks, subscribers, clicks, media.
    await db.delete(sites).where(and(eq(sites.id, siteId), eq(sites.ownerId, user.id)))
  } catch {
    return { ok: false, error: 'Could not delete the site. Please try again.' }
  }

  revalidatePath('/dashboard')
  return { ok: true }
}
