import SelectedPhrase from './SelectedPhrase'

/**
 * The hero headline.
 *
 * Two numbers here are load-bearing rather than taste:
 *
 * `leading-[1.4]` is what the selection box's geometry is derived from — if it
 * changes, `--fp-lead` in globals.css must change with it, or the box drifts off
 * the glyphs.
 *
 * `max-w-2xl` keeps the column to roughly half the frame, matching the
 * reference. A wider column eats the side margins the collaborator cursors and
 * corner cards need, which is what previously made them pile onto each other.
 */
export default function HeroHeadline() {
  return (
    <h1 className="mx-auto max-w-2xl text-balance text-center text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.4] tracking-[-0.02em] text-white">
      Put everything you are on{' '}
      <SelectedPhrase>one page</SelectedPhrase>
    </h1>
  )
}
