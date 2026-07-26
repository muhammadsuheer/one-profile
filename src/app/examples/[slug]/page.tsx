import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ExamplesView from '@/components/marketing/ExamplesView'
import { EXAMPLE_PROFILES, getExampleBySlug } from '@/lib/examples'

type Params = { params: Promise<{ slug: string }> }

/** The five are known at build time, so each is a static page. */
export function generateStaticParams() {
  return EXAMPLE_PROFILES.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const example = getExampleBySlug(slug)
  if (!example) return { title: 'Examples' }

  return {
    title: `${example.name} — ${example.field} example`,
    description: `${example.summary} See how a ${example.field.toLowerCase()} uses FolioPage.`,
  }
}

/**
 * The gallery, opened on one particular example.
 *
 * This exists so returning from an example page lands on the one that was being
 * viewed instead of resetting to the first. The alternative was a query parameter,
 * which worked but left the URL reading like a setting and needed the selection
 * resolved on the client — meaning a Suspense boundary and a moment of the wrong
 * example on screen. A segment is resolved on the server, so the right one is in
 * the first paint, and it earns a real title and description of its own.
 */
export default async function ExampleSlugPage({ params }: Params) {
  const { slug } = await params
  if (!getExampleBySlug(slug)) notFound()

  return <ExamplesView activeSlug={slug} />
}
