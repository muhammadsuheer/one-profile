import { describe, it, expect } from 'vitest'
import { detectDevice } from './clicks'

describe('detectDevice', () => {
  it('classifies iPhone / Android phones as mobile', () => {
    expect(detectDevice('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Mobile/15E148')).toBe('mobile')
    expect(detectDevice('Mozilla/5.0 (Linux; Android 14; Pixel 8) Mobile Safari')).toBe('mobile')
  })

  it('classifies iPad / Android tablets as tablet', () => {
    expect(detectDevice('Mozilla/5.0 (iPad; CPU OS 17_0) Safari')).toBe('tablet')
    // Android without "mobile" is a tablet.
    expect(detectDevice('Mozilla/5.0 (Linux; Android 14; SM-X200) Safari')).toBe('tablet')
  })

  it('classifies desktop browsers as desktop', () => {
    expect(detectDevice('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120')).toBe('desktop')
    expect(detectDevice('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) Safari')).toBe('desktop')
  })

  it('defaults to desktop on empty / unknown UA', () => {
    expect(detectDevice('')).toBe('desktop')
    expect(detectDevice('curl/8.0')).toBe('desktop')
  })
})
