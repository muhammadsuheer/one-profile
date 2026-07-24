'use client'

import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { socialPlatformSchema, type SocialPlatform } from '@/lib/blocks/schemas'
import { SocialIcon, SOCIAL_LABELS } from '@/components/blocks/social-icons'
import { cn } from '@/lib/utils'

const PLATFORMS = socialPlatformSchema.options

/** Premium platform selector that shows brand icons (unlike a native <select>). */
export function PlatformPicker({
  value,
  onChange,
}: {
  value: SocialPlatform
  onChange: (platform: SocialPlatform) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative w-40 shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 w-full items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50/80 pl-2 pr-2.5 text-sm transition hover:border-neutral-300"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-neutral-700 shadow-sm ring-1 ring-black/5">
          <SocialIcon platform={value} className="h-[15px] w-[15px]" />
        </span>
        <span className="min-w-0 flex-1 truncate text-left font-medium text-neutral-800">
          {SOCIAL_LABELS[value]}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute left-0 z-30 mt-1.5 max-h-64 w-48 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-1 shadow-xl">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  onChange(p)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-neutral-50',
                  value === p && 'bg-neutral-50',
                )}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                  <SocialIcon platform={p} className="h-[15px] w-[15px]" />
                </span>
                <span className="flex-1 text-left font-medium text-neutral-700">
                  {SOCIAL_LABELS[p]}
                </span>
                {value === p && <Check className="h-4 w-4 shrink-0 text-[#F5124A]" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
