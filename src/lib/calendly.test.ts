import { describe, it, expect } from 'vitest'
import { parseCalendly } from './calendly'

describe('parseCalendly', () => {
  it('accepts a calendly link and hides the gdpr banner', () => {
    expect(parseCalendly('https://calendly.com/jane/30min')).toBe(
      'https://calendly.com/jane/30min?hide_gdpr_banner=1',
    )
  })

  it('preserves existing query with &', () => {
    expect(parseCalendly('https://www.calendly.com/team/demo?month=2026-07')).toBe(
      'https://www.calendly.com/team/demo?month=2026-07&hide_gdpr_banner=1',
    )
  })

  it('upgrades http to https', () => {
    expect(parseCalendly('http://calendly.com/x')).toBe('https://calendly.com/x?hide_gdpr_banner=1')
  })

  it('rejects host/subdomain spoofing and junk', () => {
    expect(parseCalendly('https://evil.com/calendly.com')).toBeNull()
    expect(parseCalendly('https://calendly.com.evil.com/x')).toBeNull()
    expect(parseCalendly('https://notcalendly.com/x')).toBeNull()
    expect(parseCalendly('')).toBeNull()
  })
})
