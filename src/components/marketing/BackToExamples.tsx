'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

/**
 * A way back to the examples gallery, for visitors who arrived from it.
 *
 * It has to be conditional. This renders on `/[slug]`, which is every customer's
 * public page — a "back to examples" chip on a real creator's page would be
 * nonsense. The gallery therefore links out with `?from=examples`, and only that
 * marker brings the chip along.
 *
 * Reading the parameter on the client rather than from the page's `searchParams`
 * is what keeps the public pages on ISR. A server-side read would opt every
 * customer page out of static rendering to serve a chip that almost none of them
 * will ever show. The parent wraps this in Suspense for the same reason.
 *
 * Styled against the page's own theme variables, so it sits inside whichever
 * palette the page is using instead of importing the marketing site's colours.
 */
export default function BackToExamples() {
  const params = useSearchParams()
  if (params.get('from') !== 'examples') return null

  return (
    <div className="fixed left-4 top-4 z-50">
      <Link
        href="/examples"
        className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/90 px-3.5 py-2 text-sm font-medium text-[var(--text)] shadow-lg backdrop-blur transition-colors hover:bg-[var(--surface-hover)]"
      >
        <ArrowLeft className="h-4 w-4" />
        All examples
      </Link>
    </div>
  )
}
