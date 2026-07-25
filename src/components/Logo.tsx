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
 * Not tinted, not faded, not recoloured, not filtered. The artwork is rendered
 * through an `<img>` precisely for that: an external image referenced this way is
 * sealed off from the page's CSS, so `currentColor`, `fill`, colour inheritance
 * and `text-*` classes cannot reach inside it. Inlining the SVG or passing
 * `opacity` / `filter` / `mix-blend-mode` through `className` would break that —
 * don't. `className` is for layout only.
 *
 * ── `tone` names the background, not the logo ──
 *
 * There are two authored lockups and the difference is the wordmark: on the dark
 * one "page" is a near-white outline, on the light one it's near-black. So the
 * choice is which surface the logo is sitting on, and getting it wrong makes
 * "page" disappear rather than merely look off. Hence `tone="onLight"` rather
 * than a name like "light", which reads as a property of the logo itself.
 *
 * The mark is the same artwork for both — crimson over dark maroon reads against
 * either surface — so it needs no tone.
 *
 * Dimensions are hard-coded per file so the browser reserves the right box and
 * the logo can't shift the layout as it loads. Note the two lockups aren't the
 * same aspect ratio, which is why each carries its own numbers rather than
 * sharing one.
 *
 * `public/brand/*` holds trimmed copies; the authored exports stay in `public/`.
 * Trimming mattered: they ship at 666×375 with the logo occupying 392×90 of it,
 * so rendered inside any height we set the logo would have come out at roughly a
 * quarter of its intended size.
 */
const ART = {
  lockup: {
    onDark: { src: '/brand/logo-dark.webp', width: 392, height: 90 },
    onLight: { src: '/brand/logo-white.webp', width: 470, height: 106 },
  },
  mark: {
    onDark: { src: '/brand/mark.webp', width: 84, height: 90 },
    onLight: { src: '/brand/mark.webp', width: 84, height: 90 },
  },
} as const

export type LogoProps = {
  /** Rendered height in px. Width follows the artwork's aspect ratio. */
  size?: number
  variant?: 'lockup' | 'mark'
  /** The background this sits on — see the note above. */
  tone?: 'onDark' | 'onLight'
  className?: string
}

export default function Logo({
  size = 26,
  variant = 'lockup',
  tone = 'onDark',
  className = '',
}: LogoProps) {
  const art = ART[variant][tone]
  const width = Math.round((size * art.width) / art.height)

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={art.src}
      alt="FolioPage"
      width={width}
      height={size}
      className={className}
      style={{ height: size, width }}
    />
  )
}
