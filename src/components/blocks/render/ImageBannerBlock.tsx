import Image from 'next/image'
import type { BlockDataOf } from '@/lib/blocks/schemas'
import { isHttpUrl } from '@/lib/utils'

export function ImageBannerBlock({ id, data }: { id: string; data: BlockDataOf<'imageBanner'> }) {
  if (!isHttpUrl(data.imageUrl)) return null

  const img = (
    <Image
      src={data.imageUrl}
      alt={data.alt ?? ''}
      width={880}
      height={495}
      className="h-full w-full object-cover"
      sizes="440px"
    />
  )
  const cls = 'block aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-[var(--surface)]'

  return isHttpUrl(data.linkUrl) ? (
    <a
      href={`/api/r/${id}?to=${encodeURIComponent(data.linkUrl)}`}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={cls}
    >
      {img}
    </a>
  ) : (
    <div className={cls}>{img}</div>
  )
}
