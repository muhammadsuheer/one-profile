import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-6xl font-bold tracking-tight text-neutral-900">404</p>
      <p className="text-neutral-500">This page could not be found.</p>
      <Link
        href="/"
        className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
      >
        Go home
      </Link>
    </div>
  )
}
