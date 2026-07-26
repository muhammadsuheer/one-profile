import type { Metadata } from 'next'
import ExamplesView from '@/components/marketing/ExamplesView'
import { EXAMPLE_PROFILES } from '@/lib/examples'

export const metadata: Metadata = {
  title: 'Examples',
  description:
    'Real FolioPage pages across five fields — musician, coach, photographer, podcaster, founder. See what yours could look like.',
}

/**
 * The gallery index: opens on the first example.
 *
 * A specific example is a route of its own — `/examples/theo` — rather than a query
 * parameter on this page. Both were built; the segment wins on every count that
 * matters here. The URL reads as a place rather than a setting, the server already
 * knows which example to open so there's no flash of the wrong one and no Suspense
 * boundary needed, and each example gets its own title and description.
 */
export default function ExamplesPage() {
  return <ExamplesView activeSlug={EXAMPLE_PROFILES[0].slug} />
}
