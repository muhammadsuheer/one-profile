'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Eye, Palette } from 'lucide-react'
import { EXAMPLE_PROFILES } from '@/lib/examples'

/**
 * The examples browser: pick a field on the left, see that page rendering on the
 * right.
 *
 * This replaced a grid of cards. The cards described five pages and then sent you
 * away to one of them, so comparing two meant leaving and coming back, and the
 * page you landed on gave no hint the other four existed. Switching in place is
 * the whole point — a visitor can move through five fields in five seconds
 * without losing where they were.
 *
 * The preview is an iframe of the real published page, not a screenshot or a
 * re-implementation. That matters for two reasons: what's on screen is genuinely
 * the product rendering real content, and there's no second copy of the page to
 * drift out of date. Same origin, so no embedding restrictions to work around.
 *
 * `key` on the iframe is deliberate — swapping the `src` of an existing iframe
 * pushes an entry into the browser's history, so a visitor who tried three
 * examples would need three Back presses to leave the page. Remounting instead
 * replaces the frame and leaves history alone.
 */
export default function ExampleBrowser() {
  const [active, setActive] = useState(EXAMPLE_PROFILES[0])

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-12">
      {/* Switcher */}
      <div>
        <ul className="space-y-2">
          {EXAMPLE_PROFILES.map((example) => {
            const isActive = example.slug === active.slug
            return (
              <li key={example.slug}>
                <button
                  type="button"
                  onClick={() => setActive(example)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition-colors ${
                    isActive
                      ? 'border-white/20 bg-white/[0.05]'
                      : 'border-white/[0.08] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.035]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="example-active-bar"
                      className="absolute left-0 top-3 h-[calc(100%-1.5rem)] w-[3px] rounded-full"
                      style={{ backgroundColor: example.accent }}
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}

                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${example.accent}1f`,
                      color: example.accent,
                    }}
                  >
                    <example.icon className="h-5 w-5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2">
                      <span className="font-semibold tracking-tight text-white">{example.name}</span>
                      <span className="text-xs uppercase tracking-wider text-white/35">
                        {example.field}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-sm text-white/50">
                      {example.summary}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        {/* What's worth noticing about the page currently on screen. */}
        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.slug}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <p
                className="border-l-2 pl-3 text-sm leading-relaxed text-white/75"
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

              <div className="mt-4 flex items-center gap-4 border-t border-white/10 pt-3 text-xs text-white/35">
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

      {/* Live preview */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="mx-auto w-full max-w-[420px]">
          <div className="rounded-[2rem] border border-white/10 bg-black p-2.5 shadow-[0_30px_80px_-24px_rgba(0,0,0,0.9)]">
            <div className="overflow-hidden rounded-[1.6rem] bg-[#0A0A0B]">
              <iframe
                key={active.slug}
                src={`/${active.slug}`}
                title={`${active.name} — example page`}
                loading="lazy"
                className="block h-[620px] w-full border-0"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between px-1">
            <span className="font-mono text-xs text-white/35">
              foliopage.site/{active.slug}
            </span>
            <Link
              href={`/${active.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: active.accent }}
            >
              Open full page
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
