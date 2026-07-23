import Link from 'next/link'
import { BrandPanel } from '@/components/auth/BrandPanel'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <BrandPanel />
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-5 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 block text-center text-lg font-semibold tracking-tight lg:hidden"
          >
            OnePage
          </Link>
          {children}
        </div>
      </div>
    </div>
  )
}
