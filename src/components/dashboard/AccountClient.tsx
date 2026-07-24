'use client'

import { useActionState } from 'react'
import { updateName, changePassword, type AccountState } from '@/app/dashboard/account/actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { DeleteAccountSection } from '@/components/dashboard/DeleteAccountSection'

function Status({ state }: { state: AccountState }) {
  if (state?.error) return <p className="text-sm text-red-600">{state.error}</p>
  if (state?.ok) return <p className="text-sm text-green-600">{state.message}</p>
  return null
}

export function AccountClient({
  name,
  email,
  hasPassword,
}: {
  name: string
  email: string
  hasPassword: boolean
}) {
  const [nameState, nameAction, namePending] = useActionState<AccountState, FormData>(
    updateName,
    undefined,
  )
  const [pwState, pwAction, pwPending] = useActionState<AccountState, FormData>(
    changePassword,
    undefined,
  )

  return (
    <div className="max-w-xl space-y-6">
      <form action={nameAction} className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Profile</h2>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={email} disabled />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={name} maxLength={80} required />
        </div>
        <Status state={nameState} />
        <Button type="submit" variant="primary" disabled={namePending}>
          {namePending ? 'Saving…' : 'Save'}
        </Button>
      </form>

      <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Password</h2>
        {hasPassword ? (
          <form action={pwAction} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" name="current" type="password" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="next">New password</Label>
              <Input id="next" name="next" type="password" minLength={8} required />
            </div>
            <Status state={pwState} />
            <Button type="submit" variant="primary" disabled={pwPending}>
              {pwPending ? 'Saving…' : 'Change password'}
            </Button>
          </form>
        ) : (
          <p className="text-sm text-neutral-500">
            Your account uses Google sign-in, so there&apos;s no password to manage.
          </p>
        )}
      </div>

      <DeleteAccountSection hasPassword={hasPassword} />
    </div>
  )
}
