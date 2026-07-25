'use client'

import { useEffect, useRef } from 'react'
import CollabCursor from './CollabCursor'
import { COLLABORATORS } from './tokens'
import { prefersReducedMotion } from './motion'

/**
 * The floating collaborator layer.
 *
 * All motion runs off one requestAnimationFrame loop that writes `transform`
 * directly on each cursor — entrance travel, a continuous lissajous idle path,
 * and a shared mouse parallax offset, composed into a single transform per
 * frame. Deliberately not CSS keyframes: a single loop can't get out of sync
 * with itself, and it can't silently stop animating the way stacked
 * animation-delay chains can.
 *
 * `containerRef` is the element the mouse position is measured against (the
 * hero section), so parallax is relative to the hero rather than the viewport.
 */
export default function CursorLayer({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>
}) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    if (prefersReducedMotion()) {
      itemRefs.current.forEach((el) => {
        if (el) {
          el.style.opacity = '1'
          el.style.transform = 'none'
        }
      })
      return
    }

    let raf = 0
    let targetX = 0
    let targetY = 0
    let easedX = 0
    let easedY = 0
    const start = performance.now()

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      targetX = -((e.clientX - rect.left) / rect.width - 0.5) * 18
      targetY = -((e.clientY - rect.top) / rect.height - 0.5) * 18
    }
    container.addEventListener('mousemove', onMouseMove)

    const frame = (now: number) => {
      easedX += (targetX - easedX) * 0.06
      easedY += (targetY - easedY) * 0.06
      const elapsed = now - start

      COLLABORATORS.forEach((c, i) => {
        const el = itemRefs.current[i]
        if (!el) return

        const since = elapsed - c.delay
        if (since <= 0) {
          el.style.opacity = '0'
          return
        }

        // Entrance: glide in from the offset over 900ms, easing out.
        const t = Math.min(since / 900, 1)
        const ease = 1 - Math.pow(1 - t, 3)
        const enterX = c.fromX * (1 - ease)
        const enterY = c.fromY * (1 - ease)
        el.style.opacity = String(Math.min(since / 520, 1))

        // Idle: a lissajous path, so it never reads as a straight twitch.
        const phase = (Math.max(since - 900, 0) / c.period) * Math.PI * 2
        const idleX = Math.sin(phase) * c.radius
        const idleY = Math.sin(phase * 1.3 + i) * c.radius * 0.55

        el.style.transform = `translate(${(enterX + idleX + easedX).toFixed(2)}px, ${(
          enterY + idleY + easedY
        ).toFixed(2)}px)`
      })

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      container.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(raf)
    }
  }, [containerRef])

  return (
    <div className="pointer-events-none absolute inset-0 z-10 hidden sm:block" aria-hidden>
      {COLLABORATORS.map((c, i) => (
        <div key={c.name} className="absolute" style={{ top: c.top, left: c.left }}>
          <div
            ref={(el) => {
              itemRefs.current[i] = el
            }}
            style={{ opacity: 0, willChange: 'transform' }}
          >
            <CollabCursor name={c.name} role={c.role} color={c.color} facing={c.facing} />
          </div>
        </div>
      ))}
    </div>
  )
}
