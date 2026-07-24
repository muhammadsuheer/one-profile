import Link from 'next/link'
import { requireUser } from '@/lib/auth/session'
import { signOut } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/dashboard" className="text-[15px] font-semibold tracking-tight">
            OnePage
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/dashboard/account"
              className="hidden font-medium text-neutral-500 hover:text-neutral-900 sm:inline"
            >
              Account
            </Link>
            <Link
              href="/dashboard/billing"
              className="hidden font-medium text-neutral-500 hover:text-neutral-900 sm:inline"
            >
              Billing
            </Link>
            <span className="hidden max-w-[160px] truncate text-neutral-400 sm:inline">
              {user.email}
            </span>
            <form
              action={async () => {
                'use server'
                await signOut({ redirectTo: '/login' })
              }}
            >
              <Button variant="outline" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  )
}
