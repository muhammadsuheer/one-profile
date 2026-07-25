/**
 * The FolioPage logo, in one place.
 *
 * Every surface that shows the brand renders this — navbar, footer, auth panel,
 * onboarding, dashboard. Each of those used to hand-roll a pink rounded square
 * with the letter F next to a text span, so the brand existed in six places and
 * none of them was the real logo.
 *
 * ── The logo's colours are never altered. ──
 *
 * Not tinted, not faded, not recoloured per surface, not swapped for dark mode.
 * The artwork is rendered through an `<img>` precisely for that: an external
 * image referenced this way is sealed off from the page's CSS, so `currentColor`,
 * `fill`, colour inheritance and `text-*` classes cannot reach inside it.
 * Inlining the SVG or passing `opacity` / `filter` / `mix-blend-mode` through
 * `className` would break that — don't. `className` is for layout only.
 *
 * ── Which variant goes where ──
 *
 * The wordmark sets "page" as a near-white outline (#fcfbfc), so the lockup is
 * built for dark surfaces and "page" all but disappears on a light one. The fix
 * is to pick the right variant, not to recolour anything:
 *
 *   variant="lockup"  dark surfaces — marketing navbar, footer, auth brand panel
 *   variant="mark"    light surfaces — dashboard, onboarding — plus favicons,
 *                     avatars, and anywhere too tight for a wordmark
 *
 * Dimensions are hard-coded from the trimmed artwork so the browser reserves the
 * right box and the logo can't shift the layout as it loads. The source export
 * was 666×375 with the logo occupying only 392×90 of it — two thirds empty
 * padding — which would have rendered the logo at a quarter of its intended size
 * inside any height we set. `public/brand/*` holds the trimmed versions; the
 * original is kept at `public/logo.webp`.
 */

/** Intrinsic size of the trimmed artwork. */
const LOCKUP = { width: 392, height: 90 }
const MARK = { width: 84, height: 90 }

export type LogoProps = {
  /** Rendered height in px. Width follows the artwork's aspect ratio. */
  size?: number
  variant?: 'lockup' | 'mark'
  className?: string
}

export default function Logo({ size = 26, variant = 'lockup', className = '' }: LogoProps) {
  const art = variant === 'mark' ? MARK : LOCKUP
  const src = variant === 'mark' ? '/brand/mark.webp' : '/brand/logo.webp'
  const width = Math.round((size * art.width) / art.height)

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="FolioPage"
      width={width}
      height={size}
      className={className}
      style={{ height: size, width }}
    />
  )
}
