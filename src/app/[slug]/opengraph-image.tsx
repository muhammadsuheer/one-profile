import { ImageResponse } from 'next/og'
import { getPublishedSiteBySlug } from '@/lib/sites'

export const alt = 'Profile page'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Params = { params: Promise<{ slug: string }> }

const clamp = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s)
// ImageResponse can only fetch remote http(s) images; data:/blob: URLs hang or throw.
const isRemote = (u: string) => /^https?:\/\//i.test(u)

export default async function OpengraphImage({ params }: Params) {
  const { slug } = await params

  let name = slug
  let tagline = ''
  let avatarUrl = ''
  let accent = '#F5124A'
  let badge: string | undefined

  try {
    const data = await getPublishedSiteBySlug(slug)
    const profileBlock = data?.blocks.find((b) => b.type === 'profile')
    const profile = profileBlock?.data.type === 'profile' ? profileBlock.data : null
    name = clamp((profile?.name ?? data?.site.seo?.title ?? slug).trim() || slug, 40)
    tagline = clamp((profile?.tagline ?? data?.site.seo?.description ?? '').trim(), 90)
    const rawAvatar = profile?.avatarUrl || ''
    avatarUrl = isRemote(rawAvatar) ? rawAvatar : ''
    accent = data?.site.theme?.accentColor ?? '#F5124A'
    badge = profile?.badgeText ? clamp(profile.badgeText.trim(), 28) : undefined
  } catch {
    // fall through with defaults — OG image must never 500
  }

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
          padding: '60px 80px',
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

        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#FFFFFF',
            textAlign: 'center',
            maxWidth: 1040,
            lineHeight: 1.1,
          }}
        >
          {name}
        </div>

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

        {tagline && (
          <div style={{ fontSize: 32, color: '#8E8E93', textAlign: 'center', maxWidth: 1000 }}>
            {tagline}
          </div>
        )}
      </div>
    ),
    { ...size },
  )
}
