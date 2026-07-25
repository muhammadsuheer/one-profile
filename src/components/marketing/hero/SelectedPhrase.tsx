import EditingCursor from './EditingCursor'
import FormatToolbar from './FormatToolbar'
import SelectionHandles from './SelectionHandles'
import { ACCENT } from './tokens'

/**
 * A headline phrase rendered as a *selected* text box, the way it looks inside
 * a visual editor.
 *
 * The box is `inset-0` of the inline-block — its own line box — so the
 * headline's `leading` is what sets the box's vertical padding, and it scales
 * correctly at every clamp() font size with no hand-tuned insets (see
 * HeroHeadline). The toolbar and the editing cursor live inside the box, so
 * both track its edges automatically.
 */
export default function SelectedPhrase({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block px-[0.3em] italic" style={{ color: ACCENT }}>
      {children}

      <span
        className="pointer-events-none absolute inset-0 rounded-[2px] border"
        style={{ borderColor: ACCENT }}
        aria-hidden
      >
        <SelectionHandles />
        <FormatToolbar />
        <EditingCursor />
      </span>
    </span>
  )
}
