import { describe, it, expect } from 'vitest'
import {
  parseThemeConfig,
  parseSeoConfig,
  themeToCssVars,
  getPalette,
  DEFAULT_THEME,
} from './theme'

describe('parseThemeConfig', () => {
  it('falls back to the default on malformed data (never throws)', () => {
    expect(parseThemeConfig(null)).toEqual(DEFAULT_THEME)
    expect(parseThemeConfig('nonsense')).toEqual(DEFAULT_THEME)
    expect(parseThemeConfig({ accentColor: 'not-a-hex' })).toEqual(DEFAULT_THEME)
    expect(parseThemeConfig(42)).toEqual(DEFAULT_THEME)
    expect(parseThemeConfig([])).toEqual(DEFAULT_THEME)
  })

  it('accepts a valid config', () => {
    const cfg = parseThemeConfig({
      preset: 'sky',
      accentColor: '#123456',
      fontFamily: 'Serif',
      buttonStyle: 'pill',
      hideBranding: true,
    })
    expect(cfg.preset).toBe('sky')
    expect(cfg.accentColor).toBe('#123456')
    expect(cfg.buttonStyle).toBe('pill')
  })
})

describe('parseSeoConfig', () => {
  it('returns null for absent or bad data', () => {
    expect(parseSeoConfig(null)).toBeNull()
    expect(parseSeoConfig(undefined)).toBeNull()
    expect(parseSeoConfig({ ogImageUrl: 'not-a-url' })).toBeNull()
  })

  it('parses valid seo', () => {
    expect(parseSeoConfig({ title: 'Hi', description: 'yo' })).toMatchObject({ title: 'Hi' })
  })
})

describe('themeToCssVars', () => {
  it('maps button shape to the button radius', () => {
    expect(themeToCssVars({ ...DEFAULT_THEME, buttonStyle: 'pill' })['--radius-btn']).toBe('9999px')
    expect(themeToCssVars({ ...DEFAULT_THEME, buttonStyle: 'square' })['--radius-btn']).toBe('8px')
    expect(themeToCssVars({ ...DEFAULT_THEME, buttonStyle: 'rounded' })['--radius-btn']).toBe('14px')
  })

  it('always includes the core variables', () => {
    const vars = themeToCssVars(DEFAULT_THEME)
    for (const key of ['--bg', '--surface', '--text', '--accent', '--font-page']) {
      expect(vars[key]).toBeTruthy()
    }
  })
})

describe('getPalette', () => {
  it('returns a known palette and falls back for unknown ids', () => {
    expect(getPalette('midnight').id).toBe('midnight')
    expect(getPalette('does-not-exist')).toBeTruthy()
  })
})
