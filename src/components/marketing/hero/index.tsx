'use client'

import { motion } from 'motion/react'
import { usePrefersReducedMotion } from '@/components/usePrefersReducedMotion'
import HeroBackdrop from './HeroBackdrop'
import HeroHeadline from './HeroHeadline'
import HeroActions from './HeroActions'
import CursorLayer from './CursorLayer'
import AgentCard from './AgentCard'
import StatusCard from './StatusCard'
import { SURFACE } from './tokens'

/**
 * The landing-page hero: a collaborative-editing scene built from small pieces.
 *
 *   HeroBackdrop   framed 3-column grid + accent glow
 *   HeroHeadline   the copy, with "one page" as a selected text box
 *     └ SelectedPhrase → SelectionHandles, FormatToolbar, EditingCursor
 *   CursorLayer    the collaborators working around the copy
 *   HeroActions    one primary CTA + a quiet secondary link
 *   AgentCard      lower-left  — an AI suggestion
 *   StatusCard     lower-right — the published page
 *
 * The entrance is a Motion variant chain: the section declares the stagger and
 * each block just names the `item` variant, so the order and rhythm live in one
 * place instead of being spread across per-element delays. The corner cards are
 * absolutely positioned and so can't be stagger children — they animate on their
 * own, after the copy has landed.
 *
 * Two rules keep the scene from reading as a pile, both taken from the reference:
 *
 * 1. A narrow copy column (~half the frame) so the side margins are genuinely
 *    wide. Widening it is what previously squeezed the cursors and cards
 *    together.
 * 2. A horizontal split: cursors occupy the upper band, cards the lower one,
 *    with a clear gap between. The cards used to be pinned to the bottom corners
 *    while cursors sat mid-height, so both competed for the same strip. The cards
 *    are staggered rather than level, which reads as more incidental.
 *
 * There's no bottom border, and the background matches the page: the hero and the
 * audience strip below it should read as one continuous field, the way the
 * reference runs its hero straight into its logo row.
 *
 * The CTA lands inside the first viewport on a laptop (the sticky header above
 * costs ~108px); the cards may run past the fold, which is what invites scroll.
 */
const stage = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.11, delayChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 18 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] as const },
  },
}

/** Corner cards arrive last, once the copy has settled. */
const card = {
  hidden: { opacity: 0, y: 14 },
  shown: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

/** Reduced motion still gets the stagger, it just doesn't travel. */
const itemStill = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 0.4 } },
}

const cardStill = {
  hidden: { opacity: 0 },
  shown: (delay: number) => ({ opacity: 1, transition: { duration: 0.4, delay } }),
}

export default function Hero() {
  const reduceMotion = usePrefersReducedMotion()
  const block = reduceMotion ? itemStill : item
  const cornerCard = reduceMotion ? cardStill : card

  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: SURFACE }}>
      <HeroBackdrop />

      <motion.section
        className="relative mx-auto flex min-h-[440px] max-w-7xl flex-col items-center justify-center px-5 py-12 lg:min-h-[500px] lg:py-14"
        variants={stage}
        initial="hidden"
        animate="shown"
      >
        <CursorLayer />

        <motion.div variants={block} className="relative z-0 w-full">
          <HeroHeadline />
        </motion.div>

        {/* A deliberately narrow measure — this is what leaves room for the
            cursors and cards in the margins. Two sentences rather than a dash:
            at this width a dash ended up opening the second line, which reads as
            a typo. */}
        <motion.p
          variants={block}
          className="relative z-0 mt-11 max-w-md text-center text-[17px] leading-relaxed text-white/55"
        >
          Links, videos, email capture and real analytics. All from blocks you
          drag into place.
        </motion.p>

        <motion.div variants={block} className="relative z-0 mt-10">
          <HeroActions />
        </motion.div>

        <motion.div
          variants={cornerCard}
          custom={0.55}
          className="absolute bottom-16 left-5 z-10 hidden lg:block"
        >
          <AgentCard />
        </motion.div>
        <motion.div
          variants={cornerCard}
          custom={0.66}
          className="absolute bottom-8 right-5 z-10 hidden lg:block"
        >
          <StatusCard />
        </motion.div>
      </motion.section>
    </div>
  )
}
