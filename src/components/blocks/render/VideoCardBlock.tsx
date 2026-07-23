'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import type { BlockDataOf } from '@/lib/blocks/schemas'
import { extractYouTubeId, youTubeThumbnail } from '@/lib/video'

export function VideoCardBlock({ data }: { id: string; data: BlockDataOf<'videoCard'> }) {
  const [playing, setPlaying] = useState(false)
  const videoId = extractYouTubeId(data.youtubeUrl)

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] bg-[var(--surface)]">
      <div className="relative aspect-video w-full bg-black/40">
        {playing && videoId ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
            title={data.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 h-full w-full"
            aria-label={`Play ${data.title}`}
            disabled={!videoId}
          >
            {videoId && (
              <Image src={youTubeThumbnail(videoId)} alt="" fill className="object-cover" sizes="440px" />
            )}
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-white transition-transform group-hover:scale-110">
                <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
              </span>
            </span>
          </button>
        )}
      </div>

      {(data.title || data.subtitle) && (
        <div className="p-4">
          {data.title && <p className="text-[15px] font-semibold text-[var(--text)]">{data.title}</p>}
          {data.subtitle && <p className="text-[13px] text-[var(--text-muted)]">{data.subtitle}</p>}
        </div>
      )}
    </div>
  )
}
