import HeroBackdrop from './HeroBackdrop'
import HeroHeadline from './HeroHeadline'
import HeroActions from './HeroActions'
import CursorLayer from './CursorLayer'
import AgentCard from './AgentCard'
import StatusCard from './StatusCard'
import { Reveal } from './motion'
import { SURFACE } from './tokens'

/**
 * The landing-page hero: a collaborative-editing scene built from small pieces.
 *
 *   HeroBackdrop   framed 3-column grid + accent glow
 *   HeroHeadline   the copy, with "one page" as a selected text box
 *     └ SelectedPhrase → SelectionHandles, FormatToolbar, EditingCursor
 *   CursorLayer    the collaborators floating in the side margins (rAF motion)
 *   HeroActions    one primary CTA + a quiet secondary link
 *   AgentCard      bottom-left  — an AI suggestion
 *   StatusCard     bottom-right — the published page
 *
 * This is a *server* component. Only the two pieces that genuinely need a
 * animation loop (CursorLayer, EditingCursor) are client components, so the
 * headline, copy and CTA are in the initial HTML and their reveal is pure CSS —
 * nothing that matters waits for hydration.
 *
 * Heights are kept deliberately tight so the CTA lands inside the first
 * viewport on a laptop: the sticky header above already costs ~106px, so the
 * hero targets ~510px of its own (min-h 480 + py-14) rather than filling the
 * screen. The corner cards are absolutely positioned and only render at lg,
 * where the side margins are wide enough that they can't collide with the
 * centred column.
 */
export default function Hero() {
  return (
    <div
      className="relative overflow-hidden border-b border-white/10"
      style={{ backgroundColor: SURFACE }}
    >
      <HeroBackdrop />

      <section className="relative mx-auto flex min-h-[460px] max-w-7xl flex-col items-center justify-center px-5 py-14 lg:min-h-[540px] lg:py-16">
        <CursorLayer />

        <Reveal className="relative z-0 w-full">
          <HeroHeadline />
        </Reveal>

        <Reveal delay={120} className="relative z-0 mt-6">
          <p className="mx-auto max-w-xl text-center text-[17px] leading-relaxed text-white/55">
            Build a bio page that stays on brand, in your control, and ready to share —
            links, videos, email capture and real analytics, all from blocks.
          </p>
        </Reveal>

        <Reveal delay={220} className="relative z-0 mt-8">
          <HeroActions />
        </Reveal>

        {/* corner cards — only where there's genuinely room for them */}
        <Reveal delay={520} className="absolute bottom-8 left-5 z-10 hidden lg:block">
          <AgentCard />
        </Reveal>
        <Reveal delay={600} className="absolute bottom-8 right-5 z-10 hidden lg:block">
          <StatusCard />
        </Reveal>
      </section>
    </div>
  )
}
