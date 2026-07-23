import Image from 'next/image'
import type { BlockDataOf } from '@/lib/blocks/schemas'
import { isHttpUrl } from '@/lib/utils'

export function YoutubeFeedBlock({ id, data }: { id: string; data: BlockDataOf<'youtubeFeed'> }) {
  const videos = (data.cachedVideos ?? []).slice(0, data.limit)

  if (videos.length === 0) {
    return (
      <div className="rounded-[var(--radius-card)] bg-[var(--surface)] p-4 text-center text-sm text-[var(--text-muted)]">
        Latest videos will appear here soon.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {videos.map((v) => (
        <a
          key={v.id}
          href={`/api/r/${id}?to=${encodeURIComponent(`https://www.youtube.com/watch?v=${v.id}`)}`}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="group overflow-hidden rounded-xl bg-[var(--surface)]"
        >
          <div className="relative aspect-video w-full bg-black/30">
            {isHttpUrl(v.thumbnail) && (
              <Image src={v.thumbnail} alt="" fill className="object-cover" sizes="220px" />
            )}
          </div>
          <p className="line-clamp-2 p-2 text-xs text-[var(--text)]">{v.title}</p>
        </a>
      ))}
    </div>
  )
}
