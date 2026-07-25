import EditingCursor from './EditingCursor'
import FormatToolbar from './FormatToolbar'
import SelectionHandles from './SelectionHandles'
import { ACCENT } from './tokens'

/**
 * A headline phrase rendered as a *selected* text box, the way it looks inside
 * a visual editor.
 *
 * The border is positioned by `.fp-selection-box` (globals.css), which anchors
 * it to the glyph ink rather than to the inline line box — an all-lowercase
 * phrase has no ascenders, so a line-box-aligned border would leave a big empty
 * band above the text. See that rule for the derivation; it depends on the
 * headline's leading-[1.5].
 *
 * The toolbar and the editing cursor live inside the border element, so both
 * track its edges automatically.
 */
export default function SelectedPhrase({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block px-[0.34em] italic" style={{ color: ACCENT }}>
      {children}

      <span
        className="fp-selection-box pointer-events-none absolute rounded-[2px] border"
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
