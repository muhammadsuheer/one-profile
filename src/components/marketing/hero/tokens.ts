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
 */
export const COLLABORATORS: Collaborator[] = [
  { name: 'Devon', role: 'Creator', color: '#a78bfa', top: '30%', left: '4%', facing: 'right', fromX: -64, fromY: -22, delay: 300, radius: 20, period: 7600 },
  { name: 'Zoe', role: 'Coach', color: '#fbbf24', top: '66%', left: '10%', facing: 'right', fromX: -54, fromY: 40, delay: 460, radius: 14, period: 8400 },
  { name: 'Kai', role: 'Founder', color: '#34d399', top: '58%', left: '78%', facing: 'left', fromX: 58, fromY: 34, delay: 600, radius: 16, period: 10000 },
]
