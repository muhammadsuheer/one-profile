import { z } from 'zod'

/** Reserved slugs — includes the spec list (§10) plus routes we own. */
export const RESERVED_SLUGS = new Set([
  'api', 'dashboard', 'login', 'signup', 'admin', 'www', 'about', 'pricing', '_next',
  'settings', 'analytics', 'audience', 'design', 'editor', 'app', 'help', 'support',
  'terms', 'privacy', 'blog', 'docs', 'status', 'account', 'billing', 'onepage', 'assets',
  'forgot-password', 'reset-password', 'onboarding', 'sitemap', 'robots',
])

export const slugSchema = z
  .string()
  .min(3, 'Use at least 3 characters')
  .max(30, 'Use at most 30 characters')
  .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers and hyphens')
  .refine((s) => !s.startsWith('-') && !s.endsWith('-'), 'Cannot start or end with a hyphen')
  .refine((s) => !s.includes('--'), 'Cannot contain consecutive hyphens')
  .refine((s) => !RESERVED_SLUGS.has(s), 'That URL is reserved')

/** Normalize raw user input before validation. */
export function normalizeSlug(raw: string): string {
  return raw.trim().toLowerCase()
}
