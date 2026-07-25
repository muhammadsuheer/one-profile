import SelectedPhrase from './SelectedPhrase'

/**
 * The hero headline.
 *
 * `leading-[1.5]` is load-bearing, not taste: the selected phrase draws its
 * box as its own line box, so the line height *is* the box's vertical padding.
 * Tight leading would clamp the box onto the glyphs and crowd the line above;
 * 1.5 gives the box even breathing room and keeps the two lines clearly
 * separated. The column is capped at max-w-3xl so the copy breaks into two
 * balanced lines and the side margins stay free for the collaborator cursors.
 */
export default function HeroHeadline({ cursorRef }: { cursorRef?: React.Ref<HTMLSpanElement> }) {
  return (
    <h1 className="mx-auto max-w-3xl text-balance text-center text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.5] tracking-[-0.02em] text-white">
      Put everything you are on{' '}
      <SelectedPhrase cursorRef={cursorRef}>one page</SelectedPhrase>
    </h1>
  )
}
