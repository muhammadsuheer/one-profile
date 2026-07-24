'use client'

import { useActionState, useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { deleteAccount, type AccountState } from '@/app/dashboard/account/actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function DeleteAccountSection({ hasPassword }: { hasPassword: boolean }) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState<AccountState, FormData>(deleteAccount, undefined)

  // On success the user row is gone — clear the session and leave.
  useEffect(() => {
    if (state?.ok) void signOut({ callbackUrl: '/' })
  }, [state?.ok])

  return (
    <div className="space-y-4 rounded-2xl border border-red-200 bg-red-50/40 p-5">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-red-500">Danger zone</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Deleting your account permanently removes all your sites, blocks, and analytics. This
          cannot be undone.
        </p>
      </div>

      {!open ? (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Delete account
        </Button>
      ) : (
        <form action={action} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="confirm">
              {hasPassword ? 'Enter your password to confirm' : 'Type DELETE to confirm'}
            </Label>
            <Input
              id="confirm"
              name="confirm"
              type={hasPassword ? 'password' : 'text'}
              autoComplete="off"
              placeholder={hasPassword ? '••••••••' : 'DELETE'}
              required
            />
          </div>
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          {state?.ok && <p className="text-sm text-neutral-600">Signing you out…</p>}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={pending || state?.ok}
              className="inline-flex h-9 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60"
            >
              {pending ? 'Deleting…' : 'Permanently delete'}
            </button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={pending || state?.ok}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
