import { requireUser } from '@/lib/auth/session'
import { AccountClient } from '@/components/dashboard/AccountClient'

export const metadata = { title: 'Account' }

export default async function AccountPage() {
  const user = await requireUser()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
        <p className="mt-1 text-sm text-neutral-500">Manage your profile and password.</p>
      </div>

      <AccountClient name={user.name ?? ''} email={user.email} hasPassword={!!user.passwordHash} />
    </div>
  )
}
