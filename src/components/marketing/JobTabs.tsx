'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { Blocks, LineChart, ShoppingBag, type LucideIcon } from 'lucide-react'
import { EASE, MonoCta, SectionHeader } from './section'

/**
 * "One page. Every job" — the section that answers what the page is actually *for*.
 *
 * Tabs rather than three stacked rows because the three jobs are alternatives —
 * most people arrive wanting one of them — and stacking them would make a visitor
 * scroll past two things they don't care about to reach the one they do.
 *
 * The anatomy is the reference's, cell for cell: header band (from SectionHeader),
 * a full-width tab rail in its own band, a panel split on the page's column grid —
 * copy in the left two columns, artwork in the right one, a vertical rule between
 * that lands on the 2/3 background line — and a metrics strip along the bottom
 * whose three cells sit one per background column.
 *
 * Motion, all on the project's `[0.22, 1, 0.36, 1]` ease:
 *
 *   · the active underline is a `layoutId`, so it slides between tabs instead of
 *     blinking off one and on under another;
 *   · the copy swaps with `mode="wait"` — the outgoing paragraph is gone before
 *     the incoming one moves;
 *   · all three artworks stay mounted and cross-fade. Mounting one at a time
 *     meant the first click on a tab showed an empty frame while that image was
 *     still being fetched.
 *
 * The metrics are product facts, not marketing numbers: block types from
 * `src/lib/blocks/schemas.ts` (17 variants), palettes from `src/lib/theme.ts`
 * (20 presets), platforms from the SocialPlatform enum (15 networks + email +
 * website). If one of those files changes, this strip is the thing to update.
 */

type Job = {
  id: string
  label: string
  icon: LucideIcon
  title: string
  titleMuted: string
  body: string
  cta: { label: string; href: string }
  /** All three are cropped to 4:5, so the frame never resizes. */
  image: { src: string; alt: string }
}

const JOBS: Job[] = [
  {
    id: 'build',
    label: 'Build',
    icon: Blocks,
    title: 'Drag a block in.',
    titleMuted: 'That’s the page.',
    body: 'Seventeen block types — links, video, gallery, FAQ, countdown, booking — reordered by dragging, with a live phone preview beside you the whole time. Change your mind as often as you like: everything autosaves, and nothing goes public until you publish.',
    cta: { label: 'See example pages', href: '/examples' },
    image: {
      src: '/marketing/tab-build.jpg',
      alt: 'A page being edited: a link block selected on a phone preview, surrounded by the blocks available to add.',
    },
  },
  {
    id: 'grow',
    label: 'Grow',
    icon: LineChart,
    title: 'Collect the email.',
    titleMuted: 'Keep the audience.',
    body: 'An email capture block sits on the page itself, so a visitor subscribes without leaving it. Analytics then tell you where they came from and which link earned the signup — views, clicks, click-through rate, referrers, countries. Export the list to CSV whenever you want; those addresses are yours, not a platform’s.',
    cta: { label: 'Start collecting', href: '/signup' },
    image: {
      src: '/marketing/tab-grow.jpg',
      alt: 'An email capture field on a page, with a chart above it showing subscribers gained this week.',
    },
  },
  {
    id: 'sell',
    label: 'Sell',
    icon: ShoppingBag,
    title: 'Show the product.',
    titleMuted: 'Send them to checkout.',
    body: 'A product block carries the photo, the price and the buy link, so what you’re selling sits on the page instead of three taps away behind a link tree. Every tap is counted against that block, which means you can see which product earned the click and which one just took up room.',
    cta: { label: 'Add a product', href: '/signup' },
    image: {
      src: '/marketing/tab-sell.jpg',
      alt: 'Product cards on a page, with an arrow tracing the path from a selected product to a checkout screen.',
    },
  },
]

/** Product facts — see the header comment for where each number lives. */
const METRICS = [
  { n: '17', label: 'block types' },
  { n: '20', label: 'theme palettes' },
  { n: '17', label: 'platforms linked' },
]

const inView = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
} as const

