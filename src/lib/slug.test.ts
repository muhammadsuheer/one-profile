import { describe, it, expect } from 'vitest'
import { slugSchema, normalizeSlug, RESERVED_SLUGS } from './slug'

describe('normalizeSlug', () => {
  it('lowercases and trims', () => {
    expect(normalizeSlug('  MyName  ')).toBe('myname')
  })
})

describe('slugSchema', () => {
  it('accepts valid slugs', () => {
    expect(slugSchema.safeParse('ava').success).toBe(true)
    expect(slugSchema.safeParse('my-cool-page').success).toBe(true)
    expect(slugSchema.safeParse('user123').success).toBe(true)
  })

  it('rejects too short / too long', () => {
    expect(slugSchema.safeParse('ab').success).toBe(false)
    expect(slugSchema.safeParse('a'.repeat(31)).success).toBe(false)
  })

  it('rejects invalid characters and hyphen edges', () => {
    expect(slugSchema.safeParse('Has Space').success).toBe(false)
    expect(slugSchema.safeParse('UPPER').success).toBe(false)
    expect(slugSchema.safeParse('-lead').success).toBe(false)
    expect(slugSchema.safeParse('trail-').success).toBe(false)
    expect(slugSchema.safeParse('double--hyphen').success).toBe(false)
  })

  it('rejects reserved slugs (including new routes)', () => {
    for (const s of ['dashboard', 'api', 'login', 'forgot-password', 'reset-password', 'onboarding']) {
      expect(slugSchema.safeParse(s).success, s).toBe(false)
      expect(RESERVED_SLUGS.has(s), s).toBe(true)
    }
  })
})
