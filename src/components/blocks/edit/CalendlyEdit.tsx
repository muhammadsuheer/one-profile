'use client'

import type { BlockData } from '@/lib/blocks/schemas'
import { Input } from '@/components/ui/input'
import { EditField } from '@/components/blocks/edit/field'
import { parseCalendly } from '@/lib/calendly'

export function CalendlyEdit({
  data,
  onChange,
}: {
  data: BlockData
  onChange: (data: BlockData) => void
}) {
  if (data.type !== 'calendly') return null

  const invalid = data.url.trim().length > 0 && !parseCalendly(data.url)

  return (
    <div className="space-y-3">
      <EditField label="Title (optional)">
        <Input
          value={data.title ?? ''}
          maxLength={120}
          placeholder="Book a call"
          onChange={(e) => onChange({ ...data, title: e.target.value })}
        />
      </EditField>
      <EditField label="Calendly link">
        <Input
          value={data.url}
          inputMode="url"
          placeholder="https://calendly.com/you/30min"
          onChange={(e) => onChange({ ...data, url: e.target.value })}
        />
      </EditField>
      {invalid ? (
        <p className="text-xs font-medium text-red-600">
          Enter a valid calendly.com scheduling link.
        </p>
      ) : (
        <p className="text-xs text-neutral-400">
          Paste your public Calendly link and visitors can book right on your page.
        </p>
      )}
    </div>
  )
}
