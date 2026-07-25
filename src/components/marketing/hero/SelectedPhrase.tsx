import FormatToolbar from './FormatToolbar'
import SelectionHandles from './SelectionHandles'
import { ACCENT } from './tokens'

/**
 * A headline phrase rendered as a *selected* text box, the way it looks inside
 * a visual editor.
 *
 * The important detail: the box is simply `inset-0` of the inline-block — its
 * natural line box — and the headline carries a generous `leading` (see
 * HeroHeadline). At leading ~1.5 the line box sits roughly a third of an em
 * above and below the glyphs, which produces even, correctly-scaled padding at
 * every clamp() font size for free. Hand-tuning insets instead looks right at
 * exactly one width and wrong everywhere else — and with an all-lowercase
 * phrase like "one page" (no ascenders, descenders on p/g) it also drifts off
 * center, because the box would follow the font's ascent rather than the ink.
 *
 * The toolbar and the editing cursor live inside the box, so both track its
 * edges automatically.
 */
export default function SelectedPhrase({
  children,
  cursorRef,
}: {
  children: React.ReactNode
  /** The pointer that sits on the box's corner, animated by the parent. */
  cursorRef?: React.Ref<HTMLSpanElement>
}) {
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

        {/* The editing pointer, hanging off the box's bottom-right corner.
            Its offset is a negative margin rather than a translate class: the
            parent animates this element's `transform` directly, which would
            otherwise overwrite a Tailwind translate and make it jump. */}
        <span
          ref={cursorRef}
          className="absolute left-full top-full -ml-2.5 hidden select-none items-start sm:flex"
          style={{ willChange: 'transform' }}
        >
          <svg width="20" height="22" viewBox="0 0 20 22" fill="none" className="shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
            <path d="M2.5 1.8 L2.5 19.4 L8.2 13.9 L17 11.2 Z" fill={ACCENT} stroke="#08080A" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
          <span
            className="ml-1.5 mt-2 whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold not-italic leading-none tracking-normal text-white shadow-lg"
            style={{ backgroundColor: ACCENT }}
          >
            Aria · Musician
          </span>
        </span>
      </span>
    </span>
  )
}
