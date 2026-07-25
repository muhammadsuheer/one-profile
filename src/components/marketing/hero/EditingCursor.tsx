'use client'

import { motion } from 'motion/react'
import { ACCENT } from './tokens'

/**
 * The pointer resting on the selected phrase, drifting slowly so the scene feels
 * alive even if the visitor never moves their mouse.
 *
 * Its own small client component so the headline around it can stay a server
 * component. The resting offset is a margin rather than a transform, because
 * Motion owns this element's transform — a translate here would be overwritten.
 * A positive offset keeps the arrow tip just outside the box's corner; pulling it
 * inward puts the tip on top of the border and the corner handle, which reads as
 * clutter rather than as a pointer resting on the selection.
 */
export default function EditingCursor() {
  return (
    <motion.span
      className="absolute left-full top-full ml-1 mt-1 hidden select-none items-start sm:flex"
      animate={{ x: [0, 5, 0, -4, 0], y: [0, -4, 3, 0, 0] }}
      transition={{ duration: 6.4, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
    >
      <svg
        width="20"
        height="22"
        viewBox="0 0 20 22"
        fill="none"
        className="shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]"
      >
        <path
          d="M2.5 1.8 L2.5 19.4 L8.2 13.9 L17 11.2 Z"
          fill={ACCENT}
          stroke="#08080A"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="ml-1.5 mt-2 whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold not-italic leading-none tracking-normal text-white shadow-lg"
        style={{ backgroundColor: ACCENT }}
      >
        Aria · Musician
      </span>
    </motion.span>
  )
}
