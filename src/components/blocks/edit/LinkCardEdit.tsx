'use client'

import type { BlockData } from '@/lib/blocks/schemas'
import { Input } from '@/components/ui/input'
import { EditField } from '@/components/blocks/edit/field'
import { ImageUploadField } from '@/components/blocks/edit/ImageUploadField'

export function LinkCardEdit({
  data,
  onChange,
}: {
  data: BlockData
  onChange: (data: BlockData) => void
}) {
  if (data.type !== 'linkCard') return null

  return (
    <div className="space-y-3">
      <EditField label="Title">
        <Input
          value={data.title}
          maxLength={120}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
        />
      </EditField>

      <EditField label="Subtitle">
        <Input
          value={data.subtitle ?? ''}
          maxLength={160}
          onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
        />
      </EditField>

      <EditField label="URL" hint="Where this link sends visitors.">
        <Input
          value={data.url}
          placeholder="https://…"
          onChange={(e) => onChange({ ...data, url: e.target.value })}
        />
      </EditField>

      <div className="grid grid-cols-[1fr_auto] gap-3">
        <ImageUploadField
          label="Thumbnail"
          placeholder="https://… (optional)"
          value={data.thumbnailUrl ?? ''}
          onChange={(url) => onChange({ ...data, thumbnailUrl: url })}
        />
        <EditField label="Emoji">
          <Input
            value={data.emoji ?? ''}
            maxLength={8}
            placeholder="🔗"
            className="w-16 text-center"
            onChange={(e) => onChange({ ...data, emoji: e.target.value })}
          />
        </EditField>
      </div>
    </div>
  )
}
