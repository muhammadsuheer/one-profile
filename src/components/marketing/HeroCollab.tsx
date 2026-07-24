'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'

/**
 * Collaborative-editing hero (builder.io-style) for the FolioPage landing page.
 *
 * The centerpiece is a giant headline where the phrase "one page" is rendered as
 * a *selected* text box — a cyan selection outline with four corner handles and a
 * floating formatting toolbar — while colored collaborator cursors with name
 * pills float around it. Everything animates in on mount (staggered) and the
 * whole cursor layer parallax-shifts subtly with the mouse for depth.
 *
 * Pure presentation, no data. Client component only because of the mount
 * animation + mouse parallax.
 */

type Cursor = {
  name: string
  role: string
  color: string
  /** position of the cursor tip, in % of the hero box */
  top: string
  left: string
  /** parallax depth multiplier (bigger = moves more with the mouse) */
  depth: number
  /** entrance + idle timing offset in ms so they don't move in lockstep */
  delay: number
}

const CURSORS: Cursor[] = [
  { name: 'Aria', role: 'Musician', color: '#22d3ee', top: '14%', left: '78%', depth: 1.4, delay: 120 },
  { name: 'Devon', role: 'Creator', color: '#e879f9', top: '58%', left: '17%', depth: 1.0, delay: 260 },
  { name: 'Zoe', role: 'Coach', color: '#fb923c', top: '82%', left: '30%', depth: 1.8, delay: 400 },
  { name: 'Kai', role: 'Founder', color: '#4ade80', top: '78%', left: '70%', depth: 1.2, delay: 540 },
]

