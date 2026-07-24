import { describe, it, expect } from 'vitest'
import { parseSpotify, spotifyHeight } from './spotify'

describe('parseSpotify', () => {
  it('parses a track URL and strips query params', () => {
    const r = parseSpotify('https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT?si=abc')
    expect(r).toEqual({
      kind: 'track',
      id: '4cOdK2wGLETKBW3PvgPWqT',
      embedUrl: 'https://open.spotify.com/embed/track/4cOdK2wGLETKBW3PvgPWqT',
    })
  })

  it('handles playlist, album, artist, episode, show', () => {
    expect(parseSpotify('https://open.spotify.com/playlist/xyz123')?.kind).toBe('playlist')
    expect(parseSpotify('https://open.spotify.com/album/xyz123')?.kind).toBe('album')
    expect(parseSpotify('https://open.spotify.com/artist/xyz123')?.kind).toBe('artist')
    expect(parseSpotify('https://open.spotify.com/episode/xyz123')?.kind).toBe('episode')
    expect(parseSpotify('https://open.spotify.com/show/xyz123')?.kind).toBe('show')
  })

  it('handles intl locale prefixes', () => {
    expect(parseSpotify('https://open.spotify.com/intl-de/album/1DFixLWuPkv3KT3TnV35m3')?.id).toBe(
      '1DFixLWuPkv3KT3TnV35m3',
    )
  })

  it('rejects non-Spotify and junk input', () => {
    expect(parseSpotify('https://youtube.com/watch?v=x')).toBeNull()
    expect(parseSpotify('https://evil.com/open.spotify.com/track/x')).toBeNull()
    expect(parseSpotify('not a url')).toBeNull()
    expect(parseSpotify('')).toBeNull()
  })
})

describe('spotifyHeight', () => {
  it('is compact for track/episode, tall otherwise', () => {
    expect(spotifyHeight('track')).toBe(152)
    expect(spotifyHeight('episode')).toBe(152)
    expect(spotifyHeight('playlist')).toBe(352)
    expect(spotifyHeight('album')).toBe(352)
  })
})
