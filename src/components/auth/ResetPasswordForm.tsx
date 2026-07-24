'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { resetPassword, type ResetState } from '@/app/(auth)/reset-password/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState<ResetState, FormData>(resetPassword, undefined)

  if (state?.ok) {
    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Your password has been reset. You can now log in with your new password.
        </div>
        <Link href="/login" className="block">
          <Button variant="primary" size="lg" className="w-full">
            Go to log in
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
          minLength={8}
        />
      </div>
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}
      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
        {pending ? 'Saving…' : 'Reset password'}
      </Button>
      <p className="text-center text-sm text-neutral-500">
        <Link href="/login" className="font-semibold text-neutral-900 underline-offset-4 hover:underline">
          Back to log in
        </Link>
      </p>
    </form>
  )
}
