import { getExampleNav } from '@/lib/examples'
import ExampleNavBar from './ExampleNavBar'

/**
 * Back-to-gallery and next-example links, on the example pages only.
 *
 * "Next" is the point of it. Without it, seeing all five means going back to the
 * gallery between each one — ten navigations instead of five. It wraps at the end
 * so paging never dead-ends.
 *
 * Whether to render anything is decided here, on the server, from the slug alone.
 * A site carries `isExample`, so the flag on the row *is* the proof this is an
 * example page — no query parameter needed, which means the public pages stay
 * statically rendered, and someone landing on an example from a search result gets
 * the nav too.
 *
 * Deciding on the server also means a real customer's page never reaches the client
 * component below, so it ships no JavaScript for a bar it will never show.
 */
export default async function ExampleNav({ slug }: { slug: string }) {
  const nav = await getExampleNav(slug)
  if (!nav) return null

  return (
    <ExampleNavBar
      currentSlug={nav.currentSlug}
      nextSlug={nav.nextSlug}
      nextName={nav.nextName}
    />
  )
}