export default function JobTabs() {
  const [activeId, setActiveId] = useState(JOBS[0].id)
  const active = JOBS.find((j) => j.id === activeId) ?? JOBS[0]
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  /**
   * Arrow keys move between tabs, which is what a tablist is expected to do — and
   * because selection follows focus here, moving also switches the panel. Home/End
   * jump to the ends. Without this the rail is reachable by Tab but only operable
   * one tab at a time, which is the usual way tab components fail a keyboard.
   */
  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = JOBS.findIndex((j) => j.id === activeId)
    const next =
      e.key === 'ArrowRight' ? (i + 1) % JOBS.length
      : e.key === 'ArrowLeft' ? (i - 1 + JOBS.length) % JOBS.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? JOBS.length - 1
      : -1

    if (next === -1) return
    e.preventDefault()
    setActiveId(JOBS[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    // No background and no grid of its own: the home page draws one three-column
    // backdrop behind every section below the hero, and this one stands on it like
    // the rest. Carries the `features` id the footer links to.
    <section id="features" className="relative">
      <div className="mx-auto max-w-7xl px-5">
        <div className="border-b border-white/10">
          <SectionHeader
            eyebrow="One link, three jobs"
            title="One page."
            titleMuted="Every job"
            body="The same blocks that introduce you also collect the emails and take the orders. Nothing to wire up between them, and one set of numbers for all three."
          />

          {/* Tab rail — its own band between two rules. */}
          <motion.div
            {...inView}
            transition={{ duration: 0.55, ease: EASE }}
            role="tablist"
            aria-label="What a page can do"
            onKeyDown={onKeyDown}
            className="flex overflow-x-auto border-b border-white/10"
          >
            {JOBS.map((job, i) => {
              const isActive = job.id === activeId

              return (
                <button
                  key={job.id}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`job-tab-${job.id}`}
                  aria-selected={isActive}
                  aria-controls={`job-panel-${job.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveId(job.id)}
                  className={`group relative flex shrink-0 items-center gap-2.5 bg-[#0A0A0B] px-6 py-5 font-mono text-xs font-medium uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/40 sm:px-10 ${
                    isActive ? 'text-white' : 'text-white/35 hover:text-white/70'
                  }`}
                >
                  <job.icon
                    className={`h-4 w-4 transition-colors ${isActive ? 'text-[#F5124A]' : ''}`}
                  />
                  {job.label}

                  {isActive && (
                    <motion.span
                      layoutId="job-tab-underline"
                      className="absolute inset-x-0 -bottom-px h-px bg-[#F5124A]"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                </button>
              )
            })}
          </motion.div>

          {/* Panel — copy cell (2 columns) beside the artwork cell (1 column). */}
          <motion.div
            {...inView}
            transition={{ duration: 0.55, ease: EASE, delay: 0.08 }}
            role="tabpanel"
            id={`job-panel-${active.id}`}
            aria-labelledby={`job-tab-${active.id}`}
            className="grid lg:grid-cols-3"
          >
            <div className="flex items-center bg-[#0A0A0B] px-6 py-12 lg:col-span-2 lg:px-10 lg:py-16">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.32, ease: EASE }}
                  className="max-w-xl"
                >
                  <h3 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
                    {active.title}
                    <br />
                    <span className="text-white/35">{active.titleMuted}</span>
                  </h3>
                  <p className="mt-5 text-[15px] leading-relaxed text-white/50">{active.body}</p>

                  <div className="mt-8">
                    <MonoCta href={active.cta.href}>{active.cta.label}</MonoCta>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* The artwork is already dark and rounded; the cell only adds the
                rule that separates it and the bloom that stops a dark image on a
                dark page reading as a hole. All three images stay mounted and
                cross-fade — see the header comment. */}
            <div className="relative border-t border-white/10 bg-[#0A0A0B] p-6 lg:border-l lg:border-t-0 lg:p-8">
              <div className="relative mx-auto w-full max-w-[340px] lg:max-w-none">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,rgba(245,18,74,0.13),transparent_65%)]"
                />
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]">
                  {JOBS.map((job) => {
                    const isActive = job.id === activeId

                    return (
                      <motion.div
                        key={job.id}
                        aria-hidden={!isActive}
                        initial={false}
                        animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 1.015 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={job.image.src}
                          alt={isActive ? job.image.alt : ''}
                          fill
                          sizes="(min-width: 1024px) 400px, 340px"
                          className="object-cover"
                        />
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Metrics strip — one cell per background column, all product facts. */}
          <motion.div
            {...inView}
            transition={{ duration: 0.55, ease: EASE, delay: 0.12 }}
            className="grid grid-cols-3 border-t border-white/10"
          >
            {METRICS.map((m, i) => (
              <div
                key={m.label}
                className={`bg-[#0A0A0B] px-6 py-5 lg:px-10 lg:py-6 ${i > 0 ? 'border-l border-white/10' : ''}`}
              >
                <p className="text-2xl font-bold tracking-tight sm:text-3xl">{m.n}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35 sm:text-xs">
                  {m.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
