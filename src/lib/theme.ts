import { z } from 'zod'

/** CSS custom-property values for a palette (applied on the page wrapper, §7). */
export interface ThemeTokens {
  bg: string
  surface: string
  surfaceHover: string
  border: string
  text: string
  textMuted: string
}

export interface Palette {
  id: string
  name: string
  mode: 'light' | 'dark'
  /** Curated default accent applied when the palette is chosen (user can tweak). */
  accent: string
  tokens: ThemeTokens
}

/** 10 light + 10 dark ready-made palettes. `light`/`midnight`/`sunset` kept for back-compat. */
export const PALETTES: Palette[] = [
  // ---------- Light ----------
  { id: 'light', name: 'Snow', mode: 'light', accent: '#F5124A', tokens: { bg: '#FFFFFF', surface: '#F5F5F7', surfaceHover: '#ECECEE', border: '#E2E2E5', text: '#0A0A0B', textMuted: '#6E6E73' } },
  { id: 'paper', name: 'Paper', mode: 'light', accent: '#E86A33', tokens: { bg: '#FAF9F6', surface: '#F2F0EA', surfaceHover: '#EAE7DE', border: '#E4E0D5', text: '#1C1917', textMuted: '#78716C' } },
  { id: 'mint', name: 'Mint', mode: 'light', accent: '#0EA5A4', tokens: { bg: '#F5FBF8', surface: '#E7F5EF', surfaceHover: '#DBEFE6', border: '#CDE9DC', text: '#0C1F18', textMuted: '#5B7A6E' } },
  { id: 'sky', name: 'Sky', mode: 'light', accent: '#2563EB', tokens: { bg: '#F6FAFF', surface: '#E9F2FE', surfaceHover: '#DCEBFD', border: '#CEE1FB', text: '#0B1B2B', textMuted: '#5A7186' } },
  { id: 'blush', name: 'Blush', mode: 'light', accent: '#EC4899', tokens: { bg: '#FFF7FA', surface: '#FCEAF1', surfaceHover: '#F9DEEA', border: '#F4D0E0', text: '#2A0E1B', textMuted: '#8A6473' } },
  { id: 'sand', name: 'Sand', mode: 'light', accent: '#B45309', tokens: { bg: '#FBF8F3', surface: '#F3ECE0', surfaceHover: '#EBE1D0', border: '#E4D8C3', text: '#241C10', textMuted: '#7C6F58' } },
  { id: 'lavender', name: 'Lavender', mode: 'light', accent: '#7C3AED', tokens: { bg: '#FAF8FF', surface: '#EFEAFB', surfaceHover: '#E5DDF8', border: '#D9CFF3', text: '#1A1327', textMuted: '#6E6385' } },
  { id: 'slate', name: 'Slate', mode: 'light', accent: '#475569', tokens: { bg: '#F8FAFC', surface: '#EEF2F6', surfaceHover: '#E2E8F0', border: '#D5DEE8', text: '#0F172A', textMuted: '#64748B' } },
  { id: 'rose', name: 'Rosé', mode: 'light', accent: '#E11D48', tokens: { bg: '#FFF8F7', surface: '#FCEBE9', surfaceHover: '#F8DEDA', border: '#F2CFC9', text: '#2A1211', textMuted: '#886562' } },
  { id: 'cloud', name: 'Cloud', mode: 'light', accent: '#6366F1', tokens: { bg: '#FCFCFD', surface: '#F1F2F6', surfaceHover: '#E8E9F0', border: '#DCDEE8', text: '#14151A', textMuted: '#676A78' } },

  // ---------- Dark ----------
  { id: 'midnight', name: 'Midnight', mode: 'dark', accent: '#F5124A', tokens: { bg: '#0A0A0B', surface: '#1A1A1C', surfaceHover: '#242426', border: '#2C2C2E', text: '#FFFFFF', textMuted: '#8E8E93' } },
  { id: 'obsidian', name: 'Obsidian', mode: 'dark', accent: '#22D3EE', tokens: { bg: '#000000', surface: '#101012', surfaceHover: '#1A1A1D', border: '#232326', text: '#FAFAFA', textMuted: '#8A8A90' } },
  { id: 'charcoal', name: 'Charcoal', mode: 'dark', accent: '#F59E0B', tokens: { bg: '#18181B', surface: '#232327', surfaceHover: '#2E2E33', border: '#3A3A40', text: '#FAFAFA', textMuted: '#A1A1AA' } },
  { id: 'navy', name: 'Navy', mode: 'dark', accent: '#3B82F6', tokens: { bg: '#0A1120', surface: '#131C2E', surfaceHover: '#1B2739', border: '#26344A', text: '#EAF0F9', textMuted: '#8798B0' } },
  { id: 'forest', name: 'Forest', mode: 'dark', accent: '#10B981', tokens: { bg: '#0A1410', surface: '#12201A', surfaceHover: '#1A2C23', border: '#263B30', text: '#EAF5EE', textMuted: '#85A395' } },
  { id: 'plum', name: 'Plum', mode: 'dark', accent: '#A855F7', tokens: { bg: '#140B1A', surface: '#201428', surfaceHover: '#2C1C36', border: '#3A2848', text: '#F4ECF9', textMuted: '#A18BB0' } },
  { id: 'sunset', name: 'Sunset', mode: 'dark', accent: '#F5124A', tokens: { bg: '#1A0E14', surface: '#2A1620', surfaceHover: '#38202C', border: '#4A2A38', text: '#FFF5F0', textMuted: '#C99AA8' } },
  { id: 'ocean', name: 'Ocean', mode: 'dark', accent: '#06B6D4', tokens: { bg: '#07161A', surface: '#0F2329', surfaceHover: '#163038', border: '#1F4049', text: '#E6F6FA', textMuted: '#7FA9B2' } },
  { id: 'espresso', name: 'Espresso', mode: 'dark', accent: '#D97706', tokens: { bg: '#160F0B', surface: '#241811', surfaceHover: '#32241A', border: '#433327', text: '#F7EFE8', textMuted: '#B39B88' } },
  { id: 'graphite', name: 'Graphite', mode: 'dark', accent: '#8B5CF6', tokens: { bg: '#0F1417', surface: '#191F24', surfaceHover: '#232A31', border: '#2F3841', text: '#EEF2F5', textMuted: '#8A96A0' } },
]

