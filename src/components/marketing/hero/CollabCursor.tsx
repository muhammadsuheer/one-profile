import CursorArrow from './CursorArrow'
import { SURFACE } from './tokens'

/**
 * One collaborator: a pointer with a name pill tucked under it.
 *
 * The pill is an *outlined* chip — dark fill, colored border, colored label —
 * so four of them on screen add identity without four loud blocks of color
 * fighting the headline. The pill sits below the pointer and on the side the
 * pointer is facing away from, so the arrow tip always stays readable.
 */
export default function CollabCursor({
  name,
  role,
  color,
  facing,
}: {
  name: string
  role: string
  color: string
  facing: 'left' | 'right'
}) {
  return (
    <div className={`flex flex-col ${facing === 'right' ? 'items-end' : 'items-start'}`}>
      <CursorArrow color={color} facing={facing} />
      <span
        className="-mt-1 whitespace-nowrap rounded-md border px-2 py-1 text-xs font-semibold leading-none tracking-normal shadow-lg"
        style={{
          color,
          borderColor: color,
          backgroundColor: SURFACE,
          marginLeft: facing === 'left' ? 12 : undefined,
          marginRight: facing === 'right' ? 12 : undefined,
        }}
      >
        {name} · {role}
      </span>
    </div>
  )
}
