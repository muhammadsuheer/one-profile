import { env } from '@/env'

export interface YouTubeVideo {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
}

interface SearchItem {
  id?: { videoId?: string }
  snippet?: {
    title?: string
    publishedAt?: string
    thumbnails?: { medium?: { url?: string }; high?: { url?: string } }
  }
}

/**
 * Fetch a channel's latest videos from the YouTube Data API. Called ONLY from
 * the cron job (§10 — never from a page render). Returns [] if unconfigured or
 * on any error, so callers can leave the existing cache untouched.
 */
export async function fetchLatestVideos(channelId: string, limit: number): Promise<YouTubeVideo[]> {
  if (!env.YOUTUBE_API_KEY || !channelId) return []

  const url = new URL('https://www.googleapis.com/youtube/v3/search')
  url.searchParams.set('key', env.YOUTUBE_API_KEY)
  url.searchParams.set('channelId', channelId)
  url.searchParams.set('part', 'snippet')
  url.searchParams.set('order', 'date')
  url.searchParams.set('type', 'video')
  url.searchParams.set('maxResults', String(Math.min(Math.max(limit, 1), 6)))

  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return []
    const json = (await res.json()) as { items?: SearchItem[] }
    return (json.items ?? []).flatMap((item): YouTubeVideo[] => {
      const id = item.id?.videoId
      if (!id) return []
      const thumbs = item.snippet?.thumbnails
      return [
        {
          id,
          title: item.snippet?.title ?? '',
          thumbnail: thumbs?.medium?.url ?? thumbs?.high?.url ?? '',
          publishedAt: item.snippet?.publishedAt ?? '',
        },
      ]
    })
  } catch {
    return []
  }
}
