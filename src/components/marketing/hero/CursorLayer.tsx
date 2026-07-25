'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import CollabCursor from './CollabCursor'
import { COLLABORATORS, type Collaborator } from './tokens'

/**
 * The floating collaborator layer.
 *
 * Each cursor is three nested motion elements, one job each, which keeps the
 * transforms from fighting over the same property:
 *
 *   parallax  a spring following the pointer, shared by all cursors
 *   entrance  travels in from an offset once, on a delay
 *   route     walks a set of waypoints, holding at each one
 *
 * The route is what makes these read as people. An earlier version drifted each
 * cursor a dozen pixels around a fixed point, which looked like standing still —
 * the movement has to change where the pointer actually *is*. Travelling and then
 * stopping is the other half: continuous motion reads as mechanical, so every
 * waypoint is held before the next journey begins (see `route` in tokens.ts).
 *
 * The parallax is measured against this layer's own box — it's inset-0 of the
 * hero — and the listener is on `window`, because the layer is
 * pointer-events-none and would never receive mousemove itself. Cursors settle
 * back to centre when the pointer leaves the hero, so they don't react to
 * movement further down the page.
 *
 * Nothing here reads `useReducedMotion()`. That hook returns `null` on the server
 * and a boolean on the client, so branching on it — a different tree, or even
 * different props — makes the two renders disagree and React reports a hydration
 * mismatch. `MotionConfig reducedMotion="user"` handles the preference instead.
 */
export default function CursorLayer() {
  const layerRef = useRef<HTMLDivElement | null>(null)

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const parallaxX = useSpring(pointerX, { stiffness: 60, damping: 20, mass: 0.6 })
  const parallaxY = useSpring(pointerY, { stiffness: 60, damping: 20, mass: 0.6 })

  useEffect(() => {
    const layer = layerRef.current
    if (!layer) return

    const onMouseMove = (e: MouseEvent) => {
      const rect = layer.getBoundingClientRect()
      if (e.clientY < rect.top || e.clientY > rect.bottom) {
        pointerX.set(0)
        pointerY.set(0)
        return
      }
      pointerX.set(-((e.clientX - rect.left) / rect.width - 0.5) * 18)
      pointerY.set(-((e.clientY - rect.top) / rect.height - 0.5) * 18)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [pointerX, pointerY])

  return (
    <div ref={layerRef} className="pointer-events-none absolute inset-0 z-10 hidden sm:block" aria-hidden>
      {COLLABORATORS.map((collaborator) => (
        <div
          key={collaborator.name}
          className="absolute"
          style={{ top: collaborator.top, left: collaborator.left }}
        >
          <motion.div style={{ x: parallaxX, y: parallaxY }}>
            <Cursor collaborator={collaborator} />
          </motion.div>
        </div>
      ))}
    </div>
  )
}

const ENTRANCE = 0.72

function Cursor({ collaborator }: { collaborator: Collaborator }) {
  const { name, role, color, facing, fromX, fromY, delay, route, duration } = collaborator

  return (
    // entrance — runs once
    <motion.div
      initial={{ opacity: 0, x: fromX, y: fromY }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: ENTRANCE, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* route — travel to each waypoint, hold, move on */}
      <motion.div
        animate={{ x: route.x, y: route.y }}
        transition={{
          duration: duration / 1000,
          delay: delay / 1000 + ENTRANCE,
          times: route.times,
          repeat: Infinity,
          repeatType: 'loop',
          // easeInOut per leg gives the accelerate-then-settle of a real hand;
          // the holds come from the duplicated waypoints, not from the easing.
          ease: 'easeInOut',
        }}
      >
        <CollabCursor name={name} role={role} color={color} facing={facing} />
      </motion.div>
    </motion.div>
  )
}
