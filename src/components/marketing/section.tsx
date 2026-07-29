'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'

/**
 * The shared cell language of the marketing pages.
 *
 * The reference these pages follow isn't a stack of sections — it's a table. Two
 * rails run the full height of the page, every section boundary is a hairline that
 * *terminates at the rails*, and content sits in cells that snap to the page's
 * three background columns. What sells that read is repetition: the same header
 * band, the same monospace eyebrow, the same hairline weight everywhere. So the
 * pieces live here once, and every section imports them rather than approximating
 * them.
 *
 * The one deliberately non-obvious rule: horizontal rules belong INSIDE the
 * `max-w-7xl px-5` container, not on the `<section>`. A border on the section runs
 * the full viewport and crosses the rails, which breaks the frame; a border on the
 * container's content box ends exactly where the rails are drawn.
 */

export const EASE = [0.22, 1, 0.36, 1] as const

export const sectionStage = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
}

export const sectionItem = {
  hidden: { opacity: 0, y: 16 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

/** The monospace uppercase accent line every section opens with. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-[#F5124A]">
      {children}
    </p>
  )
}

/**
 * A section's header band: eyebrow + two-tone heading in the left two columns,
 * the qualifying paragraph in the right one, a vertical rule between them sitting
 * exactly on the page's 2/3 column line, and a full rule underneath.
 *
 * The split isn't decoration — the paragraph is capped at a column's width so it
 * stays a qualifier rather than growing into a second heading.
 *
 * Cells are opaque (`bg-[#0A0A0B]`) on purpose: the page draws its column lines
 * under the content layer, and an opaque cell is what keeps a line from showing
 * through a paragraph. The grid is meant to appear in empty cells only.
 */
export function SectionHeader({
  eyebrow,
  title,
  titleMuted,
  body,
}: {
  eyebrow: string
  title: string
  titleMuted: string
  body: string
}) {
  return (
    <motion.div
      variants={sectionStage}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.4 }}
      className="grid border-b border-white/10 lg:grid-cols-3"
    >
      <motion.div
        variants={sectionItem}
        className="bg-[#0A0A0B] px-6 pb-8 pt-14 lg:col-span-2 lg:px-10 lg:py-16"
      >
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
          {title} <span className="text-white/35">{titleMuted}</span>
        </h2>
      </motion.div>
      <motion.div
        variants={sectionItem}
        className="bg-[#0A0A0B] px-6 pb-10 lg:border-l lg:border-white/10 lg:px-10 lg:py-16"
      >
        <p className="max-w-sm text-sm leading-relaxed text-white/45">{body}</p>
      </motion.div>
    </motion.div>
  )
}

/**
 * The reference's small square arrow — the quiet "there's more here" affordance
 * that sits at the bottom of a feature cell.
 */
export function SquareArrow({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="group inline-flex h-9 w-9 items-center justify-center rounded-[4px] border border-white/15 text-white/60 transition-colors hover:border-white/40 hover:text-white"
    >
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  )
}

/** The labeled counterpart: an outlined, monospace, uppercase CTA. */
export function MonoCta({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2.5 rounded-[4px] border border-white/15 px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-[0.12em] text-white/85 transition-colors hover:border-white/35 hover:bg-white/5"
    >
      {children}
      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  )
}
