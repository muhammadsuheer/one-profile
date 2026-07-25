/**
 * Entrance reveal wrapper.
 *
 * Intentionally has no client-side state: the animation lives in globals.css
 * (`.fp-reveal`) and starts as soon as the element paints, so the hero is
 * visible and animating from the server-rendered HTML rather than waiting on
 * hydration. `delay` only sets animation-delay, which keeps the stagger while
 * letting this stay a server component.
 */
export function Reveal({
  delay = 0,
  className = '',
  children,
}: {
  delay?: number
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={`fp-reveal ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

/** Reads the user's reduced-motion preference (false during SSR). */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
