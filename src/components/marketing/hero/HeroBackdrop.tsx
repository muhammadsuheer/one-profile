/**
 * Hero backdrop: a framed three-column grid plus a soft accent glow at the top.
 *
 * The frame's outer edges line up with the navbar's content edges (both are
 * max-w-7xl px-5), which is what makes the whole header read as one aligned
 * system. Lines stay crisp for their full height and only fade at the very top
 * and bottom so they don't cut off hard against the section borders.
 */
export default function HeroBackdrop() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="mx-auto h-full max-w-7xl px-5">
          <div className="hero-grid h-full border-x border-white/[0.07]" />
        </div>
      </div>

      {/* accent glow bleeding down from behind the navbar */}
      <div
        className="pointer-events-none absolute -top-48 left-1/2 h-96 w-[140%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(245,18,74,0.15),transparent_62%)]"
        aria-hidden
      />

      <style>{`
        .hero-grid {
          background-image: linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px);
          background-size: 33.3333% 100%;
          background-position: 33.3333% 0;
          background-repeat: repeat-x;
          -webkit-mask-image: linear-gradient(to bottom, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(to bottom, transparent, #000 8%, #000 92%, transparent);
        }
      `}</style>
    </>
  )
}
