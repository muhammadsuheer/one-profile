'use client'

import { MotionConfig } from 'motion/react'

/**
 * App-wide Motion configuration.
 *
 * `reducedMotion="never"` is a deliberate product decision, not an oversight.
 * The alternative, `"user"`, is a global killswitch — and worse than merely
 * stopping things: suppressing an in-flight animation makes Motion apply its
 * target immediately, so elements land wherever they were heading. The ticker
 * parked a full copy-width to one side, showing a row sliced through the middle
 * of an item. It looked broken rather than still.
 *
 * The motion on these pages is brand presentation — a staggered entrance, a slow
 * ticker, cursors drifting around the headline. It runs for everyone, which is
 * also what the rest of the industry does; most sites don't consult the
 * preference at all.
 *
 * The tradeoff is real and worth naming: `prefers-reduced-motion` exists for
 * people who get motion sickness from movement on screen, and a continuously
 * scrolling row is the textbook example of what it asks us to stop. If that
 * matters later, the fix is a static alternative per animation — a wrapped list
 * instead of a ticker, cursors at rest — not flipping this switch, which only
 * produces the frozen-mid-animation state described above.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="never">{children}</MotionConfig>
}
