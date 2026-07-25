import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

/**
 * Favicon: the real mark, not an approximation of it.
 *
 * This shipped a letter "O" long after the rebrand from OnePage — the browser tab
 * was the last surface still carrying the old name. It briefly carried a mark
 * drawn by hand in rects, which was closer but still wasn't the logo; it now
 * renders `public/brand/mark.png` so the tab icon and the in-app logo can't drift
 * apart.
 *
 * Read off disk and inlined as a data URI because Satori (what ImageResponse runs
 * on) needs the bytes rather than a relative path — a path like `/brand/mark.png`
 * has no origin to resolve against here. PNG rather than the WebP the rest of the
 * app uses, since Satori's image support doesn't cover WebP.
 *
 * The tile is white. The mark is crimson over a dark maroon, and the maroon goes
 * muddy against our near-black surface at 16px — the light tile keeps both halves
 * legible without touching the artwork's colours.
 */
export default function Icon() {
  const mark = readFileSync(join(process.cwd(), 'public/brand/mark.png'))
  const src = `data:image/png;base64,${mark.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          borderRadius: 7,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={19} height={20} alt="" />
      </div>
    ),
    { ...size },
  )
}
