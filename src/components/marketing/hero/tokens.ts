/**
 * Shared design tokens for the hero. Every hero sub-component reads its colors
 * and collaborator data from here, so the whole composition stays in one
 * palette and positions can be tuned in a single place.
 */

/** Brand accent — the single highlight color of the whole hero. */
export const ACCENT = '#F5124A'

/** Hero background + card surfaces. */
export const SURFACE = '#08080A'
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
 * Each one is tucked just outside the line it sits beside, not pushed out to
 * the frame edge: hugging the text is what reads as "these people are working
 * on this", and it leaves the outer margins genuinely empty, which is where the
 * composition gets its air. Positions are therefore tied to specific lines —
 *
 *   Kai   beside the end of headline line 1 (which runs to ~75%)
 *   Devon beside the start of headline line 2 (the shorter line, from ~30%)
 *   Zoe   beside the sub-heading (max-w-lg, from ~30%)
 *
 * Two constraints to preserve when moving these: a pill is ~165px wide, so it
 * must not reach into the line it sits next to; and the corner cards occupy
 * roughly the bottom quarter of the hero at lg, so every cursor rests above
 * ~60% (a cursor is ~46px tall plus up to `radius` of drift).
 */
export const COLLABORATORS: Collaborator[] = [
  { name: 'Kai', role: 'Founder', color: '#34d399', top: '22%', left: '77%', facing: 'left', fromX: 58, fromY: -28, delay: 300, radius: 16, period: 10000 },
  { name: 'Devon', role: 'Creator', color: '#a78bfa', top: '34%', left: '15%', facing: 'right', fromX: -60, fromY: -20, delay: 460, radius: 16, period: 7600 },
  { name: 'Zoe', role: 'Coach', color: '#fbbf24', top: '50%', left: '11%', facing: 'right', fromX: -52, fromY: 34, delay: 620, radius: 13, period: 8400 },
]
