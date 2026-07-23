'use client'

import { useActionState } from 'react'
import { createSite, type CreateSiteState } from '@/app/dashboard/actions'
import { Button } from '@/components/ui/button'

export function CreateSiteForm({ canCreate, appHost }: { canCreate: boolean; appHost: string }) {
  const [state, action, pending] = useActionState<CreateSiteState, FormData>(createSite, undefined)

  if (!canCreate) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm text-neutral-500">
        You&apos;re on the free plan (1 site). Upgrade to Pro to create more.
      </div>
    )
  }

  return (
    <form action={action} className="rounded-xl border border-neutral-200 bg-white p-4">
      <p className="text-sm font-medium">Create a new site</p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <div className="flex flex-1 items-center rounded-lg border border-neutral-300 pl-3 focus-within:ring-2 focus-within:ring-neutral-400">
          <span className="whitespace-nowrap text-sm text-neutral-400">{appHost}/</span>
          <input
            name="slug"
            required
            minLength={3}
            maxLength={30}
            pattern="[a-z0-9-]+"
            placeholder="your-name"
            autoCapitalize="none"
            autoComplete="off"
            className="h-10 min-w-0 flex-1 bg-transparent px-1 text-sm focus:outline-none"
          />
        </div>
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? 'Creating…' : 'Create site'}
        </Button>
      </div>
      {state?.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
    </form>
  )
}
