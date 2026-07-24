'use client'

import type { BlockData } from '@/lib/blocks/schemas'
import { Input } from '@/components/ui/input'
import { EditField } from '@/components/blocks/edit/field'
import { ImageUploadField } from '@/components/blocks/edit/ImageUploadField'

export function ImageBannerEdit({
  data,
  onChange,
}: {
  data: BlockData
  onChange: (data: BlockData) => void
}) {
  if (data.type !== 'imageBanner') return null

  return (
    <div className="space-y-3">
      <ImageUploadField
        label="Banner image"
        value={data.imageUrl}
        onChange={(url) => onChange({ ...data, imageUrl: url })}
      />
      <EditField label="Alt text (optional)">
        <Input
          value={data.alt ?? ''}
          maxLength={160}
          placeholder="Describe the image"
          onChange={(e) => onChange({ ...data, alt: e.target.value })}
        />
      </EditField>
      <EditField label="Link (optional)">
        <Input
          value={data.linkUrl ?? ''}
          inputMode="url"
          placeholder="https://example.com"
          onChange={(e) => onChange({ ...data, linkUrl: e.target.value })}
        />
      </EditField>
    </div>
  )
}
