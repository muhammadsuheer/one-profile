'use server'

import { getCurrentUser } from '@/lib/auth/session'
import { env } from '@/env'
import { createCheckout, createBillingPortal, creemEnabled } from '@/lib/creem'
import type { ActionResult } from '@/lib/actions'

export async function startCheckout(): Promise<ActionResult<{ url: string }>> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'You must be signed in.' }
  if (!creemEnabled()) return { ok: false, error: 'Billing isn’t set up yet.' }
  if (user.plan === 'pro') return { ok: false, error: 'You’re already on Pro.' }

  const url = await createCheckout({
    email: user.email,
    userId: user.id,
    successUrl: `${env.NEXT_PUBLIC_APP_URL}/dashboard/billing?upgraded=1`,
  })
  if (!url) return { ok: false, error: 'Couldn’t start checkout. Please try again.' }
  return { ok: true, data: { url } }
}

export async function openBillingPortal(): Promise<ActionResult<{ url: string }>> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'You must be signed in.' }
  if (!user.creemCustomerId) return { ok: false, error: 'No subscription found.' }

  const url = await createBillingPortal(user.creemCustomerId)
  if (!url) return { ok: false, error: 'Couldn’t open the billing portal. Please try again.' }
  return { ok: true, data: { url } }
}
