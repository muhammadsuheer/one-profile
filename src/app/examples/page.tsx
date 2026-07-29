import type { Metadata } from 'next'
import ExamplesView from '@/components/marketing/ExamplesView'
import { getExampleProfiles } from '@/lib/examples'

export const metadata: Metadata = {
  title: 'Examples',
  description:
    'Real FolioPage pages across five fields — musician, coach, photographer, podcaster, founder. See what yours could look like.',
}

/** The gallery is database-backed now, so it's revalidated rather than baked in. */
export const revalidate = 300

/**
 * The one gallery page. Which example is open is a URL fragment, so this stays a
 * single address rather than one page per example.
 *
 * An unseeded environment yields an empty list rather than an error; ExamplesView
 * renders the empty state.
 */
export default async function ExamplesPage() {
  const profiles = await getExampleProfiles()

  return <ExamplesView profiles={profiles} activeSlug={profiles[0]?.slug ?? ''} />
}
