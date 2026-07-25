/**
 * A collaborator's mouse pointer: a solid triangular wedge (not a classic
 * arrow-with-tail), which is what reads cleanly at this small size against a
 * dark background. `facing` mirrors it horizontally so cursors in the left
 * margin point inward toward the content.
 */
export default function CursorArrow({
  color,
  facing = 'left',
}: {
  color: string
  facing?: 'left' | 'right'
}) {
  return (
    <svg
      width="20"
      height="22"
      viewBox="0 0 20 22"
      fill="none"
      className="shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]"
      style={{ transform: facing === 'right' ? 'scaleX(-1)' : undefined }}
      aria-hidden
    >
      <path
        d="M2.5 1.8 L2.5 19.4 L8.2 13.9 L17 11.2 Z"
        fill={color}
        stroke="#08080A"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}
