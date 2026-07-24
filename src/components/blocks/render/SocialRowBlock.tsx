import { SocialIcon, SOCIAL_LABELS } from '@/components/blocks/social-icons'
import type { BlockDataOf } from '@/lib/blocks/schemas'
import { isSocialLink } from '@/lib/social'

export function SocialRowBlock({ id, data }: { id: string; data: BlockDataOf<'socialRow'> }) {
  const items = data.items.filter((item) => isSocialLink(item.url))
  if (items.length === 0) return null

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 py-1">
      {items.map((item, i) => {
        const direct = /^(mailto:|tel:)/i.test(item.url)
        const href = direct ? item.url : `/api/r/${id}?to=${encodeURIComponent(item.url)}`
        return (
          <a
            key={`${item.platform}-${i}`}
            href={href}
            target={direct ? undefined : '_blank'}
            rel="noopener noreferrer nofollow"
            aria-label={SOCIAL_LABELS[item.platform]}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
          >
            <SocialIcon platform={item.platform} className="h-[22px] w-[22px]" />
          </a>
        )
      })}
    </div>
  )
}
