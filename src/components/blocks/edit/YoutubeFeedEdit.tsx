'use client'

import type { BlockData } from '@/lib/blocks/schemas'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { EditField } from '@/components/blocks/edit/field'

export function YoutubeFeedEdit({
  data,
  onChange,
}: {
  data: BlockData
  onChange: (data: BlockData) => void
}) {
  if (data.type !== 'youtubeFeed') return null

  return (
    <div className="space-y-3">
      <EditField
        label="YouTube Channel ID"
        hint="e.g. UCxxxxxxxxxxxxxxxxxxxxxx — videos refresh hourly."
      >
        <Input
          value={data.channelId}
          maxLength={64}
          placeholder="UC…"
          onChange={(e) => onChange({ ...data, channelId: e.target.value })}
        />
      </EditField>
      <EditField label="Number of videos">
        <Select value={data.limit} onChange={(e) => onChange({ ...data, limit: Number(e.target.value) })}>
          {[3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </Select>
      </EditField>
      {data.cachedAt && (
        <p className="text-xs text-neutral-400">
          Last refreshed {new Date(data.cachedAt).toLocaleString()} · {data.cachedVideos?.length ?? 0} cached
        </p>
      )}
    </div>
  )
}
