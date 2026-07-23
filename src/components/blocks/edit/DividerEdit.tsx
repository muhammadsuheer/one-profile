'use client'

import type { BlockData } from '@/lib/blocks/schemas'
import { Input } from '@/components/ui/input'
import { EditField } from '@/components/blocks/edit/field'

export function DividerEdit({
  data,
  onChange,
}: {
  data: BlockData
  onChange: (data: BlockData) => void
}) {
  if (data.type !== 'divider') return null

  return (
    <EditField label="Label (optional)" hint="Leave empty for a plain line.">
      <Input
        value={data.label ?? ''}
        maxLength={60}
        placeholder="Section title"
        onChange={(e) => onChange({ ...data, label: e.target.value })}
      />
    </EditField>
  )
}
