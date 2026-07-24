import type { SocialPlatform } from '@/lib/blocks/schemas'
import { isHttpUrl } from '@/lib/utils'

const HANDLE_BASE: Partial<Record<SocialPlatform, (handle: string) => string>> = {
  instagram: (h) => `https://instagram.com/${h}`,
  x: (h) => `https://x.com/${h}`,
  facebook: (h) => `https://facebook.com/${h}`,
  tiktok: (h) => `https://tiktok.com/@${h}`,
  youtube: (h) => `https://youtube.com/@${h}`,
  linkedin: (h) => `https://linkedin.com/in/${h}`,
  whatsapp: (h) => `https://wa.me/${h.replace(/[^0-9]/g, '')}`,
  threads: (h) => `https://threads.net/@${h}`,
  twitch: (h) => `https://twitch.tv/${h}`,
  discord: (h) => `https://discord.gg/${h}`,
  github: (h) => `https://github.com/${h}`,
  spotify: (h) => `https://open.spotify.com/user/${h}`,
  telegram: (h) => `https://t.me/${h}`,
  snapchat: (h) => `https://snapchat.com/add/${h}`,
  pinterest: (h) => `https://pinterest.com/${h}`,
}

/**
 * Turn a raw social input into a canonical link. Accepts a username / @handle,
 * a bare domain (instagram.com/x), or a full URL — and never throws on junk.
 */
export function normalizeSocialUrl(platform: SocialPlatform, input: string): string {
  const raw = input.trim()
  if (!raw) return ''

  // Already a full link (any platform's URL is accepted as-is).
  if (/^https?:\/\//i.test(raw)) return raw
  if (/^(mailto:|tel:)/i.test(raw)) return raw

  // Bare domain like "instagram.com/user" → add https://
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+(\/.*)?$/i.test(raw) && !raw.includes('@')) {
    return `https://${raw.replace(/^\/+/, '')}`
  }

  // Email address for the email platform → mailto:
  if (platform === 'email') {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(raw) ? `mailto:${raw}` : ''
  }

  // Otherwise treat it as a handle / username.
  const handle = raw
    .replace(/^@+/, '')
    .replace(/\s+/g, '')
    .replace(/^\/+|\/+$/g, '')
  const build = HANDLE_BASE[platform]
  return build ? build(handle) : ''
}

/** A link we can actually render for a social icon (http/https/mailto/tel). */
export function isSocialLink(url: string): boolean {
  return isHttpUrl(url) || /^(mailto:|tel:)/i.test(url)
}
