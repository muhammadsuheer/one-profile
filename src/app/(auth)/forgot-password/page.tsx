import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

export const metadata = { title: 'Forgot password' }

export default async function ForgotPasswordPage() {
  const user = await getCurrentUser()
  if (user) redirect('/dashboard')

  return (
    <div>
      <div className="mb-7 text-center lg:text-left">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Forgot password?</h1>
        <p className="mt-1.5 text-sm text-neutral-500">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  )
}
