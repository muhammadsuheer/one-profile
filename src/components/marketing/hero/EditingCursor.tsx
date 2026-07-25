'use client'

import { useEffect, useRef } from 'react'
import { ACCENT } from './tokens'

/**
 * The pointer resting on the selected phrase, drifting slowly so the scene
 * feels alive even if the visitor never moves their mouse.
 *
 * Its own tiny client component so the headline around it can stay a server
 * component. The drift offset is applied as `transform` from a rAF loop, which
 * is why the element's resting offset is a margin — a Tailwind translate class
 * would be overwritten every frame. The offset is positive so the arrow tip
 * sits just outside the box's corner; pulling it inward puts the tip on top of
 * the border and the corner handle, which reads as clutter rather than as a
 * pointer resting on the selection.
 */
export default function EditingCursor() {
  const ref = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const start = performance.now()
    const frame = (now: number) => {
      const phase = ((now - start) / 6400) * Math.PI * 2
      el.style.transform = `translate(${(Math.sin(phase) * 5).toFixed(2)}px, ${(
        Math.sin(phase * 1.4) * 4
      ).toFixed(2)}px)`
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <span
      ref={ref}
      className="absolute left-full top-full ml-1 mt-1 hidden select-none items-start sm:flex"
      style={{ willChange: 'transform' }}
    >
      <svg
        width="20"
        height="22"
        viewBox="0 0 20 22"
        fill="none"
        className="shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]"
      >
        <path
          d="M2.5 1.8 L2.5 19.4 L8.2 13.9 L17 11.2 Z"
          fill={ACCENT}
          stroke="#08080A"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="ml-1.5 mt-2 whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold not-italic leading-none tracking-normal text-white shadow-lg"
        style={{ backgroundColor: ACCENT }}
      >
        Aria · Musician
      </span>
    </span>
  )
}
