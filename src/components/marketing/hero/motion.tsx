'use client'

import { useEffect, useState } from 'react'

/** True once the component has painted once — used to trigger entrance CSS. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return mounted
}

/** Reads the user's reduced-motion preference (false during SSR). */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * One calm entrance: fade + a small rise, on a shared easing curve. Every
 * revealed element in the hero uses this, so the whole section arrives with a
 * single rhythm instead of each part animating its own way.
 */
export function Reveal({
  show,
  delay = 0,
  className = '',
  children,
}: {
  show: boolean
  delay?: number
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={className}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'none' : 'translateY(14px)',
        transition:
          'opacity 750ms cubic-bezier(0.22, 1, 0.36, 1), transform 750ms cubic-bezier(0.22, 1, 0.36, 1)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
