import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getExampleBySlug, getNextExample } from '@/lib/examples'

/**
 * A small bar on an example page: back to the gallery, and straight on to the next
 * example.
 *
 * "Next" is the point of it. Without it, comparing two examples means going back
 * to the gallery and picking again, so a visitor who wants to see all five makes
 * ten navigations instead of five. It wraps at the end rather than stopping, so
 * paging through never dead-ends.
 *
 * Whether to show anything is decided by the slug, not by a query parameter. This
 * renders on `/[slug]`, which is every customer's public page — but the five
 * example slugs are owned by the example accounts, so a slug being in that list
 * *is* the proof that this is an example page. An earlier version gated on
 * `?from=examples` instead, which needed a client component and a Suspense
 * boundary to keep the public pages static, and still showed nothing to someone
 * who arrived from a search result on an example page.
 *
 * Being a server component means no client JavaScript and no effect on static
 * rendering.
 *
 * The back link carries `?p=<slug>` so the gallery reopens on the example that was
 * just being viewed rather than resetting to the first one.
 *
 * Colours come from the page's own theme variables, so this sits inside whichever
 * palette the example uses instead of importing the marketing site's.
 */
export default function ExampleNav({ slug }: { slug: string }) {
  const current = getExampleBySlug(slug)
  if (!current) return null

  const next = getNextExample(slug)

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 p-3 sm:p-4">
      <div className="pointer-events-auto mx-auto flex max-w-[440px] items-center justify-between gap-2">
        <Link
          href={`/examples?p=${current.slug}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)]/90 px-3.5 py-2 text-sm font-medium text-[var(--text)] shadow-lg backdrop-blur transition-colors hover:bg-[var(--surface-hover)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Examples
        </Link>

        {next && (
          <Link
            href={`/${next.slug}`}
            className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)]/90 px-3.5 py-2 text-sm font-medium text-[var(--text)] shadow-lg backdrop-blur transition-colors hover:bg-[var(--surface-hover)]"
          >
            <span className="truncate">
              Next: <span className="font-semibold">{next.name.split(' ')[0]}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
        )}
      </div>
    </div>
  )
}
