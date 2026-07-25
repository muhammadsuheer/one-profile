'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight } from 'lucide-react'

/**
 * The strip above the nav row, cycling through a few things worth knowing about.
 * It scrolls away with the rest of the header rather than staying pinned.
 *
 * The row has a fixed height and the message is absolutely centred inside it, so
 * swapping messages never shifts the page and the outgoing and incoming copies
 * can overlap during the crossfade. AnimatePresence with `mode="wait"` lets the
 * old message leave before the new one arrives. Index starts at 0, so the server
 * and the first client render agree and there's no hydration mismatch.
 *
 * Deep wine rather than full-strength brand pink: the hero below spends that
 * accent on the selected phrase and the primary CTA, and a third saturated band
 * up here made all three compete. The small tag pill carries the colour instead.
 */
const ANNOUNCEMENTS = [
  { tag: 'New', text: 'Connect your own custom domain in one click', href: '/pricing' },
  { tag: 'Pro', text: 'Let AI write your bio and taglines for you', href: '/pricing' },
  { tag: 'Tip', text: 'See exactly which links your audience taps', href: '/blog' },
]

const ROTATE_MS = 5200

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion) return
    const id = setInterval(() => setIndex((v) => (v + 1) % ANNOUNCEMENTS.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [reduceMotion])

  const item = ANNOUNCEMENTS[index]

  return (
    <Link
      href={item.href}
      className="group relative block overflow-hidden border-b border-white/[0.06] bg-gradient-to-r from-[#180910] via-[#4a1023] to-[#180910]"
    >
      {/* soft highlight so the band reads as lit from above rather than flat */}
      <span
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_140%_at_50%_-20%,rgba(255,255,255,0.1),transparent_70%)]"
        aria-hidden
      />

      <div className="relative mx-auto flex h-11 max-w-7xl items-center justify-center px-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={index}
            className="absolute flex items-center gap-2.5 px-5 text-center text-sm text-white/80"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="hidden rounded-full bg-[#F5124A] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white sm:inline">
              {item.tag}
            </span>
            <span className="truncate">{item.text}</span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </motion.span>
        </AnimatePresence>
      </div>
    </Link>
  )
}
