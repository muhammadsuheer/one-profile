'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { requestPasswordReset, type ForgotState } from '@/app/(auth)/forgot-password/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState<ForgotState, FormData>(
    requestPasswordReset,
    undefined,
  )

  if (state?.ok) {
    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          If an account exists for that email, we&apos;ve sent a reset link. Check your inbox (and
          spam).
        </div>
        <p className="text-center text-sm text-neutral-500">
          <Link href="/login" className="font-semibold text-neutral-900 underline-offset-4 hover:underline">
            Back to log in
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </div>
        {state?.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
        )}
        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
          {pending ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>
      <p className="text-center text-sm text-neutral-500">
        Remembered it?{' '}
        <Link href="/login" className="font-semibold text-neutral-900 underline-offset-4 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
