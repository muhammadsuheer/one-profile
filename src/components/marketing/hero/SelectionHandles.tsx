import { ACCENT, SURFACE } from './tokens'

/**
 * The four corner resize handles of a selection box: small accent-outlined
 * squares filled with the page background (not white), each centered exactly on
 * its corner so the box border passes through the middle of the handle — the
 * way a real design tool draws them.
 *
 * Renders absolutely-positioned children, so the parent must establish a
 * positioning context.
 */
const SIZE = 8 // px
const HALF = SIZE / 2

const CORNERS = [
  { top: -HALF, left: -HALF },
  { top: -HALF, right: -HALF },
  { bottom: -HALF, left: -HALF },
  { bottom: -HALF, right: -HALF },
] as const

export default function SelectionHandles() {
  return (
    <>
      {CORNERS.map((corner, i) => (
        <span
          key={i}
          className="pointer-events-none absolute rounded-[1px] border"
          style={{
            ...corner,
            width: SIZE,
            height: SIZE,
            borderColor: ACCENT,
            backgroundColor: SURFACE,
          }}
          aria-hidden
        />
      ))}
    </>
  )
}
