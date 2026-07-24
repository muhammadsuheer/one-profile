import { describe, it, expect } from 'vitest'
import { normalizeSocialUrl, isSocialLink } from './social'

describe('normalizeSocialUrl', () => {
  it('turns a handle into a canonical URL', () => {
    expect(normalizeSocialUrl('instagram', 'ava')).toBe('https://instagram.com/ava')
    expect(normalizeSocialUrl('instagram', '@ava')).toBe('https://instagram.com/ava')
    expect(normalizeSocialUrl('tiktok', 'ava')).toBe('https://tiktok.com/@ava')
    expect(normalizeSocialUrl('github', 'ava')).toBe('https://github.com/ava')
    expect(normalizeSocialUrl('telegram', 'ava')).toBe('https://t.me/ava')
  })

  it('passes through full URLs unchanged', () => {
    expect(normalizeSocialUrl('instagram', 'https://instagram.com/ava')).toBe(
      'https://instagram.com/ava',
    )
  })

  it('adds https to a bare domain', () => {
    expect(normalizeSocialUrl('website', 'example.com/page')).toBe('https://example.com/page')
  })

  it('makes a mailto for email', () => {
    expect(normalizeSocialUrl('email', 'a@b.com')).toBe('mailto:a@b.com')
    expect(normalizeSocialUrl('email', 'not-an-email')).toBe('')
  })

  it('strips non-digits for whatsapp', () => {
    expect(normalizeSocialUrl('whatsapp', '+1 (555) 123-4567')).toBe('https://wa.me/15551234567')
  })

  it('returns empty string for empty input', () => {
    expect(normalizeSocialUrl('instagram', '   ')).toBe('')
  })
})

describe('isSocialLink', () => {
  it('accepts http(s), mailto and tel', () => {
    expect(isSocialLink('https://x.com/a')).toBe(true)
    expect(isSocialLink('mailto:a@b.com')).toBe(true)
    expect(isSocialLink('tel:+1555')).toBe(true)
  })
  it('rejects empty or relative values', () => {
    expect(isSocialLink('')).toBe(false)
    expect(isSocialLink('/relative')).toBe(false)
  })
})
