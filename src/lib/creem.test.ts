import { describe, it, expect } from 'vitest'
import { createHmac } from 'node:crypto'
import { verifyCreemSignature } from './creem'

// Must match CREEM_WEBHOOK_SECRET in vitest.config.ts.
const SECRET = 'whsec_test_secret'
const sign = (body: string) => createHmac('sha256', SECRET).update(body).digest('hex')

describe('verifyCreemSignature', () => {
  const body = JSON.stringify({ eventType: 'subscription.active', object: { metadata: {} } })

  it('accepts a correct HMAC signature', () => {
    expect(verifyCreemSignature(body, sign(body))).toBe(true)
  })

  it('rejects a tampered body', () => {
    expect(verifyCreemSignature(body + ' ', sign(body))).toBe(false)
  })

  it('rejects a signature made with the wrong secret', () => {
    const forged = createHmac('sha256', 'wrong-secret').update(body).digest('hex')
    expect(verifyCreemSignature(body, forged)).toBe(false)
  })

  it('rejects malformed / short signatures without throwing', () => {
    expect(verifyCreemSignature(body, 'deadbeef')).toBe(false)
    expect(verifyCreemSignature(body, 'not-hex-!!')).toBe(false)
  })

  it('rejects a null signature', () => {
    expect(verifyCreemSignature(body, null)).toBe(false)
  })
})
