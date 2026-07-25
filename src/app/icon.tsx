import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

/**
 * Favicon: the mark on the brand accent.
 *
 * This shipped a letter "O" long after the rebrand from OnePage — the tab icon
 * was the only surface still carrying the old name. Drawn with rects rather than
 * text so it stays legible at 16px and doesn't depend on a font being available
 * inside ImageResponse.
 *
 * Once `public/brand/mark.svg` lands, this should render that instead so the
 * favicon and the in-app logo can't drift apart.
 */
export default function Icon() {
  const bar = (
    left: number,
    top: number,
    width: number,
    height: number,
    opacity = 1,
  ) => (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        borderRadius: height / 2,
        background: '#fff',
        opacity,
      }}
    />
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          background: '#F5124A',
          borderRadius: 7,
        }}
      >
        {/* stem */}
        {bar(7, 6, 6, 21)}
        {/* upper arm */}
        {bar(15, 6, 11, 6)}
        {/* lower arm */}
        {bar(15, 15, 7, 6, 0.62)}
      </div>
    ),
    { ...size },
  )
}
