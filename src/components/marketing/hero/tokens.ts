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
  /**
   * The route this person's pointer takes, as px offsets from the rest position.
   *
   * Each waypoint is listed twice so the pointer travels to it and then holds
   * there. Moving, stopping, then moving again is what makes it read as a hand
   * rather than as something orbiting on a loop — the previous version drifted a
   * dozen pixels continuously and looked like it was standing still.
   *
   * `times` sets that rhythm: the interval between a duplicated pair is the
   * dwell, the interval between pairs is the journey. All three arrays must be
   * the same length, and x/y must start and end at 0 so the route closes without
   * a jump.
   */
  route: { x: number[]; y: number[]; times: number[] }
  /** How long one full route takes (ms). */
  duration: number
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
 * So each cursor's rest position sits in the upper band, and its route is shaped
 * to stay there — the cards begin below ~68%, and a cursor is ~46px tall, so the
 * routes push upward and sideways rather than down. Within that band each one
 * works near the line it belongs to, which is what reads as "these people are
 * working on this" and leaves the outer margins genuinely empty:
 *
 *   Kai   beside the end of headline line 1
 *   Devon beside the start of headline line 2 (the shorter line)
 *   Zoe   beside the sub-heading
 *
 * One more constraint: a pill is ~165px wide, so neither the rest position nor
 * any waypoint may carry it into the line it sits beside. That's what caps how
 * far the routes reach inward.
 */
export const COLLABORATORS: Collaborator[] = [
  {
    name: 'Kai',
    role: 'Founder',
    color: '#34d399',
    top: '18%',
    left: '77%',
    facing: 'left',
    fromX: 64,
    fromY: -30,
    delay: 140,
    duration: 21000,
    route: {
      x: [0, 46, 46, 18, 18, 74, 74, 0],
      y: [0, 62, 62, 118, 118, 44, 44, 0],
      times: [0, 0.13, 0.27, 0.4, 0.55, 0.68, 0.85, 1],
    },
  },
  {
    name: 'Devon',
    role: 'Creator',
    color: '#a78bfa',
    top: '34%',
    left: '19%',
    facing: 'right',
    fromX: -64,
    fromY: -22,
    delay: 300,
    duration: 24000,
    route: {
      x: [0, -38, -38, 26, 26, -14, -14, 0],
      y: [0, -74, -74, -108, -108, -34, -34, 0],
      times: [0, 0.15, 0.3, 0.43, 0.58, 0.72, 0.88, 1],
    },
  },
  {
    name: 'Zoe',
    role: 'Coach',
    color: '#fbbf24',
    top: '50%',
    left: '16%',
    facing: 'right',
    fromX: -56,
    fromY: 28,
    delay: 440,
    duration: 19000,
    route: {
      x: [0, 52, 52, -30, -30, 20, 20, 0],
      y: [0, -56, -56, -96, -96, -28, -28, 0],
      times: [0, 0.12, 0.28, 0.42, 0.56, 0.7, 0.86, 1],
    },
  },
]
