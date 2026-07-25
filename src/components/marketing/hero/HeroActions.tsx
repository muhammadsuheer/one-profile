'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { ACCENT } from './tokens'

/**
 * Hero call to action: one unmistakable primary button, with the secondary path
 * demoted to a quiet text link underneath. A single loud button reads far more
 * decisively than two competing ones — the reference does the same.
 *
 * The press feedback is Motion, not Tailwind's `hover:scale-*`. Those utilities
 * compile to `scale: var(--tw-scale-x) …`, and those custom properties are
 * declared `syntax: "*"`, which isn't interpolatable — so the hover snapped to its
 * end value instead of easing, if it moved at all. A spring on `whileHover` /
 * `whileTap` is what makes the button feel immediate under the cursor.
 */
export default function HeroActions() {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        whileHover={{ scale: 1.035 }}
        whileTap={{ scale: 0.975 }}
        transition={{ type: 'spring', stiffness: 500, damping: 26, mass: 0.7 }}
      >
        <Link
          href="/signup"
          className="inline-flex items-center gap-2.5 rounded-xl px-7 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_0_44px_-10px_rgba(245,18,74,0.85)]"
          style={{ backgroundColor: ACCENT }}
        >
          Start building free
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </motion.div>

      <Link
        href="/ava"
        className="mt-4 text-sm text-white/45 underline-offset-4 transition-colors hover:text-white/80 hover:underline"
      >
        or see a live example
      </Link>
    </div>
  )
}
