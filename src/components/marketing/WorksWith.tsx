'use client'

import { motion } from 'motion/react'
// lucide dropped its brand glyphs, so YouTube comes from the product's own icon
// set below rather than from here.
import { CalendarClock, Globe } from 'lucide-react'
import { SocialIcon } from '@/components/blocks/social-icons'
import { Eyebrow, sectionItem, sectionStage } from './section'
import type { SocialPlatform } from '@/lib/blocks/schemas'

/**
 * "Works with everything you already post to."
 *
 * The reference's shape, taken literally: this section is a 3×2 table, not a
 * heading with cards floating beside it. The heading occupies the left column
 * across both rows, the four capability cells fill the other two columns, and
 * everything is separated by the same hairlines the rest of the page uses — no
 * rounded boxes, no fills. The vertical rules land on the page's background
 * column lines, which is what makes the section read as part of the page's frame
 * rather than as content placed on top of it.
 *
 * The logo rows answer "is my thing supported?" before the visitor reads a word —
 * and the icons are the same components the product renders on a real page
 * (`SocialIcon`), not a separate set drawn for marketing. If a platform is ever
 * added or dropped, this section can't claim otherwise; it's importing the truth.
 */

/** In the order they appear in the picker, which is the order a page renders them. */
const PLATFORMS: SocialPlatform[] = [
  'instagram',
  'tiktok',
  'youtube',
  'x',
  'threads',
  'facebook',
  'linkedin',
  'whatsapp',
  'twitch',
  'discord',
  'github',
  'spotify',
  'telegram',
  'snapchat',
  'pinterest',
]

function IconTile({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70">
      {children}
    </span>
  )
}

/**
 * Reserves two tile rows in every cell, whether or not the cell fills them.
 *
 * The platforms cell wraps to two rows and the other three don't, so without this
 * its title started 42px lower than its neighbours' and the row of cells read as
 * unrelated boxes. Reserving the space costs some white space in the sparse cells
 * and buys a straight line across the titles.
 */
function IconRow({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-[5.25rem] flex-wrap content-start gap-1.5">{children}</div>
}

/**
 * Border recipe per cell position — see the grid note in the component. Opaque
 * base so the page's column lines can't show through the copy; hover lifts to a
 * slightly lighter opaque rather than a translucent white, for the same reason.
 */
const CELL =
  'bg-[#0A0A0B] px-6 py-8 transition-colors hover:bg-[#0F0F13] lg:px-10 lg:py-10'

export default function WorksWith() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-5">
        <motion.div
          variants={sectionStage}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.15 }}
          className="grid border-b border-white/10 lg:grid-cols-3"
        >
          {/* Heading cell — spans both rows of the left column. */}
          <motion.div
            variants={sectionItem}
            className="bg-[#0A0A0B] px-6 pb-4 pt-12 lg:row-span-2 lg:border-r lg:border-white/10 lg:px-10 lg:py-14"
          >
            <Eyebrow>No migration required</Eyebrow>
            <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Works with everything <span className="text-white/35">you already post to</span>
            </h2>
          </motion.div>

          {/* 1 — the networks themselves */}
          <motion.div variants={sectionItem} className={`${CELL} border-t border-white/10 lg:border-t-0`}>
            <IconRow>
              {PLATFORMS.map((p) => (
                <IconTile key={p}>
                  <SocialIcon platform={p} className="h-[18px] w-[18px]" />
                </IconTile>
              ))}
              <IconTile>
                <span className="text-[11px] font-semibold tracking-tight text-white/50">+2</span>
              </IconTile>
            </IconRow>
            <h3 className="mt-6 font-semibold">Every account you have</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-white/50">
              Fifteen networks, plus email and your own site. Paste a handle, a bare
              domain or a full link — the social block works out the rest and stores
              one canonical URL.
            </p>
          </motion.div>

          {/* 2 — the feed that maintains itself */}
          <motion.div
            variants={sectionItem}
            className={`${CELL} border-t border-white/10 lg:border-l lg:border-t-0`}
          >
            <IconRow>
              <IconTile>
                <SocialIcon platform="youtube" className="h-[18px] w-[18px]" />
              </IconTile>
            </IconRow>
            <h3 className="mt-6 font-semibold">Your latest videos, on their own</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-white/50">
              Point the YouTube block at your channel once. The page pulls your newest
              uploads on a schedule, so it keeps up with you instead of waiting to be
              edited.
            </p>
          </motion.div>

          {/* 3 — the third parties people actually transact through */}
          <motion.div variants={sectionItem} className={`${CELL} border-t border-white/10`}>
            <IconRow>
              <IconTile>
                <SocialIcon platform="spotify" className="h-[18px] w-[18px]" />
              </IconTile>
              <IconTile>
                <CalendarClock className="h-[18px] w-[18px]" />
              </IconTile>
            </IconRow>
            <h3 className="mt-6 font-semibold">The tools you already sell and book with</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-white/50">
              A Spotify embed, a Calendly booking window, and a product block pointing
              at your own checkout. Each URL is checked against the host it claims to
              be, so a look-alike link can&apos;t take its place.
            </p>
          </motion.div>

          {/* 4 — the address */}
          <motion.div
            variants={sectionItem}
            className={`${CELL} border-t border-white/10 lg:border-l`}
          >
            <IconRow>
              <IconTile>
                <Globe className="h-[18px] w-[18px]" />
              </IconTile>
            </IconRow>
            <h3 className="mt-6 font-semibold">Your own domain</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-white/50">
              Point a domain you own at your page and it&apos;s served from there — no
              redirect, no our-name-in-your-URL. On Pro the branding comes off too.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
