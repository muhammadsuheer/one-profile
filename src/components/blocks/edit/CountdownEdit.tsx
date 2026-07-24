'use client'

import type { BlockData } from '@/lib/blocks/schemas'
import { Input } from '@/components/ui/input'
import { EditField } from '@/components/blocks/edit/field'

/** ISO (UTC) -> <input type="datetime-local"> value in local tz. */
function isoToLocalInput(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const off = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - off).toISOString().slice(0, 16)
}

/** datetime-local value (local tz) -> ISO (UTC), or '' when cleared. */
function localInputToIso(value: string): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString()
}

export function CountdownEdit({
  data,
  onChange,
}: {
  data: BlockData
  onChange: (data: BlockData) => void
}) {
  if (data.type !== 'countdown') return null

  return (
    <div className="space-y-3">
      <EditField label="Title (optional)">
        <Input
          value={data.title ?? ''}
          maxLength={120}
          placeholder="Launching in…"
          onChange={(e) => onChange({ ...data, title: e.target.value })}
        />
      </EditField>
      <EditField label="Counts down to">
        <input
          type="datetime-local"
          value={isoToLocalInput(data.targetDate)}
          onChange={(e) => onChange({ ...data, targetDate: localInputToIso(e.target.value) })}
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-900"
        />
      </EditField>
      <EditField label="Text when finished">
        <Input
          value={data.expiredText}
          maxLength={120}
          placeholder="We're live!"
          onChange={(e) => onChange({ ...data, expiredText: e.target.value })}
        />
      </EditField>
    </div>
  )
}
