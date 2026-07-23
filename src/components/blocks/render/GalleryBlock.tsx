import Image from 'next/image'
import type { BlockDataOf } from '@/lib/blocks/schemas'
import { isHttpUrl } from '@/lib/utils'

export function GalleryBlock({ id, data }: { id: string; data: BlockDataOf<'gallery'> }) {
  if (data.images.length === 0) return null

  const cell = (img: BlockDataOf<'gallery'>['images'][number], i: number) => {
    const media = isHttpUrl(img.url) ? (
      <Image
        src={img.url}
        alt={img.alt ?? ''}
        width={400}
        height={400}
        className="h-full w-full object-cover"
        sizes="180px"
      />
    ) : (
      <div className="h-full w-full bg-[var(--surface)]" />
    )
    const cls = 'block aspect-square overflow-hidden rounded-xl bg-[var(--surface)]'
    return img.linkUrl ? (
      <a
        key={i}
        href={`/api/r/${id}?to=${encodeURIComponent(img.linkUrl)}`}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className={cls}
      >
        {media}
      </a>
    ) : (
      <div key={i} className={cls}>
        {media}
      </div>
    )
  }

  if (data.layout === 'carousel') {
    return (
      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {data.images.map((img, i) => (
          <div key={i} className="w-36 shrink-0 snap-start">
            {cell(img, i)}
          </div>
        ))}
      </div>
    )
  }

  return <div className="grid grid-cols-3 gap-2">{data.images.map(cell)}</div>
}
