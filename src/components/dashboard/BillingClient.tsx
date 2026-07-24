'use client'

import { useState, useTransition } from 'react'
import { Loader2, Check, Sparkles, Crown } from 'lucide-react'
import { startCheckout, openBillingPortal } from '@/app/dashboard/billing/actions'
import { Button } from '@/components/ui/button'
import type { ActionResult } from '@/lib/actions'

export function BillingClient({
  plan,
  configured,
  hasCustomer,
  features,
}: {
  plan: 'free' | 'pro'
  configured: boolean
  hasCustomer: boolean
  features: string[]
}) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')

  function go(fn: () => Promise<ActionResult<{ url: string }>>) {
    setError('')
    startTransition(async () => {
      try {
        const res = await fn()
        if (res.ok) window.location.href = res.data.url
        else setError(res.error)
      } catch {
        setError('Something went wrong. Please try again.')
      }
    })
  }

  return (
    <div>
      {plan === 'pro' ? (
        <div className="rounded-2xl border border-[#F5124A]/30 bg-[#F5124A]/[0.04] p-6">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-[#F5124A]" />
            <h2 className="text-lg font-semibold">You&apos;re on Pro</h2>
          </div>
          <p className="mt-1 text-sm text-neutral-500">All Pro features are unlocked. Thank you! 🎉</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-neutral-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#F5124A]" />
                {f}
              </li>
            ))}
          </ul>
          {hasCustomer && (
            <Button
              variant="outline"
              className="mt-5"
              disabled={pending}
              onClick={() => go(openBillingPortal)}
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />} Manage subscription
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Pro</h2>
              <p className="text-sm text-neutral-500">Everything you need to grow.</p>
            </div>
            <p className="text-2xl font-bold">
              $9<span className="text-sm font-normal text-neutral-400">/mo</span>
            </p>
          </div>
          <ul className="mt-4 space-y-2">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-neutral-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#F5124A]" />
                {f}
              </li>
            ))}
          </ul>
          <Button
            variant="primary"
            size="lg"
            className="mt-6 w-full"
            disabled={pending || !configured}
            onClick={() => go(startCheckout)}
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Upgrade to Pro
          </Button>
          {!configured && (
            <p className="mt-2 text-center text-xs text-neutral-400">
              Billing isn&apos;t configured yet — add your CREEM_* keys.
            </p>
          )}
        </div>
      )}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  )
}
