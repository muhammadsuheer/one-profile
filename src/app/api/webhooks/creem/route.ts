import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'
import { verifyCreemSignature } from '@/lib/creem'

function asObject(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' ? (v as Record<string, unknown>) : {}
}
function asString(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined
}

const ACTIVATE = new Set(['subscription.active', 'subscription.paid', 'checkout.completed'])
const DEACTIVATE = new Set(['subscription.canceled', 'subscription.expired'])

export async function POST(req: Request) {
  const raw = await req.text()
  if (!verifyCreemSignature(raw, req.headers.get('creem-signature'))) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(raw) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Bad payload' }, { status: 400 })
  }

  const eventType = asString(payload.eventType) ?? asString(payload.type) ?? ''
  const data = asObject(payload.object ?? payload.data)
  const metadata = asObject(data.metadata ?? asObject(data.subscription).metadata)
  const userId = asString(metadata.userId)

  // Only events we can map to a user matter; ack everything else so Creem stops retrying.
  if (!userId) return NextResponse.json({ ok: true })

  const customer = data.customer
  const customerId = asString(customer) ?? asString(asObject(customer).id)
  const subscriptionId = asString(data.id) ?? asString(asObject(data.subscription).id)

  try {
    if (ACTIVATE.has(eventType)) {
      await db
        .update(users)
        .set({
          plan: 'pro',
          ...(customerId ? { creemCustomerId: customerId } : {}),
          ...(subscriptionId ? { creemSubscriptionId: subscriptionId } : {}),
        })
        .where(eq(users.id, userId))
    } else if (DEACTIVATE.has(eventType)) {
      await db.update(users).set({ plan: 'free' }).where(eq(users.id, userId))
    }
  } catch {
    // Ack anyway; Creem retries on non-2xx and we don't want infinite retries on a transient DB blip.
  }

  return NextResponse.json({ ok: true })
}
