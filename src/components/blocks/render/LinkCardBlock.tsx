import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import type { BlockDataOf } from '@/lib/blocks/schemas'
import { isHttpUrl } from '@/lib/utils'

export function LinkCardBlock({ id, data }: { id: string; data: BlockDataOf<'linkCard'> }) {
  return (
    <a
      href={`/api/r/${id}`}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="group flex items-center gap-3 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 transition-colors hover:bg-[var(--surface-hover)]"
    >
      {isHttpUrl(data.thumbnailUrl) ? (
        <Image
          src={data.thumbnailUrl}
          alt=""
          width={48}
          height={48}
          className="h-12 w-12 shrink-0 rounded-lg object-cover"
        />
      ) : data.emoji ? (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-black/20 text-2xl">
          {data.emoji}
        </span>
      ) : null}

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-[var(--text)]">{data.title}</p>
        {data.subtitle && (
          <p className="truncate text-[13px] text-[var(--text-muted)]">{data.subtitle}</p>
        )}
      </div>

      <ChevronRight className="h-5 w-5 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5" />
    </a>
  )
}
