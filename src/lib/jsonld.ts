import type { Block } from '@/db/schema'
import { isHttpUrl } from '@/lib/utils'

/**
 * Build schema.org Person JSON-LD from a published page's blocks. Social links
 * become `sameAs` entries so search engines can connect the profile to its
 * other presences (rich results). Returns null when there's nothing useful.
 */
export function buildProfileJsonLd(
  blocks: Block[],
  pageUrl: string,
): Record<string, unknown> | null {
  const profileBlock = blocks.find((b) => b.type === 'profile')
  const profile = profileBlock?.data.type === 'profile' ? profileBlock.data : null
  const name = profile?.name?.trim()
  if (!name) return null

  const sameAs = new Set<string>()
  for (const b of blocks) {
    if (b.data.type === 'socialRow') {
      for (const item of b.data.items) {
        if (isHttpUrl(item.url)) sameAs.add(item.url)
      }
    }
  }

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url: pageUrl,
  }
  if (profile?.tagline?.trim()) jsonLd.description = profile.tagline.trim()
  if (isHttpUrl(profile?.avatarUrl)) jsonLd.image = profile?.avatarUrl
  if (sameAs.size > 0) jsonLd.sameAs = [...sameAs]

  return jsonLd
}
