'use client'

import { useEffect, useState } from 'react'

/**
 * Whether the visitor has asked for reduced motion.
 *
 * Motion's own `useReducedMotion()` resolves the media query during the first
 * client render, which the server can't do — so branching on it makes the two
 * renders disagree and React reports a hydration mismatch. This starts `false` on
 * both sides and corrects itself in an effect, which is a plain re-render rather
 * than a mismatch. The cost is one frame of full-motion markup before it settles,
 * which is invisible and worth it.
 *
 * Use this to choose a *different, deliberate* presentation — not to freeze the
 * animated one. Suppressing an animation mid-flight tends to leave the element
 * wherever the animation was heading, which reads as broken rather than as still.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)

    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}
