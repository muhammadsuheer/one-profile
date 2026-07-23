'use client'

import type { BlockData } from '@/lib/blocks/schemas'
import { Input } from '@/components/ui/input'
import { EditField } from '@/components/blocks/edit/field'

export function EmailCaptureEdit({
  data,
  onChange,
}: {
  data: BlockData
  onChange: (data: BlockData) => void
}) {
  if (data.type !== 'emailCapture') return null

  return (
    <div className="space-y-3">
      <EditField label="Heading">
        <Input
          value={data.heading}
          maxLength={120}
          onChange={(e) => onChange({ ...data, heading: e.target.value })}
        />
      </EditField>
      <div className="grid grid-cols-2 gap-3">
        <EditField label="Placeholder">
          <Input
            value={data.placeholder}
            maxLength={80}
            onChange={(e) => onChange({ ...data, placeholder: e.target.value })}
          />
        </EditField>
        <EditField label="Button label">
          <Input
            value={data.buttonLabel}
            maxLength={40}
            onChange={(e) => onChange({ ...data, buttonLabel: e.target.value })}
          />
        </EditField>
      </div>
      <EditField label="Success message">
        <Input
          value={data.successMessage}
          maxLength={160}
          onChange={(e) => onChange({ ...data, successMessage: e.target.value })}
        />
      </EditField>
    </div>
  )
}
