'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
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
 * The "who it's for" row, as a continuous ticker.
 *
 * Two identical copies sit side by side and the track slides left by exactly one
 * copy's width, then repeats. At the moment it repeats the second copy occupies
 * where the first began, so the jump back is invisible.
 *
 * The distance is a measured pixel value held in state, and the animation is
 * declared through the `animate` prop. Both of those are deliberate, because the
 * two obvious alternatives each failed:
 *
 * - A percentage (`x: '-50%'`) resolves against the track's own width, and the
 *   track is a flex item, so `flex-shrink` leaves that width dependent on the
 *   container rather than on the content. `w-max shrink-0` pins it, but a
 *   measured pixel value doesn't depend on getting that right.
 * - Driving it from `useAnimationFrame` meant the loop and the transform both
 *   read the width from a closure Motion holds onto, so they kept the value from
 *   the render that created them — zero, before anything had been measured.
 *   Movement was computed every frame and nothing moved, with nothing in the
 *   console to explain it.
 *
 * Width in state (not a ref) is what makes the prop-driven version correct: the
 * measurement re-renders the component, so Motion sees a new target and starts
 * animating. Duration is derived from the width so the speed stays constant no
 * matter how wide the row gets.
 *
 * Styling is deliberately near-silent: monochrome, no pill chrome, low opacity.
 * This is supporting material; the accent belongs to the selected phrase and the
 * primary button. An earlier version gave each item a bordered pill and a
 * brand-pink icon, putting twelve saturated accents on screen that pulled more
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

/** px per second */
const SPEED = 46

export default function AudienceTicker() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [copyWidth, setCopyWidth] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const measure = () => {
      const firstCopy = track.firstElementChild
      if (firstCopy) {
        const { width } = firstCopy.getBoundingClientRect()
        if (width > 0) setCopyWidth(width)
      }
    }
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(track)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className="flex overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)',
      }}
    >
      <motion.div
        ref={trackRef}
        // w-max and shrink-0 keep the track sized by its content; as a flex item
        // it would otherwise be free to shrink toward the container's width.
        className="flex w-max shrink-0"
        animate={copyWidth ? { x: [0, -copyWidth] } : undefined}
        transition={{
          duration: copyWidth / SPEED,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        <AudienceList />
        <AudienceList duplicate />
      </motion.div>
    </div>
  )
}

function AudienceList({ duplicate }: { duplicate?: boolean }) {
  return (
    // The trailing padding matches the gap, so the spacing where one copy meets
    // the next is the same as the spacing within a copy.
    <ul className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={duplicate || undefined}>
      {AUDIENCES.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap text-sm font-medium text-white/35 transition-colors hover:text-white/70"
        >
          <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
          {label}
        </li>
      ))}
    </ul>
  )
}
