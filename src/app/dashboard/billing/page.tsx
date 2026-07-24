import { requireUser } from '@/lib/auth/session'
import { creemEnabled } from '@/lib/creem'
import { BillingClient } from '@/components/dashboard/BillingClient'

export const metadata = { title: 'Billing' }

const PRO_FEATURES = [
  'Unlimited sites',
  'All blocks — gallery, product, YouTube feed',
  'Custom domain',
  'Full 30-day analytics',
  'Remove OnePage branding',
  'AI copy generation',
]

export default async function BillingPage() {
  const user = await requireUser()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="mt-1 text-sm text-neutral-500">
          You&apos;re on the <span className="font-medium capitalize">{user.plan}</span> plan.
        </p>
      </div>

      <BillingClient
        plan={user.plan}
        configured={creemEnabled()}
        hasCustomer={!!user.creemCustomerId}
        features={PRO_FEATURES}
      />
    </div>
  )
}
