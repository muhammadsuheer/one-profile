'use client'

import type { BlockData } from '@/lib/blocks/schemas'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { EditField } from '@/components/blocks/edit/field'
import { ImageUploadField } from '@/components/blocks/edit/ImageUploadField'

export function TestimonialEdit({
  data,
  onChange,
}: {
  data: BlockData
  onChange: (data: BlockData) => void
}) {
  if (data.type !== 'testimonial') return null

  return (
    <div className="space-y-3">
      <EditField label="Quote">
        <Textarea
          value={data.quote}
          rows={3}
          maxLength={500}
          placeholder="Working with them was incredible…"
          onChange={(e) => onChange({ ...data, quote: e.target.value })}
        />
      </EditField>
      <div className="grid grid-cols-2 gap-3">
        <EditField label="Author">
          <Input
            value={data.author ?? ''}
            maxLength={80}
            onChange={(e) => onChange({ ...data, author: e.target.value })}
          />
        </EditField>
        <EditField label="Role / company">
          <Input
            value={data.role ?? ''}
            maxLength={80}
            onChange={(e) => onChange({ ...data, role: e.target.value })}
          />
        </EditField>
      </div>
      <ImageUploadField
        label="Author avatar (optional)"
        value={data.avatarUrl ?? ''}
        onChange={(url) => onChange({ ...data, avatarUrl: url })}
      />
    </div>
  )
}
