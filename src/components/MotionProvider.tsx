'use client'

import { MotionConfig } from 'motion/react'

/**
 * App-wide Motion configuration.
 *
 * `reducedMotion="never"` looks like the wrong choice and isn't. The alternative,
 * `"user"`, is a global killswitch: it suppresses every transform animation in the
 * app at once for anyone with the preference set. Worse, suppressing an in-flight
 * animation makes Motion apply its *target* immediately, so elements land wherever
 * they were heading — the ticker parked a full copy-width off to one side, showing
 * a row sliced through the middle of an item. That reads as broken rather than as
 * still, and it's a lot of visitors to show a broken page to: plenty of people turn
 * Windows animation effects off for performance without ever thinking of it as an
 * accessibility setting.
 *
 * So Motion doesn't decide. Each animation handles the preference itself through
 * `usePrefersReducedMotion` and picks a genuinely static presentation instead of a
 * frozen one — reduce, don't remove. The ticker becomes a wrapped static list, the
 * collaborators sit at their rest positions, entrance animations fade without
 * travelling.
 *
 * Anything added here that animates has to make that choice deliberately. There is
 * no safety net above it.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="never">{children}</MotionConfig>
}
