'use client'

import { useState } from 'react'
import { CalendarClock, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/** ISO (UTC) -> value for <input type="datetime-local"> in the viewer's local tz. */
function isoToLocalInput(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const off = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - off).toISOString().slice(0, 16)
}

/** datetime-local value (local tz) -> ISO (UTC), or null when cleared. */
function localInputToIso(value: string): string | null {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

export function BlockSchedule({
  visibleFrom,
  visibleUntil,
  onChange,
}: {
  visibleFrom: string | null
  visibleUntil: string | null
  onChange: (from: string | null, until: string | null) => void
}) {
  const scheduled = !!(visibleFrom || visibleUntil)
  const [open, setOpen] = useState(scheduled)

  const invalid =
    visibleFrom && visibleUntil && new Date(visibleFrom).getTime() > new Date(visibleUntil).getTime()

  const now = Date.now()
  let statusLabel = ''
  if (visibleFrom && new Date(visibleFrom).getTime() > now) {
    statusLabel = `Goes live ${new Date(visibleFrom).toLocaleString()}`
  } else if (visibleUntil && new Date(visibleUntil).getTime() < now) {
    statusLabel = `Expired ${new Date(visibleUntil).toLocaleString()}`
  } else if (visibleUntil) {
    statusLabel = `Live until ${new Date(visibleUntil).toLocaleString()}`
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 flex items-center gap-2 text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <CalendarClock className="h-3.5 w-3.5" /> Schedule visibility
      </button>
    )
  }

  return (
    <div className="mt-3 rounded-xl border border-neutral-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
          <CalendarClock className="h-3.5 w-3.5" /> Schedule
        </span>
        {scheduled && (
          <button
            type="button"
            onClick={() => {
              onChange(null, null)
              setOpen(false)
            }}
            className="flex items-center gap-1 text-xs font-medium text-neutral-400 transition-colors hover:text-red-600"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="space-y-1">
          <span className="text-[11px] font-medium text-neutral-500">Show from</span>
          <input
            type="datetime-local"
            value={isoToLocalInput(visibleFrom)}
            onChange={(e) => onChange(localInputToIso(e.target.value), visibleUntil)}
            className="w-full rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-sm text-neutral-900 outline-none focus:border-neutral-900"
          />
        </label>
        <label className="space-y-1">
          <span className="text-[11px] font-medium text-neutral-500">Hide after</span>
          <input
            type="datetime-local"
            value={isoToLocalInput(visibleUntil)}
            onChange={(e) => onChange(visibleFrom, localInputToIso(e.target.value))}
            className={cn(
              'w-full rounded-lg border bg-white px-2.5 py-1.5 text-sm text-neutral-900 outline-none focus:border-neutral-900',
              invalid ? 'border-red-400' : 'border-neutral-200',
            )}
          />
        </label>
      </div>

      {invalid ? (
        <p className="mt-2 text-[11px] font-medium text-red-600">
          &ldquo;Hide after&rdquo; must be later than &ldquo;Show from&rdquo;.
        </p>
      ) : statusLabel ? (
        <p className="mt-2 text-[11px] text-neutral-500">{statusLabel}</p>
      ) : (
        <p className="mt-2 text-[11px] text-neutral-400">
          Leave a field blank for no bound. Times are in your local timezone.
        </p>
      )}
    </div>
  )
}
