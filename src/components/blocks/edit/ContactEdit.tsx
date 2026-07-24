'use client'

import type { BlockData } from '@/lib/blocks/schemas'
import { Input } from '@/components/ui/input'
import { EditField } from '@/components/blocks/edit/field'

export function ContactEdit({
  data,
  onChange,
}: {
  data: BlockData
  onChange: (data: BlockData) => void
}) {
  if (data.type !== 'contact') return null

  return (
    <div className="space-y-3">
      <EditField label="Button label">
        <Input
          value={data.label}
          maxLength={40}
          placeholder="Save contact"
          onChange={(e) => onChange({ ...data, label: e.target.value })}
        />
      </EditField>
      <EditField label="Full name">
        <Input
          value={data.fullName}
          maxLength={120}
          placeholder="Jane Doe"
          onChange={(e) => onChange({ ...data, fullName: e.target.value })}
        />
      </EditField>
      <EditField label="Organization (optional)">
        <Input
          value={data.org ?? ''}
          maxLength={120}
          placeholder="Acme Inc."
          onChange={(e) => onChange({ ...data, org: e.target.value })}
        />
      </EditField>
      <div className="grid grid-cols-2 gap-3">
        <EditField label="Phone (optional)">
          <Input
            value={data.phone ?? ''}
            maxLength={40}
            inputMode="tel"
            placeholder="+1 555 123 4567"
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
          />
        </EditField>
        <EditField label="Email (optional)">
          <Input
            value={data.email ?? ''}
            maxLength={160}
            inputMode="email"
            placeholder="jane@example.com"
            onChange={(e) => onChange({ ...data, email: e.target.value })}
          />
        </EditField>
      </div>
      <EditField label="Website (optional)">
        <Input
          value={data.website ?? ''}
          maxLength={300}
          inputMode="url"
          placeholder="https://example.com"
          onChange={(e) => onChange({ ...data, website: e.target.value })}
        />
      </EditField>
    </div>
  )
}
