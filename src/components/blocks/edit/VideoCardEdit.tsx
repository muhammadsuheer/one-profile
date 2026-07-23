'use client'

import type { BlockData } from '@/lib/blocks/schemas'
import { Input } from '@/components/ui/input'
import { EditField } from '@/components/blocks/edit/field'
import { extractYouTubeId } from '@/lib/video'

export function VideoCardEdit({
  data,
  onChange,
}: {
  data: BlockData
  onChange: (data: BlockData) => void
}) {
  if (data.type !== 'videoCard') return null

  const invalid = data.youtubeUrl.length > 0 && !extractYouTubeId(data.youtubeUrl)

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
      <EditField
        label="YouTube URL"
        hint={invalid ? '⚠ Not a recognizable YouTube link' : 'watch, youtu.be, embed or shorts links'}
      >
        <Input
          value={data.youtubeUrl}
          placeholder="https://youtube.com/watch?v=…"
          onChange={(e) => onChange({ ...data, youtubeUrl: e.target.value })}
        />
      </EditField>
    </div>
  )
}
