'use client'

import type { BlockData } from '@/lib/blocks/schemas'
import { Input } from '@/components/ui/input'
import { EditField } from '@/components/blocks/edit/field'
import { ImageUploadField } from '@/components/blocks/edit/ImageUploadField'
import { AiTextButton } from '@/components/ai/AiTextButton'

export function ProfileEdit({
  data,
  onChange,
}: {
  data: BlockData
  onChange: (data: BlockData) => void
}) {
  if (data.type !== 'profile') return null

  return (
    <div className="space-y-3">
      <EditField label="Name">
        <Input
          value={data.name}
          maxLength={80}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
        />
      </EditField>

      <ImageUploadField
        label="Avatar"
        hint="Paste a URL, or upload / drag & drop an image."
        value={data.avatarUrl}
        onChange={(url) => onChange({ ...data, avatarUrl: url })}
      />

      <EditField label="Tagline" hint="✨ = write / improve with AI">
        <div className="flex items-center gap-2">
          <Input
            value={data.tagline ?? ''}
            maxLength={120}
            placeholder="Paranormal Investigator"
            onChange={(e) => onChange({ ...data, tagline: e.target.value })}
          />
          <AiTextButton
            value={data.tagline ?? ''}
            kind="tagline"
            context={data.name}
            onChange={(text) => onChange({ ...data, tagline: text })}
          />
        </div>
      </EditField>

      <div className="grid grid-cols-2 gap-3">
        <EditField label="Badge text">
          <Input
            value={data.badgeText ?? ''}
            maxLength={60}
            placeholder="2.2M Followers"
            onChange={(e) => onChange({ ...data, badgeText: e.target.value })}
          />
        </EditField>
        <EditField label="Badge icon" hint="sparkles · star · crown · verified · zap">
          <Input
            value={data.badgeIcon ?? ''}
            maxLength={40}
            placeholder="sparkles"
            onChange={(e) => onChange({ ...data, badgeIcon: e.target.value })}
          />
        </EditField>
      </div>
    </div>
  )
}
