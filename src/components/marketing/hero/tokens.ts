/**
 * Shared design tokens for the hero. Every hero sub-component reads its colors
 * and collaborator data from here, so the whole composition stays in one
 * palette and positions can be tuned in a single place.
 */

/** Brand accent — the single highlight color of the whole hero. */
export const ACCENT = '#F5124A'

/**
 * Hero background + card surfaces. SURFACE must match the hero's own background,
 * because the selection handles and the cursor pills are filled with it to punch
 * themselves out of whatever they sit on top of.
 */
export const SURFACE = '#0A0A0B'
export const CARD = '#101014'

export type Collaborator = {
  name: string
  role: string
  color: string
  /** Rest position, in % of the hero box. Kept in the side margins so a
   *  cursor never lands on top of the headline. */
  top: string
  left: string
  /** Cursor arrow direction — right-side cursors point up-left, left-side
   *  cursors are mirrored so they always "point at" the content. */
  facing: 'left' | 'right'
  /** Where it travels in from on load (px offset from the rest position). */
  fromX: number
  fromY: number
  /** Entrance delay (ms). */
  delay: number
  /** Idle loop radius (px) and period (ms). */
  radius: number
  period: number
}

/**
 * The collaborators floating around the copy. A fourth — Aria, the one
 * "editing" the selected phrase — is rendered on the selection box itself by
 * SelectedPhrase, so four people are on screen in total.
 *
 * The layout rule that keeps this scene legible is a horizontal split: the
 * cursors live in the upper band and the corner cards in the lower one, with a
 * clear gap between. That's what the reference does, and it's why nothing there
 * looks piled up. Previously the cursors sat at 50-54% while the cards were
 * pinned to the bottom corners, so both fought for the same strip — the pills
 * ended up tucked behind the cards.
 *
 * So: every cursor rests **above ~52%** (a cursor is ~46px tall plus up to
 * `radius` of drift), and the cards start below ~68%. Within that band each
 * cursor hugs the line it belongs to rather than being pushed to the frame edge,
 * which is what reads as "these people are working on this" and leaves the outer
 * margins genuinely empty:
 *
 *   Kai   beside the end of headline line 1
 *   Devon beside the start of headline line 2 (the shorter line)
 *   Zoe   beside the sub-heading
 *
 * One more constraint: a pill is ~165px wide, so it must not reach into the line
 * it sits next to. That's what caps how far in these can move.
 */
export const COLLABORATORS: Collaborator[] = [
  { name: 'Kai', role: 'Founder', color: '#34d399', top: '18%', left: '77%', facing: 'left', fromX: 58, fromY: -28, delay: 300, radius: 16, period: 10000 },
  { name: 'Devon', role: 'Creator', color: '#a78bfa', top: '34%', left: '19%', facing: 'right', fromX: -60, fromY: -20, delay: 460, radius: 16, period: 7600 },
  { name: 'Zoe', role: 'Coach', color: '#fbbf24', top: '50%', left: '16%', facing: 'right', fromX: -52, fromY: 30, delay: 620, radius: 13, period: 8400 },
]
