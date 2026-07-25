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
 * The collaborators floating in the side margins. A fourth — Aria, the one
 * "editing" the selected phrase — is rendered on the selection box itself by
 * SelectedPhrase, so four people are on screen in total.
 *
 * Vertical placement is bounded: the corner cards occupy roughly the bottom
 * 26% of the hero at lg, and a cursor is ~46px tall plus up to `radius` of
 * drift, so these all rest above ~60% to stay clear of them. Horizontally they
 * sit outside the centred max-w-3xl headline column.
 */
export const COLLABORATORS: Collaborator[] = [
  { name: 'Devon', role: 'Creator', color: '#a78bfa', top: '24%', left: '3%', facing: 'right', fromX: -64, fromY: -22, delay: 300, radius: 18, period: 7600 },
  { name: 'Zoe', role: 'Coach', color: '#fbbf24', top: '57%', left: '7%', facing: 'right', fromX: -54, fromY: 36, delay: 460, radius: 13, period: 8400 },
  { name: 'Kai', role: 'Founder', color: '#34d399', top: '38%', left: '79%', facing: 'left', fromX: 58, fromY: 30, delay: 600, radius: 15, period: 10000 },
]
