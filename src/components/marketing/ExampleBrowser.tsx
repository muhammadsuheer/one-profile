'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Eye, Palette } from 'lucide-react'
import { EXAMPLE_PROFILES } from '@/lib/examples'

/**
 * The examples browser: pick a face, see that page render.
 *
 * The switcher is a row of portraits rather than a list of rows, and the preview
 * gets the width that frees up. Two earlier versions informed this: a grid of
 * cards that linked out — so comparing two examples took a round trip through the
 * back button — and then a column of description rows beside a narrow frame, which
 * spent most of the space explaining pages instead of showing them. The point of
 * this section is the page, so the page gets the room.
 *
 * The trade is that a bare portrait doesn't say whose page it is, which is what
 * the tooltip is for: name and field on hover or keyboard focus, so it works
 * without a pointer too.
 *
 * The preview is an iframe of the real published page, not a screenshot. What's on
 * screen is genuinely the product rendering real content, and there's no second
 * copy of the page to drift out of date. Same origin, so nothing to work around.
 *
 * `key` on the iframe is deliberate. Swapping the `src` of an existing iframe
 * pushes an entry into browser history, so a visitor who tried three examples
 * would need three Back presses to leave the page. Remounting replaces the frame
 * and leaves history alone.
 *
 * "Open full page" carries `?from=examples`, which is what lets that page offer a
 * way back here — see BackToExamples.
 */
export default function ExampleBrowser() {
  const [active, setActive] = useState(EXAMPLE_PROFILES[0])
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div>
      {/* Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {EXAMPLE_PROFILES.map((example) => {
          const isActive = example.slug === active.slug
          const showTip = hovered === example.slug

          return (
            <div key={example.slug} className="relative">
              <motion.button
                type="button"
                onClick={() => setActive(example)}
                onMouseEnter={() => setHovered(example.slug)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(example.slug)}
                onBlur={() => setHovered(null)}
                aria-pressed={isActive}
                aria-label={`${example.name} — ${example.field}`}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 500, damping: 26 }}
                className="relative block rounded-full focus-visible:outline-none"
              >
                {/* The same portrait the page itself shows, so the switcher and
                    the preview are obviously the same person. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={example.avatar}
                  alt=""
                  width={56}
                  height={56}
                  className={`h-14 w-14 rounded-full bg-white/5 object-cover transition-opacity ${
                    isActive ? 'opacity-100' : 'opacity-60 hover:opacity-90'
                  }`}
                />
                {/* Ring travels between portraits rather than blinking on and off. */}
                {isActive && (
                  <motion.span
                    layoutId="example-active-ring"
                    className="pointer-events-none absolute -inset-1 rounded-full border-2"
                    style={{ borderColor: example.accent }}
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
              </motion.button>

              <AnimatePresence>
                {showTip && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.16 }}
                    role="tooltip"
                    className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-[#17171b] px-3 py-2 text-center shadow-2xl"
                  >
                    <span className="block text-xs font-semibold text-white">{example.name}</span>
                    <span className="mt-0.5 block text-[11px] uppercase tracking-wider text-white/40">
                      {example.field}
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Preview */}
      <div className="mt-10">
        <div className="mx-auto w-full max-w-[460px]">
          <div className="rounded-[2.25rem] border border-white/10 bg-black p-3 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.95)]">
            <div className="overflow-hidden rounded-[1.85rem] bg-[#0A0A0B]">
              <iframe
                key={active.slug}
                src={`/${active.slug}`}
                title={`${active.name} — example page`}
                loading="lazy"
                className="block h-[720px] w-full border-0"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between px-1">
            <span className="font-mono text-xs text-white/35">foliopage.site/{active.slug}</span>
            <Link
              href={`/${active.slug}?from=examples`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: active.accent }}
            >
              Open full page
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* What's worth noticing about the page currently on screen. */}
      <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-baseline gap-2">
              <h3 className="font-semibold tracking-tight text-white">{active.name}</h3>
              <span className="text-xs uppercase tracking-wider text-white/35">{active.field}</span>
            </div>
            <p className="mt-1.5 text-sm text-white/50">{active.summary}</p>

            <p
              className="mt-4 border-l-2 pl-3 text-sm leading-relaxed text-white/75"
              style={{ borderColor: active.accent }}
            >
              {active.highlight}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {active.blocks.map((block) => (
                <span
                  key={block}
                  className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[11px] font-medium text-white/45"
                >
                  {block}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-white/10 pt-3 text-xs text-white/35">
              <span className="inline-flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5" />
                {active.palette}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                Real view count on the page
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
