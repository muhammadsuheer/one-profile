import { ImageResponse } from 'next/og'
import { getPublishedSiteBySlug } from '@/lib/sites'

export const alt = 'Profile page'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Params = { params: Promise<{ slug: string }> }

export default async function OpengraphImage({ params }: Params) {
  const { slug } = await params
  const data = await getPublishedSiteBySlug(slug)

  const profileBlock = data?.blocks.find((b) => b.type === 'profile')
  const profile = profileBlock?.data.type === 'profile' ? profileBlock.data : null
  const name = profile?.name ?? data?.site.seo?.title ?? slug
  const tagline = profile?.tagline ?? data?.site.seo?.description ?? ''
  const avatarUrl = profile?.avatarUrl || ''
  const accent = data?.site.theme?.accentColor ?? '#F5124A'
  const badge = profile?.badgeText

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 28,
          background: '#0A0A0B',
          fontFamily: 'sans-serif',
        }}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt=""
            width={220}
            height={220}
            style={{ borderRadius: 9999, objectFit: 'cover', border: '4px solid #2C2C2E' }}
          />
        ) : (
          <div
            style={{
              width: 220,
              height: 220,
              borderRadius: 9999,
              background: '#1A1A1C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 96,
              color: '#8E8E93',
            }}
          >
            {String(name).charAt(0).toUpperCase()}
          </div>
        )}

        <div style={{ fontSize: 64, fontWeight: 700, color: '#FFFFFF' }}>{name}</div>

        {badge && (
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: '#FFFFFF',
              background: accent,
              padding: '8px 24px',
              borderRadius: 9999,
            }}
          >
            {badge}
          </div>
        )}

        {tagline && <div style={{ fontSize: 32, color: '#8E8E93' }}>{tagline}</div>}
      </div>
    ),
    { ...size },
  )
}
