'use client'

import { useEffect, useRef } from 'react'
import HeroBackdrop from './HeroBackdrop'
import HeroHeadline from './HeroHeadline'
import HeroActions from './HeroActions'
import CursorLayer from './CursorLayer'
import AgentCard from './AgentCard'
import StatusCard from './StatusCard'
import { Reveal, useMounted, prefersReducedMotion } from './motion'
import { SURFACE } from './tokens'

/**
 * The landing-page hero: a collaborative-editing scene built from small pieces.
 *
 *   HeroBackdrop   framed 3-column grid + accent glow
 *   HeroHeadline   the copy, with "one page" as a selected text box
 *     └ SelectedPhrase → SelectionHandles, FormatToolbar, editing cursor
 *   CursorLayer    the collaborators floating in the side margins (rAF motion)
 *   HeroActions    one primary CTA + a quiet secondary link
 *   AgentCard      bottom-left  — an AI suggestion
 *   StatusCard     bottom-right — the published page
 *
 * Layout notes: the section is a centered flex column, so the headline block
 * stays optically centered while the two cards are absolutely positioned in the
 * bottom corners (they only appear at lg, where there's room for them without
 * crowding the copy). The grid frame shares the navbar's max-w-7xl px-5 box, so
 * its edges line up with the logo and the CTA above it.
 */
export default function Hero() {
  const mounted = useMounted()
  const sectionRef = useRef<HTMLElement | null>(null)
  const editingCursorRef = useRef<HTMLSpanElement | null>(null)

  // The pointer resting on the selection box gets its own slow drift, so the
  // scene still feels alive even if the visitor never moves their mouse.
  useEffect(() => {
    const el = editingCursorRef.current
    if (!el || prefersReducedMotion()) return

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
    <div
      className="relative overflow-hidden border-b border-white/10"
      style={{ backgroundColor: SURFACE }}
    >
      <HeroBackdrop />

      <section
        ref={sectionRef}
        className="relative mx-auto flex min-h-[640px] max-w-7xl flex-col items-center justify-center px-5 py-24 sm:py-28 lg:min-h-[760px] lg:py-32"
      >
        <CursorLayer containerRef={sectionRef} />

        <Reveal show={mounted} className="relative z-0 w-full">
          <HeroHeadline cursorRef={editingCursorRef} />
        </Reveal>

        <Reveal show={mounted} delay={140} className="relative z-0 mt-10">
          <p className="mx-auto max-w-xl text-center text-lg leading-relaxed text-white/55">
            Build a bio page that stays on brand, in your control, and ready to share —
            links, videos, email capture and real analytics, all from blocks.
          </p>
        </Reveal>

        <Reveal show={mounted} delay={260} className="relative z-0 mt-12">
          <HeroActions />
        </Reveal>

        {/* corner cards — only where there's genuinely room for them */}
        <Reveal show={mounted} delay={620} className="absolute bottom-10 left-5 z-10 hidden lg:block">
          <AgentCard />
        </Reveal>
        <Reveal show={mounted} delay={720} className="absolute bottom-10 right-5 z-10 hidden lg:block">
          <StatusCard />
        </Reveal>
      </section>
    </div>
  )
}
