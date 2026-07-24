/**
 * Validate + normalize a Calendly scheduling link for safe iframe embedding.
 * Only calendly.com URLs are accepted, so the render can trust the src.
 * Returns the embed URL (hiding Calendly's own cookie banner) or null.
 */
const CALENDLY_RE = /^https?:\/\/(?:www\.)?calendly\.com\/[A-Za-z0-9_\-/?=&.%]+$/i

export function parseCalendly(url: string): string | null {
  const raw = url.trim()
  if (!CALENDLY_RE.test(raw)) return null
  // Normalize to https and append a param that hides the GDPR banner inside the frame.
  const httpsUrl = raw.replace(/^http:/i, 'https:')
  const sep = httpsUrl.includes('?') ? '&' : '?'
  return `${httpsUrl}${sep}hide_gdpr_banner=1`
}