const PALETTE_MAP = new Map(PALETTES.map((p) => [p.id, p]))

export function getPalette(id: string): Palette {
  return PALETTE_MAP.get(id) ?? PALETTES[0]
}

export const buttonStyleSchema = z.enum(['rounded', 'pill', 'square'])
export type ButtonStyle = z.infer<typeof buttonStyleSchema>

export const fontFamilySchema = z.enum(['Inter', 'Sans', 'Serif', 'Mono', 'Rounded'])
export type FontFamily = z.infer<typeof fontFamilySchema>

// Preset is a palette id. Kept as a string (validated against palettes at use).
export const themePresetSchema = z.string().default('midnight')
export type ThemePreset = string

export const themeConfigSchema = z.object({
  preset: themePresetSchema,
  accentColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{6})$/, 'Must be a 6-digit hex color')
    .default('#F5124A'),
  fontFamily: fontFamilySchema.default('Inter'),
  buttonStyle: buttonStyleSchema.default('rounded'),
  hideBranding: z.boolean().optional().default(false),
})
export type ThemeConfig = z.infer<typeof themeConfigSchema>

export const seoConfigSchema = z.object({
  title: z.string().max(120).optional(),
  description: z.string().max(300).optional(),
  ogImageUrl: z.string().url().optional(),
})
export type SeoConfig = z.infer<typeof seoConfigSchema>

export const DEFAULT_THEME: ThemeConfig = {
  preset: 'midnight',
  accentColor: '#F5124A',
  fontFamily: 'Inter',
  buttonStyle: 'rounded',
  hideBranding: false,
}

const FONT_STACKS: Record<FontFamily, string> = {
  Inter: 'var(--font-inter), ui-sans-serif, system-ui, -apple-system, sans-serif',
  Sans: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
  Serif: 'Georgia, Cambria, "Times New Roman", serif',
  Mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  Rounded: '"SF Pro Rounded", "Nunito", "Segoe UI", ui-rounded, sans-serif',
}

/**
 * Build the inline CSS-variable style object for a page wrapper from a theme.
 * The public page reads these variables — never conditional Tailwind classes.
 */
export function themeToCssVars(theme: ThemeConfig): Record<string, string> {
  const tokens = getPalette(theme.preset).tokens
  const radius =
    theme.buttonStyle === 'pill' ? '9999px' : theme.buttonStyle === 'square' ? '8px' : '14px'
  return {
    '--bg': tokens.bg,
    '--surface': tokens.surface,
    '--surface-hover': tokens.surfaceHover,
    '--border': tokens.border,
    '--text': tokens.text,
    '--text-muted': tokens.textMuted,
    '--accent': theme.accentColor,
    '--radius-card': '16px',
    '--radius-pill': '9999px',
    '--radius-btn': radius,
    '--font-page': FONT_STACKS[theme.fontFamily] ?? FONT_STACKS.Inter,
  }
}
