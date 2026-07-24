import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

export const metadata = { title: 'Reset password' }

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const user = await getCurrentUser()
  if (user) redirect('/dashboard')

  const { token } = await searchParams

  if (!token) {
    return (
      <div>
        <div className="mb-7 text-center lg:text-left">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Reset password</h1>
          <p className="mt-1.5 text-sm text-neutral-500">This reset link is missing its token.</p>
        </div>
        <Link href="/forgot-password" className="text-sm font-semibold text-neutral-900 underline-offset-4 hover:underline">
          Request a new link
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-7 text-center lg:text-left">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Set a new password</h1>
        <p className="mt-1.5 text-sm text-neutral-500">Choose a password you don&apos;t use elsewhere.</p>
      </div>
      <ResetPasswordForm token={token} />
    </div>
  )
}
