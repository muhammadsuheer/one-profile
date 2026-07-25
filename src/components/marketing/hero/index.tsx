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
 * Spacing follows the reference closely, because that's what makes the scene
 * feel composed rather than crowded: the copy column is deliberately narrow
 * (~40% of the frame) so wide side margins open up for the cursors and cards,
 * and the gaps between headline, copy and CTA are large — roughly 0.9em and
 * 1.0em of the headline size. Widening the copy is what previously made
 * everything feel cramped and pushed the cursors onto the cards.
 *
 * The CTA still lands inside the first viewport on a laptop (the sticky header
 * above costs ~106px), but the cards are allowed to run past the fold, which is
 * what invites the scroll.
 */
export default function Hero() {
  return (
    <div
      className="relative overflow-hidden border-b border-white/10"
      style={{ backgroundColor: SURFACE }}
    >
      <HeroBackdrop />

      <section className="relative mx-auto flex min-h-[460px] max-w-7xl flex-col items-center justify-center px-5 py-12 lg:min-h-[540px] lg:py-14">
        <CursorLayer />

        <Reveal className="relative z-0 w-full">
          <HeroHeadline />
        </Reveal>

        {/* max-w-lg, not max-w-xl: a narrow measure is what leaves room for the
            cursors and cards in the margins. Two sentences rather than a dash —
            at this width a dash ended up opening the second line, which reads
            as a typo. */}
        <Reveal delay={120} className="relative z-0 mt-14">
          <p className="mx-auto max-w-lg text-center text-lg leading-relaxed text-white/55">
            Links, videos, email capture and real analytics. All from blocks you
            drag into place.
          </p>
        </Reveal>

        {/* Tighter than the gap above the copy on purpose — the CTA needs to sit
            inside the fold on a laptop, and this is the gap to give up first. */}
        <Reveal delay={220} className="relative z-0 mt-10">
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
