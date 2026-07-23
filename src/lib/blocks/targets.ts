import type { BlockData } from '@/lib/blocks/schemas'

/**
 * The complete set of outbound URLs a block may redirect to. The /api/r
 * endpoint uses this as an allow-list so `?to=` can never become an open
 * redirect — a target is only honored if it appears here.
 */
export function getBlockTargets(data: BlockData): string[] {
  switch (data.type) {
    case 'linkCard':
      return [data.url]
    case 'socialRow':
      return data.items.map((i) => i.url)
    case 'videoCard':
      return [data.youtubeUrl]
    case 'product':
      return [data.buyUrl]
    case 'gallery':
      return data.images.map((i) => i.linkUrl).filter((u): u is string => !!u)
    case 'youtubeFeed':
      return (data.cachedVideos ?? []).map((v) => `https://www.youtube.com/watch?v=${v.id}`)
    default:
      return []
  }
}

/** The default target when `?to=` is absent. */
export function getPrimaryTarget(data: BlockData): string | null {
  switch (data.type) {
    case 'linkCard':
      return data.url
    case 'videoCard':
      return data.youtubeUrl
    case 'product':
      return data.buyUrl
    case 'socialRow':
      return data.items[0]?.url ?? null
    default:
      return null
  }
}
