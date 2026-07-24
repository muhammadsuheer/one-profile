'use client'

import { useEffect } from 'react'

/**
 * Last-resort boundary: catches errors thrown by the ROOT layout itself,
 * which the segment-level error.tsx cannot reach. Must render its own
 * <html>/<body> because it replaces the whole document on failure.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: 32,
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          color: '#0a0a0a',
          background: '#fafafa',
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
          Something went wrong
        </h1>
        <p style={{ maxWidth: 360, fontSize: 14, color: '#737373', margin: 0 }}>
          An unexpected error occurred. Please try again — if it keeps happening, come back in a
          moment.
        </p>
        <button
          onClick={reset}
          style={{
            borderRadius: 8,
            border: 'none',
            background: '#171717',
            color: '#fff',
            padding: '8px 16px',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
