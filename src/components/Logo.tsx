/**
 * The FolioPage logo, in one place.
 *
 * Every surface that shows the brand renders this — navbar, footer, auth panel,
 * onboarding, dashboard. Previously each of those hand-rolled a pink rounded
 * square with the letter F plus a text span, so the brand existed in eight
 * places and none of them was the real logo.
 *
 * The artwork lives in `public/brand/` and is referenced by path rather than
 * imported, so a missing file can't break the build. `BRAND_ASSETS_READY` is the
 * single switch: while it's false every surface falls back to a wordmark set in
 * our own type, styled after the real logo (solid "Folio", outlined "page"), so
 * nothing renders broken. Drop the files in and flip it to true — that's the
 * whole integration.
 *
 *   public/brand/logo.svg   full lockup: mark + wordmark, transparent
 *   public/brand/mark.svg   mark only, transparent — icons, OG, email
 *
 * SVG is worth insisting on: the same file then serves a 16px favicon and a
 * 1200px OG image with no separate exports, and it stays crisp on any display.
 */
const BRAND_ASSETS_READY = false

const ACCENT = '#F5124A'

export type LogoProps = {
  /** Height of the mark in px. The lockup scales from this. */
  size?: number
  /** Mark only — for favicons, avatars, tight spaces. */
  markOnly?: boolean
  className?: string
}

export default function Logo({ size = 26, markOnly = false, className = '' }: LogoProps) {
  if (BRAND_ASSETS_READY) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={markOnly ? '/brand/mark.svg' : '/brand/logo.svg'}
        alt="FolioPage"
        height={size}
        style={{ height: size, width: 'auto' }}
        className={className}
      />
    )
  }

  if (markOnly) return <FallbackMark size={size} className={className} />

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <FallbackMark size={size} />
      <Wordmark size={size} />
    </span>
  )
}

/**
 * Interim mark: an F built from three blocks — a stem and two arms, which is
 * both the initial and a stack of link blocks. Solid shapes rather than strokes,
 * so it survives being rendered at 16px.
 */
function FallbackMark({ size, className = '' }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      role="img"
      aria-label="FolioPage"
    >
      <rect x="5" y="4" width="4.4" height="16" rx="2.2" fill={ACCENT} />
      <rect x="11.1" y="4" width="8" height="4.4" rx="2.2" fill={ACCENT} />
      <rect x="11.1" y="10.6" width="5.4" height="4.4" rx="2.2" fill={ACCENT} opacity="0.5" />
    </svg>
  )
}

/**
 * Interim wordmark, echoing the real logo's split treatment: "Folio" solid,
 * "page" outlined. Set in our own type, so it's crisp and swaps out cleanly once
 * the artwork lands.
 */
function Wordmark({ size }: { size: number }) {
  const fontSize = size * 0.72
  return (
    <span
      className="font-semibold tracking-[-0.02em]"
      style={{ fontSize, lineHeight: 1 }}
      aria-hidden
    >
      <span style={{ color: ACCENT }}>Folio</span>
      <span
        style={{
          color: 'transparent',
          WebkitTextStroke: `1.1px ${ACCENT}`,
        }}
      >
        page
      </span>
    </span>
  )
}
