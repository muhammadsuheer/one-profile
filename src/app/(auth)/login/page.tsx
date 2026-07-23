import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { googleAuthEnabled } from '@/env'
import { AuthForm } from '@/components/auth/auth-form'

export const metadata = { title: 'Log in' }

export default async function LoginPage() {
  const user = await getCurrentUser()
  if (user) redirect('/dashboard')

  return (
    <div>
      <div className="mb-7 text-center lg:text-left">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Welcome back</h1>
        <p className="mt-1.5 text-sm text-neutral-500">Log in to manage your page.</p>
      </div>
      <AuthForm mode="login" googleEnabled={googleAuthEnabled} />
    </div>
  )
}
