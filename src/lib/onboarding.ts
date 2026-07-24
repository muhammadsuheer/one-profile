/**
 * Rule-based "recommendation engine" for onboarding. Maps a user's role + color
 * vibe to a curated profile tagline/badge and a matching theme palette — so we
 * can auto-build a professional page with zero AI cost. AI (Groq) can later
 * enhance the generated bio/copy on top of this.
 */

export interface OnboardingRole {
  id: string
  label: string
  tagline: string
  badge: string
  badgeIcon: string
}

export const ONBOARDING_ROLES: OnboardingRole[] = [
  { id: 'creator', label: 'Creator', tagline: 'Creator & storyteller', badge: 'Content Creator', badgeIcon: 'sparkles' },
  { id: 'developer', label: 'Developer', tagline: 'Software developer', badge: 'Developer', badgeIcon: 'zap' },
  { id: 'designer', label: 'Designer', tagline: 'Product & visual designer', badge: 'Designer', badgeIcon: 'star' },
  { id: 'musician', label: 'Musician', tagline: 'Artist & musician', badge: 'Musician', badgeIcon: 'star' },
  { id: 'photographer', label: 'Photographer', tagline: 'Photographer & visual artist', badge: 'Photographer', badgeIcon: 'star' },
  { id: 'founder', label: 'Founder', tagline: 'Founder & entrepreneur', badge: 'Founder', badgeIcon: 'crown' },
  { id: 'coach', label: 'Coach', tagline: 'Coach & mentor', badge: 'Coach', badgeIcon: 'verified' },
  { id: 'writer', label: 'Writer', tagline: 'Writer & author', badge: 'Writer', badgeIcon: 'star' },
]

export interface OnboardingVibe {
  id: string
  label: string
  accent: string
  lightPalette: string
  darkPalette: string
}

export const ONBOARDING_VIBES: OnboardingVibe[] = [
  { id: 'bold', label: 'Bold', accent: '#F5124A', lightPalette: 'rose', darkPalette: 'midnight' },
  { id: 'ocean', label: 'Ocean', accent: '#3B82F6', lightPalette: 'sky', darkPalette: 'navy' },
  { id: 'fresh', label: 'Fresh', accent: '#10B981', lightPalette: 'mint', darkPalette: 'forest' },
  { id: 'royal', label: 'Royal', accent: '#A855F7', lightPalette: 'lavender', darkPalette: 'plum' },
  { id: 'warm', label: 'Warm', accent: '#D97706', lightPalette: 'sand', darkPalette: 'espresso' },
  { id: 'calm', label: 'Calm', accent: '#06B6D4', lightPalette: 'slate', darkPalette: 'ocean' },
]

export function resolveRole(id: string): OnboardingRole | undefined {
  return ONBOARDING_ROLES.find((r) => r.id === id)
}

export function resolveVibe(id: string): OnboardingVibe | undefined {
  return ONBOARDING_VIBES.find((v) => v.id === id)
}

/** Turn a display name into a valid starter slug suggestion. */
export function suggestSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30)
}
