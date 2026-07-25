'use client'

import { useEffect, useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'motion/react'
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
 * Position is advanced in `useAnimationFrame` and wrapped into
 * [-copyWidth, 0], rather than animated to an end and restarted. That's the
 * point: a version with a defined cycle depends on the reset landing exactly
 * where the previous one began, which is where the earlier CSS attempts came
 * apart. Wrapping has no cycle boundary to get wrong.
 *
 * The wrap distance is one copy's measured width — measured, because it depends
 * on the font and the viewport, and re-measured on resize. It's read off the
 * track's first child rather than by handing a ref down into the list component.
 *
 * The measurement lives in a ref, not in state, and that's the important part.
 * Both the transform and the frame callback are held by Motion, so if they closed
 * over a `copyWidth` from state they'd keep whatever it was on the first render —
 * zero, before the DOM had been measured. The transform would then return the
 * same value forever while the frame loop cheerfully advanced `baseX`: movement
 * computed, nothing on screen, and nothing in the console to say why. Reading
 * through a ref means both always see the current width.
 *
 * Three copies are rendered so a wide viewport is still covered at the moment the
 * position wraps.
 *
 * Scroll velocity feeds the speed and reverses direction on scroll-up, so the row
 * responds to the page instead of looping in isolation. `useReducedMotion` is
 * read here rather than left to MotionConfig, because this is a hand-driven loop
 * that Motion doesn't know about — but it's only used inside the frame callback,
 * never to change what renders, so it can't cause a hydration mismatch.
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

/** Resting speed, px/sec. */
const BASE_SPEED = 46

export default function AudienceTicker() {
  const reduceMotion = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)

  // Read by Motion-held callbacks, so these must be refs — see the note above.
  const copyWidth = useRef(0)
  const paused = useRef(false)
  const stopped = useRef(false)
  stopped.current = !!reduceMotion

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const measure = () => {
      const firstCopy = track.firstElementChild
      if (firstCopy) copyWidth.current = firstCopy.getBoundingClientRect().width
    }
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(track)
    return () => observer.disconnect()
  }, [])

  const baseX = useMotionValue(0)
  const x = useTransform(baseX, (value) => {
    const width = copyWidth.current
    return width ? wrap(-width, 0, value) : 0
  })

  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, 4], { clamp: false })

  const direction = useRef(-1)
  useAnimationFrame((_, delta) => {
    if (stopped.current || paused.current || !copyWidth.current) return

    let moveBy = direction.current * BASE_SPEED * (delta / 1000)

    const factor = velocityFactor.get()
    if (factor < 0) direction.current = 1
    else if (factor > 0) direction.current = -1

    moveBy += moveBy * Math.abs(factor)
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div
      className="flex overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)',
      }}
      onMouseEnter={() => {
        paused.current = true
      }}
      onMouseLeave={() => {
        paused.current = false
      }}
    >
      <motion.div ref={trackRef} className="flex" style={{ x }}>
        <AudienceList />
        <AudienceList duplicate />
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
