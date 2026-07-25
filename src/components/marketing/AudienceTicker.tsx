'use client'

import { useEffect, useRef, useState } from 'react'
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
 * Driven by `useAnimationFrame` advancing a motion value that's wrapped back
 * into range, rather than by an animation that plays to an end and restarts.
 * That distinction is the whole point: a keyframed or `animate`-to-`-100%`
 * version has a defined end, so it depends on the reset landing exactly where
 * the previous cycle began — which is where the earlier CSS attempts kept coming
 * apart. Here the position simply wraps within [-copyWidth, 0], so there is no
 * cycle boundary to get wrong and no percentage resolving against intrinsic
 * parent sizing.
 *
 * The wrap distance is one copy's measured width (including its trailing
 * padding, so the spacing across the seam matches the spacing everywhere else).
 * Three copies are rendered so the row still covers very wide viewports at the
 * moment the position wraps.
 *
 * Scroll velocity feeds into the speed, and reverses direction on scroll-up.
 * That's what stops it reading as a detached loop — it responds to the page.
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
  const copyRef = useRef<HTMLUListElement | null>(null)
  const [copyWidth, setCopyWidth] = useState(0)

  // One copy's width is the wrap distance. Measured rather than assumed, and
  // re-measured on resize, because it changes with the font and the viewport.
  useEffect(() => {
    const el = copyRef.current
    if (!el) return
    const measure = () => setCopyWidth(el.getBoundingClientRect().width)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const baseX = useMotionValue(0)
  const x = useTransform(baseX, (value) =>
    copyWidth ? `${wrap(-copyWidth, 0, value)}px` : '0px',
  )

  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, 4], { clamp: false })

  const direction = useRef(-1)
  useAnimationFrame((_, delta) => {
    if (reduceMotion || !copyWidth) return

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
    >
      <motion.div className="flex" style={{ x }}>
        <AudienceList ref={copyRef} />
        <AudienceList duplicate />
        <AudienceList duplicate />
      </motion.div>
    </div>
  )
}

function AudienceList({
  ref,
  duplicate,
}: {
  ref?: React.Ref<HTMLUListElement>
  duplicate?: boolean
}) {
  return (
    // The trailing padding matches the gap, so the spacing where one copy meets
    // the next is the same as the spacing within a copy.
    <ul
      ref={ref}
      className="flex shrink-0 items-center gap-12 pr-12"
      aria-hidden={duplicate || undefined}
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
    </ul>
  )
}
