import { ChevronsUpDown } from 'lucide-react'
import { ACCENT } from './tokens'

/**
 * The floating text-format toolbar that appears beside a selected phrase:
 * a weight picker plus bold / italic / underline / strikethrough, with italic
 * shown as the active state (matching the italic selected phrase).
 *
 * Purely decorative. Rendered inside the selection box so it tracks the box's
 * right edge; `whitespace-nowrap` and `not-italic` keep it readable no matter
 * what the surrounding headline styling is.
 */
export default function FormatToolbar() {
  return (
    <span className="absolute left-full top-1/2 ml-5 hidden -translate-y-1/2 items-center gap-0.5 whitespace-nowrap rounded-lg border border-white/10 bg-[#17171b] p-1.5 text-[13px] font-medium not-italic leading-none tracking-normal text-white shadow-2xl lg:flex">
      <span className="flex items-center gap-1.5 rounded px-2 py-1.5 text-white/80">
        Semibold
        <ChevronsUpDown className="h-3.5 w-3.5 text-white/40" />
      </span>

      <span className="mx-1 h-4 w-px bg-white/10" />

      <ToolbarKey>B</ToolbarKey>
      <ToolbarKey active>I</ToolbarKey>
      <ToolbarKey>U</ToolbarKey>
      <ToolbarKey>S</ToolbarKey>
    </span>
  )
}

function ToolbarKey({ children, active }: { children: React.ReactNode; active?: boolean }) {
  const label = String(children)
  return (
    <span
      className={`flex h-7 w-7 items-center justify-center rounded ${
        label === 'B' ? 'font-bold' : ''
      } ${label === 'I' ? 'italic' : ''} ${label === 'U' ? 'underline' : ''} ${
        label === 'S' ? 'line-through' : ''
      } ${active ? 'font-semibold' : 'text-white/80'}`}
      style={active ? { backgroundColor: `${ACCENT}26`, color: ACCENT } : undefined}
    >
      {children}
    </span>
  )
}
