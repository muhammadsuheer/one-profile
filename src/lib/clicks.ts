export type Device = 'mobile' | 'tablet' | 'desktop'

/** Coarse device classification from a User-Agent string (for analytics). */
export function detectDevice(ua: string): Device {
  const s = ua.toLowerCase()
  if (/ipad|tablet|playbook|silk/.test(s) || (/android/.test(s) && !/mobile/.test(s))) {
    return 'tablet'
  }
  if (/mobi|iphone|ipod|android.*mobile|windows phone|iemobile|blackberry/.test(s)) {
    return 'mobile'
  }
  return 'desktop'
}
