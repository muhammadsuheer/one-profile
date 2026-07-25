/**
 * Hero backdrop: a framed three-column grid plus a soft accent glow at the top.
 *
 * The frame's outer edges line up with the navbar's content edges (both are
 * max-w-7xl px-5), which is what makes the header and hero read as one aligned
 * system. The grid itself is `.hero-grid` in globals.css so it ships in the CSS
 * bundle rather than as an inline style block in every response.
 */
export default function HeroBackdrop() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="mx-auto h-full max-w-7xl px-5">
          <div className="hero-grid h-full border-x border-white/[0.09]" />
        </div>
      </div>

      {/* accent glow bleeding down from behind the navbar */}
      <div
        className="pointer-events-none absolute -top-48 left-1/2 h-96 w-[140%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(245,18,74,0.15),transparent_62%)]"
        aria-hidden
      />
    </>
  )
}
