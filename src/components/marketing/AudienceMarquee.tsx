'use client'

import { motion, useReducedMotion } from 'motion/react'
import {
  Music,
  Mic,
  HeartHandshake,
  Rocket,
  Brush,
  PenLine,
  Camera,
  Video,
  Palette,
  BookOpen,
  Dumbbell,
  Presentation,
} from 'lucide-react'

/**
 * The "who it's for" row, as a continuously scrolling marquee.
 *
 * Two identical copies sit side by side and each animates by -100% of its own
 * width. When the first has travelled its own width the second occupies where
 * the first began, so the reset is invisible. The trailing padding matches the
 * gap for the same reason — without it the copies would butt together one gap
 * short and the loop would visibly stutter once per cycle.
 *
 * Motion drives it rather than CSS keyframes. The CSS version had to express the
 * distance as a percentage that resolved against intrinsic parent sizing, and it
 * was fragile; Motion writes the transform directly and just runs.
 *
 * Styling is deliberately near-silent — monochrome, no pill chrome, low opacity.
 * This is a supporting row and the accent belongs to the selected phrase and the
 * primary button. An earlier version gave each item a bordered pill and a
 * brand-pink icon, which put twelve saturated accents on screen pulling more
 * attention than the CTA.
 */
const AUDIENCES = [
  { icon: Music, label: 'Musicians' },
  { icon: Mic, label: 'Podcasters' },
  { icon: HeartHandshake, label: 'Coaches' },
  { icon: Rocket, label: 'Founders' },
  { icon: Brush, label: 'Artists' },
  { icon: PenLine, label: 'Writers' },
  { icon: Camera, label: 'Photographers' },
  { icon: Video, label: 'Streamers' },
  { icon: Palette, label: 'Designers' },
  { icon: BookOpen, label: 'Authors' },
  { icon: Dumbbell, label: 'Trainers' },
  { icon: Presentation, label: 'Speakers' },
]

const DURATION = 32

export default function AudienceMarquee() {
  const reduceMotion = useReducedMotion()

  return (
    <div
      className="flex overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)',
      }}
    >
      <AudienceList animate={!reduceMotion} />
      <AudienceList animate={!reduceMotion} duplicate />
    </div>
  )
}

function AudienceList({ animate, duplicate }: { animate: boolean; duplicate?: boolean }) {
  return (
    <motion.ul
      className="flex shrink-0 items-center gap-12 pr-12"
      aria-hidden={duplicate || undefined}
      animate={animate ? { x: '-100%' } : undefined}
      transition={{ duration: DURATION, ease: 'linear', repeat: Infinity, repeatType: 'loop' }}
    >
      {AUDIENCES.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap text-sm font-medium text-white/35 transition-colors hover:text-white/70"
        >
          <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
          {label}
        </li>
      ))}
    </motion.ul>
  )
}
