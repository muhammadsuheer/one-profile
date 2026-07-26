'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

/**
 * The visible half of the example-page nav.
 *
 * It's a client component for one reason: this must not appear inside the gallery's
 * preview. The gallery embeds the real page in an iframe, so anything the page
 * renders shows up in the preview too — and a "Next: Priya" button floating over
 * Theo's avatar inside a preview of Theo's page is nonsense.
 *
 * There's no way to know you're embedded on the server, so the check is
 * `window.self === window.top` after mount. Rendering nothing until then is
 * deliberate rather than incidental: it means the bar never appears in the
 * preview even for a frame, which a server-render-then-hide approach couldn't
 * promise. On the real page it arrives a beat after load, which is fine for a
 * floating affordance.
 *
 * Sticky and in the flow, not fixed. Fixed took no space, so it sat on top of the
 * profile block at the top of the page — a button over someone's face.  In flow it
 * pushes the page down by its own height and still stays put while scrolling.
 *
 * Props are plain strings rather than the profile objects they come from. An
 * ExampleProfile carries its Lucide `icon`, which is a component, and React can't
 * serialise that across the server/client boundary — passing the objects threw
 * "Only plain objects can be passed to Client Components" and took the whole page
 * down with a 500. Only these three fields are needed here anyway.
 */
export default function ExampleNavBar({
  currentSlug,
  nextSlug,
  nextName,
}: {
  currentSlug: string
  nextSlug: string
  nextName: string
}) {
  const [standalone, setStandalone] = useState(false)

  useEffect(() => {
    setStandalone(window.self === window.top)
  }, [])

  if (!standalone) return null

  return (
    <div className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur">
      <div className="mx-auto flex max-w-[440px] items-center justify-between gap-2 px-3 py-2.5 sm:px-4">
        <Link
          href={`/examples/${currentSlug}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface-hover)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Examples
        </Link>

        <Link
          href={`/${nextSlug}`}
          className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface-hover)]"
        >
          <span className="truncate">
            Next: <span className="font-semibold">{nextName}</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0" />
        </Link>
      </div>
    </div>
  )
}
