'use client'

import type { BlockData } from '@/lib/blocks/schemas'
import { Input } from '@/components/ui/input'
import { EditField } from '@/components/blocks/edit/field'
import { parseSpotify } from '@/lib/spotify'

export function SpotifyEdit({
  data,
  onChange,
}: {
  data: BlockData
  onChange: (data: BlockData) => void
}) {
  if (data.type !== 'spotify') return null

  const invalid = data.url.trim().length > 0 && !parseSpotify(data.url)

  return (
    <div className="space-y-3">
      <EditField label="Spotify link">
        <Input
          value={data.url}
          inputMode="url"
          placeholder="https://open.spotify.com/track/…"
          onChange={(e) => onChange({ ...data, url: e.target.value })}
        />
      </EditField>
      {invalid ? (
        <p className="text-xs font-medium text-red-600">
          That doesn&apos;t look like a Spotify link. Paste a track, album, or playlist URL.
        </p>
      ) : (
        <p className="text-xs text-neutral-400">
          Share &rarr; Copy link on any track, album, playlist, artist, or podcast.
        </p>
      )}
    </div>
  )
}
