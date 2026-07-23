import { SocialIcon, SOCIAL_LABELS } from '@/components/blocks/social-icons'
import type { BlockDataOf } from '@/lib/blocks/schemas'
import { isHttpUrl } from '@/lib/utils'

export function SocialRowBlock({ id, data }: { id: string; data: BlockDataOf<'socialRow'> }) {
  const items = data.items.filter((item) => isHttpUrl(item.url))
  if (items.length === 0) return null

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 py-1">
      {items.map((item, i) => (
        <a
          key={`${item.platform}-${i}`}
          href={`/api/r/${id}?to=${encodeURIComponent(item.url)}`}
          target="_blank"
          rel="noopener noreferrer nofollow"
          aria-label={SOCIAL_LABELS[item.platform]}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
        >
          <SocialIcon platform={item.platform} className="h-[22px] w-[22px]" />
        </a>
      ))}
    </div>
  )
}
