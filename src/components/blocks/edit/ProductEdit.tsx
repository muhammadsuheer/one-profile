'use client'

import type { BlockData } from '@/lib/blocks/schemas'
import { Input } from '@/components/ui/input'
import { EditField } from '@/components/blocks/edit/field'
import { ImageUploadField } from '@/components/blocks/edit/ImageUploadField'

export function ProductEdit({
  data,
  onChange,
}: {
  data: BlockData
  onChange: (data: BlockData) => void
}) {
  if (data.type !== 'product') return null

  return (
    <div className="space-y-3">
      <EditField label="Title">
        <Input
          value={data.title}
          maxLength={120}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
        />
      </EditField>
      <div className="grid grid-cols-2 gap-3">
        <EditField label="Price">
          <Input
            type="number"
            min={0}
            step="0.01"
            value={Number.isFinite(data.price) ? data.price : 0}
            onChange={(e) => onChange({ ...data, price: Number(e.target.value) || 0 })}
          />
        </EditField>
        <EditField label="Currency" hint="3-letter code, e.g. USD">
          <Input
            value={data.currency}
            maxLength={3}
            onChange={(e) => onChange({ ...data, currency: e.target.value.toUpperCase() })}
          />
        </EditField>
      </div>
      <ImageUploadField
        label="Image"
        value={data.imageUrl}
        onChange={(url) => onChange({ ...data, imageUrl: url })}
      />
      <EditField label="Buy URL">
        <Input
          value={data.buyUrl}
          placeholder="https://…"
          onChange={(e) => onChange({ ...data, buyUrl: e.target.value })}
        />
      </EditField>
    </div>
  )
}
