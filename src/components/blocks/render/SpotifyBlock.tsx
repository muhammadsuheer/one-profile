import type { BlockDataOf } from '@/lib/blocks/schemas'
import { parseSpotify, spotifyHeight } from '@/lib/spotify'

export function SpotifyBlock({ data }: { id: string; data: BlockDataOf<'spotify'> }) {
  const parsed = parseSpotify(data.url)
  if (!parsed) return null

  const height = spotifyHeight(parsed.kind)
  return (
    <iframe
      title="Spotify player"
      src={parsed.embedUrl}
      width="100%"
      height={height}
      loading="lazy"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      allowFullScreen
      style={{ border: 0, borderRadius: 'var(--radius-card)' }}
    />
  )
}
