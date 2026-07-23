import Image from 'next/image'
import { Sparkles, Star, Crown, BadgeCheck, Zap, type LucideIcon } from 'lucide-react'
import type { BlockDataOf } from '@/lib/blocks/schemas'
import { isHttpUrl } from '@/lib/utils'

const BADGE_ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  star: Star,
  crown: Crown,
  verified: BadgeCheck,
  check: BadgeCheck,
  zap: Zap,
}

export function ProfileBlock({ data }: { id: string; data: BlockDataOf<'profile'> }) {
  const BadgeIcon = data.badgeIcon ? BADGE_ICONS[data.badgeIcon.toLowerCase()] : undefined

  return (
    <div className="flex flex-col items-center gap-2.5 py-2 text-center">
      {isHttpUrl(data.avatarUrl) ? (
        <Image
          src={data.avatarUrl}
          alt={data.name}
          width={96}
          height={96}
          className="h-24 w-24 rounded-full object-cover ring-2 ring-white/15"
          priority
        />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--surface)] ring-2 ring-white/15">
          <span className="text-3xl font-semibold text-[var(--text-muted)]">
            {data.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      <h1 className="text-2xl font-semibold leading-tight text-[var(--text)]">{data.name}</h1>

      {data.badgeText && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 py-1 text-[13px] font-semibold text-white">
          {BadgeIcon && <BadgeIcon className="h-3.5 w-3.5" />}
          {data.badgeText}
        </span>
      )}

      {data.tagline && <p className="text-sm text-[var(--text-muted)]">{data.tagline}</p>}
    </div>
  )
}
