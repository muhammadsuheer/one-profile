import Image from 'next/image'
import type { BlockDataOf } from '@/lib/blocks/schemas'
import { isHttpUrl } from '@/lib/utils'

function formatPrice(price: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price)
  } catch {
    return `${currency} ${price.toFixed(2)}`
  }
}

export function ProductBlock({ id, data }: { id: string; data: BlockDataOf<'product'> }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] bg-[var(--surface)]">
      {isHttpUrl(data.imageUrl) && (
        <div className="relative aspect-[4/3] w-full">
          <Image src={data.imageUrl} alt={data.title} fill className="object-cover" sizes="440px" />
        </div>
      )}
      <div className="flex items-center gap-3 p-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-[var(--text)]">{data.title}</p>
          <p className="text-sm text-[var(--text-muted)]">{formatPrice(data.price, data.currency)}</p>
        </div>
        <a
          href={`/api/r/${id}`}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="shrink-0 rounded-[var(--radius-btn)] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Buy
        </a>
      </div>
    </div>
  )
}
