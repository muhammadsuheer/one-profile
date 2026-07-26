'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Eye, Palette } from 'lucide-react'
import { EXAMPLE_PROFILES } from '@/lib/examples'

/**
 * The examples browser: pick a face, see that page render.
 *
 * Nothing here depends on hover, and that's the main thing about it. An earlier
 * version put each person's name in a tooltip, which is fine with a mouse and
 * broken on a phone: a tap both selected the person and flashed the tooltip, so
 * the label appeared and vanished in the same gesture. Names are printed under the
 * portraits permanently now. That's better on a desktop too — you can see who the
 * five people are without probing them one at a time.
 *
 * The preview doesn't take pointer events either. An iframe that scrolls steals
 * the gesture: on a phone a finger that lands on the preview scrolls the preview
 * rather than the page, and the wheel does the same on a desktop. So the frame is
 * inert and the whole thing is a link — one obvious action, and no way to get
 * stuck inside it. The top of a page is what's worth comparing at a glance anyway,
 * and the full page is one tap away.
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
 * Links carry `?from=examples`, which is what lets the page they land on offer a
 * way back here — see BackToExamples.
 */
export default function ExampleBrowser() {
  const [active, setActive] = useState(EXAMPLE_PROFILES[0])
  const fullPageHref = `/${active.slug}?from=examples`

  return (
    <div>
      {/* Switcher — names always visible, no hover required */}
      <div className="flex flex-wrap items-start justify-center gap-x-3 gap-y-5 sm:gap-x-6">
        {EXAMPLE_PROFILES.map((example) => {
          const isActive = example.slug === active.slug

          return (
            <motion.button
              key={example.slug}
              type="button"
              onClick={() => setActive(example)}
              aria-pressed={isActive}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 500, damping: 26 }}
              className="group flex w-[4.5rem] flex-col items-center gap-2 rounded-xl focus-visible:outline-none sm:w-20"
            >
              <span className="relative block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={example.avatar}
                  alt=""
                  width={56}
                  height={56}
                  className={`h-12 w-12 rounded-full bg-white/5 object-cover transition-opacity sm:h-14 sm:w-14 ${
                    isActive ? 'opacity-100' : 'opacity-55 group-hover:opacity-90'
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
              </span>

              <span className="flex flex-col items-center leading-tight">
                <span
                  className={`text-[13px] font-semibold transition-colors ${
                    isActive ? 'text-white' : 'text-white/45 group-hover:text-white/75'
                  }`}
                >
                  {example.name.split(' ')[0]}
                </span>
                <span className="mt-0.5 text-[10px] uppercase tracking-wider text-white/30">
                  {example.field}
                </span>
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* Preview — inert, and the whole frame opens the page */}
      <div className="mt-10">
        <Link
          href={fullPageHref}
          aria-label={`Open ${active.name}'s full page`}
          className="group relative mx-auto block w-full max-w-[420px]"
        >
          <div className="rounded-[2.25rem] border border-white/10 bg-black p-2.5 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.95)] transition-colors group-hover:border-white/25 sm:p-3">
            <div className="relative overflow-hidden rounded-[1.85rem] bg-[#0A0A0B]">
              <iframe
                key={active.slug}
                src={`/${active.slug}`}
                title={`${active.name} — example page`}
                loading="lazy"
                tabIndex={-1}
                scrolling="no"
                className="pointer-events-none block h-[520px] w-full border-0 sm:h-[680px]"
              />

              {/* The page is taller than the frame, so the cut is faded rather than
                  sliced — and the fade carries the affordance. */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/90 via-black/45 to-transparent pb-5 pt-20">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3.5 py-1.5 text-xs font-semibold text-white/85 backdrop-blur">
                  Open full page
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </div>
        </Link>

        <p className="mt-3 text-center font-mono text-xs text-white/30">
          foliopage.site/{active.slug}
        </p>
      </div>

      {/* What's worth noticing about the page currently on screen. */}
      <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
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

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/10 pt-3 text-xs text-white/35">
              <span className="inline-flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5" />
                {active.palette}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                Real view count on the page
              </span>
            </div>

            <Link
              href={fullPageHref}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-[0.06em] text-white sm:w-auto"
              style={{ backgroundColor: active.accent }}
            >
              Open {active.name.split(' ')[0]}&apos;s page
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