export default function HeroCollab() {
  const [mounted, setMounted] = useState(false)
  const layerRef = useRef<HTMLDivElement | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Kick off entrance animations on the next frame so the initial (hidden)
    // state is painted first.
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    const layer = layerRef.current
    if (!root || !layer) return

    // Respect reduced-motion: no parallax.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0

    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect()
      // -1 .. 1 from center
      const nx = (e.clientX - r.left) / r.width - 0.5
      const ny = (e.clientY - r.top) / r.height - 0.5
      tx = -nx * 24
      ty = -ny * 24
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const tick = () => {
      // ease toward target for a smooth, weighted feel
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08
      layer.style.setProperty('--px', `${cx.toFixed(2)}px`)
      layer.style.setProperty('--py', `${cy.toFixed(2)}px`)
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        raf = requestAnimationFrame(tick)
      } else {
        raf = 0
      }
    }

    root.addEventListener('mousemove', onMove)
    return () => {
      root.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={rootRef} className="relative overflow-hidden bg-[#08080A] text-white">
      <StyleTag />

      {/* faint vertical column guides + top glow */}
      <div className="pointer-events-none absolute inset-0 fp-grid" aria-hidden />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[120%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(245,18,74,0.14),transparent_60%)]" aria-hidden />

      {/* Announcement bar */}
      <div className="relative border-b border-white/5 bg-white/[0.02]">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-5 py-2.5 text-center text-sm text-white/80">
          <span className="hidden sm:inline">New:</span> Connect your own custom domain in one click
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Nav */}
      <header className="relative z-20">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <span className="text-lg font-semibold tracking-tight">FolioPage</span>
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/login"
              className="hidden rounded-lg border border-white/15 px-4 py-2 font-semibold text-white/85 transition-colors hover:bg-white/5 sm:inline-block"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-[#F5124A] px-4 py-2 font-semibold text-white shadow-[0_0_30px_-6px_rgba(245,18,74,0.6)] transition-opacity hover:opacity-90"
            >
              Start building
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero stage */}
      <section className="relative mx-auto max-w-6xl px-5 pb-24 pt-16 sm:pt-24">
        {/* Cursor layer (parallax) */}
        <div ref={layerRef} className="pointer-events-none absolute inset-0 z-10 fp-layer" aria-hidden>
          {CURSORS.map((c, i) => (
            <CursorTag key={c.name} cursor={c} mounted={mounted} index={i} />
          ))}
        </div>

        {/* Headline */}
        <h1 className="relative z-0 mx-auto max-w-4xl text-center text-[clamp(2.75rem,8vw,5.5rem)] font-bold leading-[1.02] tracking-tight">
          <Word show={mounted} delay={0}>Put</Word>{' '}
          <Word show={mounted} delay={70}>everything</Word>{' '}
          <Word show={mounted} delay={140}>you</Word>{' '}
          <Word show={mounted} delay={210}>are</Word>{' '}
          <Word show={mounted} delay={280}>on</Word>{' '}
          {/* the "selected" phrase */}
          <span
            className={`fp-select relative mx-1 inline-block px-2 italic text-[#7fe9f5] transition-all duration-500 ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '620ms' }}
          >
            one&nbsp;page
            {/* selection border */}
            <span className="pointer-events-none absolute -inset-1.5 rounded-[3px] border border-[#22d3ee]" aria-hidden />
            {/* corner handles */}
            <Handle className="-left-1.5 -top-1.5" />
            <Handle className="-right-1.5 -top-1.5" />
            <Handle className="-bottom-1.5 -left-1.5" />
            <Handle className="-bottom-1.5 -right-1.5" />
            {/* floating format toolbar */}
            <span
              className={`fp-toolbar absolute -right-2 -top-14 hidden items-center gap-1 rounded-lg border border-white/10 bg-[#141417] px-2 py-1.5 text-[13px] not-italic text-white shadow-xl sm:flex ${
                mounted ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="flex items-center gap-1 rounded px-1.5 py-0.5 text-white/80">
                Semibold <span className="text-white/40">⌄</span>
              </span>
              <span className="mx-0.5 h-4 w-px bg-white/10" />
              <span className="px-1 font-bold">B</span>
              <span className="rounded bg-[#22d3ee]/20 px-1 italic text-[#7fe9f5]">I</span>
              <span className="px-1 underline">U</span>
              <span className="px-1 line-through">S</span>
            </span>
          </span>
          <Word show={mounted} delay={720}>.</Word>
        </h1>

        <p
          className={`relative z-0 mx-auto mt-7 max-w-xl text-center text-lg text-white/60 transition-all duration-700 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
          style={{ transitionDelay: '820ms' }}
        >
          Build a bio page that stays on brand, in your control, and ready to share —
          links, videos, email capture and real analytics, all from blocks.
        </p>

        <div
          className={`relative z-0 mt-9 flex flex-wrap items-center justify-center gap-3 transition-all duration-700 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
          style={{ transitionDelay: '940ms' }}
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-[#F5124A] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_-8px_rgba(245,18,74,0.7)] transition-opacity hover:opacity-90"
          >
            Get started free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/ava"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-semibold text-white/85 hover:bg-white/5"
          >
            See a live example
          </Link>
        </div>
        <p
          className={`relative z-0 mt-4 text-center text-xs text-white/40 transition-opacity duration-700 ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '1040ms' }}
        >
          Free plan available · no credit card required
        </p>
      </section>
    </div>
  )
}

/** One animated headline word (fade + rise, staggered). */
function Word({ children, show, delay }: { children: React.ReactNode; show: boolean; delay: number }) {
  return (
    <span
      className={`inline-block transition-all duration-500 ${show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </span>
  )
}

/** A corner resize handle on the selection box. */
function Handle({ className }: { className: string }) {
  return (
    <span
      className={`pointer-events-none absolute h-2 w-2 rounded-[1px] border border-[#22d3ee] bg-[#08080A] ${className}`}
      aria-hidden
    />
  )
}

/** A floating collaborator cursor with a colored name pill. */
function CursorTag({ cursor, mounted, index }: { cursor: Cursor; mounted: boolean; index: number }) {
  return (
    <div
      className="absolute"
      style={{
        top: cursor.top,
        left: cursor.left,
        // parallax: depth * layer offset (set via CSS vars on the layer)
        transform: `translate(calc(var(--px,0px) * ${cursor.depth}), calc(var(--py,0px) * ${cursor.depth}))`,
        transition: 'opacity 600ms ease, filter 600ms ease',
        opacity: mounted ? 1 : 0,
      }}
    >
      {/* idle float wrapper */}
      <div
        className="fp-float"
        style={{ animationDelay: `${cursor.delay}ms`, animationDuration: `${6 + index}s` }}
      >
        {/* pop-in wrapper */}
        <div
          className="origin-top-left transition-transform duration-500"
          style={{
            transform: mounted ? 'scale(1)' : 'scale(0.6)',
            transitionDelay: `${cursor.delay}ms`,
          }}
        >
          {/* cursor arrow */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="drop-shadow-md">
            <path
              d="M4 3l15 6.5-6 2.2-2.2 6L4 3z"
              fill={cursor.color}
              stroke="#08080A"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
          {/* name pill */}
          <span
            className="ml-3 -mt-1 inline-block rounded-md px-2.5 py-1 text-xs font-semibold text-[#08080A] shadow-lg"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.name} · {cursor.role}
          </span>
        </div>
      </div>
    </div>
  )
}

/** Keyframes + grid background, scoped by class names. */
function StyleTag() {
  return (
    <style>{`
      .fp-grid {
        background-image:
          linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px);
        background-size: 12.5% 100%;
        mask-image: linear-gradient(to bottom, transparent, black 12%, black 78%, transparent);
      }
      @keyframes fp-bob {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      .fp-float { animation: fp-bob 6s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) {
        .fp-float { animation: none; }
      }
    `}</style>
  )
}
