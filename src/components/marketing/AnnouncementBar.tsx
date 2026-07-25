'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'

/**
 * The pinned strip above the navbar, cycling through a few things worth
 * knowing about.
 *
 * The row has a fixed height and the message is centred inside it, so swapping
 * messages never shifts the page. The active message is keyed by index, which
 * remounts it and replays the `.fp-announce` entrance — cheaper and steadier
 * than cross-fading stacked copies. Index starts at 0, so the server and the
 * first client render agree and there's no hydration mismatch.
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

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setIndex((v) => (v + 1) % ANNOUNCEMENTS.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [])

  const item = ANNOUNCEMENTS[index]

  return (
    <Link
      href={item.href}
      className="group relative z-20 block overflow-hidden border-b border-white/[0.06] bg-gradient-to-r from-[#180910] via-[#4a1023] to-[#180910]"
    >
      {/* soft highlight so the band reads as lit from above rather than flat */}
      <span
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_140%_at_50%_-20%,rgba(255,255,255,0.1),transparent_70%)]"
        aria-hidden
      />

      <div className="relative mx-auto flex h-11 max-w-7xl items-center justify-center px-5">
        <span
          key={index}
          className="fp-announce flex items-center gap-2.5 text-center text-sm text-white/80"
        >
          <span className="hidden rounded-full bg-[#F5124A] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white sm:inline">
            {item.tag}
          </span>
          <span className="truncate">{item.text}</span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}
