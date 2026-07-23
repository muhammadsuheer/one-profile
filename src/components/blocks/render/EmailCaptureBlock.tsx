'use client'

import { useState } from 'react'
import type { BlockDataOf } from '@/lib/blocks/schemas'

export function EmailCaptureBlock({ id, data }: { id: string; data: BlockDataOf<'emailCapture'> }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockId: id, email }),
      })
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      if (res.ok) {
        setStatus('done')
        setEmail('')
      } else {
        setStatus('error')
        setError(json.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setError('Network error. Please try again.')
    }
  }

  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
      <p className="text-center text-[15px] font-semibold text-[var(--text)]">{data.heading}</p>

      {status === 'done' ? (
        <p className="mt-3 text-center text-sm text-[var(--text-muted)]">{data.successMessage}</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={data.placeholder}
            className="h-11 rounded-[var(--radius-btn)] bg-[var(--bg)] px-3.5 text-sm text-[var(--text)] outline-none ring-1 ring-inset ring-[var(--border)] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--accent)]"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="h-11 rounded-[var(--radius-btn)] bg-[var(--accent)] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {status === 'loading' ? 'Subscribing…' : data.buttonLabel}
          </button>
          {status === 'error' && <p className="text-center text-xs text-red-400">{error}</p>}
        </form>
      )}
    </div>
  )
}
