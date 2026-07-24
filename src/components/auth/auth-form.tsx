'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { loginAction, signupAction, googleSignInAction, type AuthState } from '@/app/(auth)/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AuthForm({
  mode,
  googleEnabled,
}: {
  mode: 'login' | 'signup'
  googleEnabled: boolean
}) {
  const action = mode === 'login' ? loginAction : signupAction
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, undefined)

  return (
    <div className="space-y-5">
      {googleEnabled && (
        <>
          <form action={googleSignInAction}>
            <Button variant="outline" size="lg" className="w-full" type="submit">
              Continue with Google
            </Button>
          </form>
          <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-neutral-400">
            <span className="h-px flex-1 bg-neutral-200" />
            or
            <span className="h-px flex-1 bg-neutral-200" />
          </div>
        </>
      )}

      <form action={formAction} className="space-y-4">
        {mode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" autoComplete="name" placeholder="Ada Lovelace" required />
          </div>
        )}
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
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {mode === 'login' && (
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-neutral-500 underline-offset-4 hover:text-neutral-900 hover:underline"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            placeholder="••••••••"
            required
            minLength={8}
          />
        </div>

        {state?.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
        )}

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
          {pending ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-500">
        {mode === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-neutral-900 underline-offset-4 hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-neutral-900 underline-offset-4 hover:underline">
              Log in
            </Link>
          </>
        )}
      </p>
    </div>
  )
}
