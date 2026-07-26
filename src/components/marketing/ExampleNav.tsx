import { getExampleBySlug, getNextExample } from '@/lib/examples'
import ExampleNavBar from './ExampleNavBar'

/**
 * Back-to-gallery and next-example links, on the five example pages only.
 *
 * "Next" is the point of it. Without it, seeing all five means going back to the
 * gallery between each one — ten navigations instead of five. It wraps at the end
 * so paging never dead-ends.
 *
 * Whether to render anything is decided here, on the server, from the slug alone.
 * The five example slugs are owned by the example accounts, so a slug being in that
 * list *is* the proof this is an example page — no query parameter needed, which
 * means the public pages stay statically rendered, and someone landing on an
 * example from a search result gets the nav too.
 *
 * Deciding on the server also means a real customer's page never reaches the client
 * component below, so it ships no JavaScript for a bar it will never show.
 */
export default function ExampleNav({ slug }: { slug: string }) {
  const current = getExampleBySlug(slug)
  const next = current ? getNextExample(slug) : undefined
  if (!current || !next) return null

  // Plain strings only: an ExampleProfile carries its Lucide icon, which is a
  // component and can't cross the server/client boundary.
  return (
    <ExampleNavBar
      currentSlug={current.slug}
      nextSlug={next.slug}
      nextName={next.name.split(' ')[0]}
    />
  )
}
