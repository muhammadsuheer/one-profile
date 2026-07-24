/**
 * Convert any Spotify share URL into its official embed URL, or null if the
 * input isn't a recognized Spotify link. Only open.spotify.com is accepted, so
 * the render can safely put the result in an iframe src.
 */
const SPOTIFY_RE =
  /^https?:\/\/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(track|album|playlist|artist|episode|show)\/([A-Za-z0-9]+)/i

export type SpotifyKind = 'track' | 'album' | 'playlist' | 'artist' | 'episode' | 'show'

export function parseSpotify(url: string): { kind: SpotifyKind; id: string; embedUrl: string } | null {
  const m = url.trim().match(SPOTIFY_RE)
  if (!m) return null
  const kind = m[1].toLowerCase() as SpotifyKind
  const id = m[2]
  return { kind, id, embedUrl: `https://open.spotify.com/embed/${kind}/${id}` }
}

/** Compact height for single tracks/episodes; taller for collections. */
export function spotifyHeight(kind: SpotifyKind): number {
  return kind === 'track' || kind === 'episode' ? 152 : 352
}
