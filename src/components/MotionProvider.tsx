'use client'

import { MotionConfig } from 'motion/react'

/**
 * Wraps the app so Motion handles the reduced-motion preference itself.
 *
 * This exists to avoid a class of hydration bug. `useReducedMotion()` returns
 * `null` on the server and a boolean on the client, so branching on it — either
 * returning a different tree or passing different props — makes the server and
 * the first client render disagree, and React reports a hydration mismatch.
 *
 * `reducedMotion="user"` moves the decision inside Motion: the same tree renders
 * on both sides, and Motion skips transform and layout animations when the user
 * has asked for reduced motion, keeping opacity and colour changes. So nothing in
 * here needs to read the preference itself.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
