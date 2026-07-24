import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { getPublishedSiteBySlug, getSiteOwnerPlan } from '@/lib/sites'
import { parseThemeConfig, themeToCssVars } from '@/lib/theme'
import { renderBlock } from '@/lib/blocks/registry'
import { buildProfileJsonLd } from '@/lib/jsonld'
import { env } from '@/env'

// ISR: pages are cached and revalidated at most every 60s (§8).
export const revalidate = 60

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const data = await getPublishedSiteBySlug(slug)
  if (!data) return { title: 'Page not found' }

  const profileBlock = data.blocks.find((b) => b.type === 'profile')
  const profile = profileBlock?.data.type === 'profile' ? profileBlock.data : null
  const name = profile?.name ?? slug
  const tagline = profile?.tagline

  const title = data.site.seo?.title ?? name
  const description = data.site.seo?.description ?? tagline ?? `${name} — powered by OnePage`

  const base = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
  const canonical = `${base}/${data.site.slug}`

  return {
    metadataBase: new URL(base),
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, type: 'profile', url: canonical },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true },
  }
}

export default async function PublicPage({ params }: Params) {
  const { slug } = await params
  const data = await getPublishedSiteBySlug(slug)
  if (!data) notFound()

  const theme = parseThemeConfig(data.site.theme)
  const plan = await getSiteOwnerPlan(data.site.ownerId)
  // Free always shows branding; Pro can hide it (§9).
  const showBranding = plan === 'free' ? true : !theme.hideBranding
  const style = { ...themeToCssVars(theme), fontFamily: 'var(--font-page)' } as unknown as CSSProperties

  const pageUrl = `${env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')}/${data.site.slug}`
  const jsonLd = buildProfileJsonLd(data.blocks, pageUrl)

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--text)]" style={style}>
      {jsonLd && (
        <script
          type="application/ld+json"
          // Safe: values are our own DB content serialized via JSON.stringify.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      )}
      <main className="mx-auto flex w-full max-w-[440px] flex-col gap-3 px-4 pb-16 pt-10">
        {data.blocks.map((block) => (
          <div key={block.id}>{renderBlock(block)}</div>
        ))}

        {showBranding && (
          <footer className="pt-8 text-center">
            <a
              href="/"
              className="inline-block text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
            >
              Made with OnePage
            </a>
          </footer>
        )}
      </main>

      {/* Zero-JS analytics beacon (not a content image, so not next/image). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/api/pv/${data.site.id}`}
        alt=""
        aria-hidden="true"
        width={1}
        height={1}
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
      />
    </div>
  )
}
