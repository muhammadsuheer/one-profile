import { z } from 'zod'

export const themePresetSchema = z.enum(['midnight', 'light', 'sunset'])
export type ThemePreset = z.infer<typeof themePresetSchema>

export const buttonStyleSchema = z.enum(['rounded', 'pill', 'square'])
export type ButtonStyle = z.infer<typeof buttonStyleSchema>

export const fontFamilySchema = z.enum(['Inter', 'Sans', 'Serif', 'Mono', 'Rounded'])
export type FontFamily = z.infer<typeof fontFamilySchema>

export const themeConfigSchema = z.object({
  preset: themePresetSchema.default('midnight'),
  accentColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{6})$/, 'Must be a 6-digit hex color')
    .default('#F5124A'),
  fontFamily: fontFamilySchema.default('Inter'),
  buttonStyle: buttonStyleSchema.default('rounded'),
  // Pro-only: remove the "Made with OnePage" footer. Enforced server-side.
  hideBranding: z.boolean().optional().default(false),
})
export type ThemeConfig = z.infer<typeof themeConfigSchema>

export const seoConfigSchema = z.object({
  title: z.string().max(120).optional(),
  description: z.string().max(300).optional(),
  ogImageUrl: z.string().url().optional(),
})
export type SeoConfig = z.infer<typeof seoConfigSchema>

/** CSS custom-property values for a preset (applied on the page wrapper, §7). */
export interface ThemeTokens {
  bg: string
  surface: string
  surfaceHover: string
  border: string
  text: string
  textMuted: string
}

export const THEME_PRESETS: Record<ThemePreset, ThemeTokens> = {
  midnight: {
    bg: '#0A0A0B',
    surface: '#1A1A1C',
    surfaceHover: '#242426',
    border: '#2C2C2E',
    text: '#FFFFFF',
    textMuted: '#8E8E93',
  },
  light: {
    bg: '#FFFFFF',
    surface: '#F5F5F7',
    surfaceHover: '#ECECEE',
    border: '#E2E2E5',
    text: '#0A0A0B',
    textMuted: '#6E6E73',
  },
  sunset: {
    bg: '#1A0E14',
    surface: '#2A1620',
    surfaceHover: '#38202C',
    border: '#4A2A38',
    text: '#FFF5F0',
    textMuted: '#C99AA8',
  },
}

export const PRESET_LABELS: Record<ThemePreset, string> = {
  midnight: 'Midnight',
  light: 'Light',
  sunset: 'Sunset',
}

export const DEFAULT_THEME: ThemeConfig = {
  preset: 'midnight',
  accentColor: '#F5124A',
  fontFamily: 'Inter',
  buttonStyle: 'rounded',
  hideBranding: false,
}

const FONT_STACKS: Record<FontFamily, string> = {
  Inter: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
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
  const tokens = THEME_PRESETS[theme.preset] ?? THEME_PRESETS.midnight
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
