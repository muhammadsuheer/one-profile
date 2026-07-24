import { createHmac, timingSafeEqual } from 'node:crypto'
import { env } from '@/env'

/** True when Creem billing is configured. */
export function creemEnabled(): boolean {
  return env.CREEM_API_KEY.length > 0 && env.CREEM_PRODUCT_ID.length > 0
}

/** Test keys (creem_test_…) hit the sandbox API; live keys hit production. */
function baseUrl(): string {
  return env.CREEM_API_KEY.startsWith('creem_test_')
    ? 'https://test-api.creem.io/v1'
    : 'https://api.creem.io/v1'
}

async function creemPost(path: string, body: unknown): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`${baseUrl()}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': env.CREEM_API_KEY },
      body: JSON.stringify(body),
      cache: 'no-store',
    })
    if (!res.ok) return null
    return (await res.json()) as Record<string, unknown>
  } catch {
    return null
  }
}

/** Create a hosted checkout for the Pro product. Returns the checkout URL. */
export async function createCheckout(input: {
  email: string
  userId: string
  successUrl: string
}): Promise<string | null> {
  if (!creemEnabled()) return null
  const json = await creemPost('/checkouts', {
    product_id: env.CREEM_PRODUCT_ID,
    success_url: input.successUrl,
    customer: { email: input.email },
    metadata: { userId: input.userId },
  })
  const url = json?.checkout_url
  return typeof url === 'string' ? url : null
}

/** Self-service billing portal URL for an existing customer. */
export async function createBillingPortal(customerId: string): Promise<string | null> {
  if (!creemEnabled()) return null
  const json = await creemPost('/customers/billing', { customer_id: customerId })
  const url = json?.billing_portal_url
  return typeof url === 'string' ? url : null
}

/** Verify a Creem webhook: HMAC-SHA256 (hex) of the raw body vs the header. */
export function verifyCreemSignature(rawBody: string, signature: string | null): boolean {
  if (!signature || !env.CREEM_WEBHOOK_SECRET) return false
  const expected = createHmac('sha256', env.CREEM_WEBHOOK_SECRET).update(rawBody).digest('hex')
  try {
    const a = Buffer.from(expected, 'hex')
    const b = Buffer.from(signature, 'hex')
    return a.length === b.length && timingSafeEqual(a, b)
  } catch {
    return false
  }
}
