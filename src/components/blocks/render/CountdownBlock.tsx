'use client'

import { useEffect, useState } from 'react'
import type { BlockDataOf } from '@/lib/blocks/schemas'

type Parts = { days: number; hours: number; minutes: number; seconds: number }

function diffParts(target: number, now: number): Parts | null {
  const ms = target - now
  if (ms <= 0) return null
  const s = Math.floor(ms / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="min-w-[2.5ch] text-center text-2xl font-bold tabular-nums text-[var(--text)]">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </span>
    </div>
  )
}

export function CountdownBlock({ data }: { id: string; data: BlockDataOf<'countdown'> }) {
  const target = data.targetDate ? new Date(data.targetDate).getTime() : NaN
  const valid = Number.isFinite(target)

  // Start null to keep SSR/first-client render identical (avoids hydration mismatch);
  // fill in on mount, then tick every second.
  const [parts, setParts] = useState<Parts | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!valid) return
    setMounted(true)
    const tick = () => setParts(diffParts(target, Date.now()))
    tick()
    const iv = setInterval(tick, 1000)
    return () => clearInterval(iv)
  }, [target, valid])

  if (!valid) return null

  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--surface)] p-5 text-center">
      {data.title && (
        <p className="mb-3 text-[15px] font-semibold text-[var(--text)]">{data.title}</p>
      )}
      {!mounted ? (
        <p className="text-sm text-[var(--text-muted)]">Loading…</p>
      ) : parts ? (
        <div className="flex items-start justify-center gap-4">
          <Unit value={parts.days} label="Days" />
          <Unit value={parts.hours} label="Hrs" />
          <Unit value={parts.minutes} label="Min" />
          <Unit value={parts.seconds} label="Sec" />
        </div>
      ) : (
        <p className="text-lg font-semibold text-[var(--text)]">{data.expiredText}</p>
      )}
    </div>
  )
}
