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
 * Two rules keep the scene from reading as a pile, both taken from the
 * reference:
 *
 * 1. A narrow copy column (~half the frame) so the side margins are genuinely
 *    wide. Widening it is what previously squeezed the cursors and cards
 *    together.
 * 2. A horizontal split: cursors occupy the upper band, cards the lower one,
 *    with a clear gap between. The cards used to be pinned to the bottom
 *    corners while cursors sat mid-height, so both competed for the same strip.
 *    The cards are staggered rather than level, which reads as more incidental.
 *
 * There's no bottom border, and the background matches the page: the hero and
 * the audience strip below it should read as one continuous field, the way the
 * reference runs its hero straight into its logo row.
 *
 * The CTA lands inside the first viewport on a laptop (the sticky header above
 * costs ~108px); the cards may run past the fold, which is what invites scroll.
 */
export default function Hero() {
  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: SURFACE }}>
      <HeroBackdrop />

      <section className="relative mx-auto flex min-h-[440px] max-w-7xl flex-col items-center justify-center px-5 py-12 lg:min-h-[500px] lg:py-14">
        <CursorLayer />

        <Reveal className="relative z-0 w-full">
          <HeroHeadline />
        </Reveal>

        {/* A deliberately narrow measure — this is what leaves room for the
            cursors and cards in the margins. Two sentences rather than a dash:
            at this width a dash ended up opening the second line, which reads as
            a typo. */}
        <Reveal delay={120} className="relative z-0 mt-11">
          <p className="mx-auto max-w-md text-center text-[17px] leading-relaxed text-white/55">
            Links, videos, email capture and real analytics. All from blocks you
            drag into place.
          </p>
        </Reveal>

        {/* Tighter than the gap above the copy on purpose — the CTA needs to sit
            inside the fold on a laptop, and this is the gap to give up first. */}
        <Reveal delay={220} className="relative z-0 mt-10">
          <HeroActions />
        </Reveal>

        {/* Corner cards — the lower band, staggered so they don't read as a
            matched pair, and only at lg where the margins are wide enough. */}
        <Reveal delay={520} className="absolute bottom-16 left-5 z-10 hidden lg:block">
          <AgentCard />
        </Reveal>
        <Reveal delay={600} className="absolute bottom-8 right-5 z-10 hidden lg:block">
          <StatusCard />
        </Reveal>
      </section>
    </div>
  )
}
