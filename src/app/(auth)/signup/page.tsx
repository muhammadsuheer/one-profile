import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { googleAuthEnabled } from '@/env'
import { AuthForm } from '@/components/auth/auth-form'

export const metadata = { title: 'Sign up' }

export default async function SignupPage() {
  const user = await getCurrentUser()
  if (user) redirect('/dashboard')

  return (
    <div>
      <div className="mb-7 text-center lg:text-left">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Create your page</h1>
        <p className="mt-1.5 text-sm text-neutral-500">Start building your link-in-bio in minutes.</p>
      </div>
      <AuthForm mode="signup" googleEnabled={googleAuthEnabled} />
    </div>
  )
}
