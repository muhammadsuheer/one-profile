'use client'

import { Plus, Trash2 } from 'lucide-react'
import {
  socialPlatformSchema,
  type BlockData,
  type SocialPlatform,
} from '@/lib/blocks/schemas'
import { Input } from '@/components/ui/input'
import { PlatformPicker } from '@/components/blocks/edit/PlatformPicker'

const PLATFORMS = socialPlatformSchema.options

export function SocialRowEdit({
  data,
  onChange,
}: {
  data: BlockData
  onChange: (data: BlockData) => void
}) {
  if (data.type !== 'socialRow') return null

  const setItem = (index: number, patch: Partial<{ platform: SocialPlatform; url: string }>) => {
    const items = data.items.map((it, i) => (i === index ? { ...it, ...patch } : it))
    onChange({ ...data, items })
  }
  const removeItem = (index: number) => {
    onChange({ ...data, items: data.items.filter((_, i) => i !== index) })
  }
  const addItem = () => {
    // Smart default: pick the first platform not already used.
    const used = new Set(data.items.map((i) => i.platform))
    const next = PLATFORMS.find((p) => !used.has(p)) ?? 'website'
    onChange({ ...data, items: [...data.items, { platform: next, url: '' }] })
  }

  return (
    <div className="space-y-2.5">
      {data.items.length === 0 && (
        <p className="text-sm text-neutral-400">No socials yet. Add your first below.</p>
      )}

      {data.items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <PlatformPicker value={item.platform} onChange={(platform) => setItem(i, { platform })} />
          <Input
            value={item.url}
            placeholder="https://…"
            onChange={(e) => setItem(i, { url: e.target.value })}
          />
          <button
            type="button"
            aria-label="Remove"
            onClick={() => removeItem(i)}
            className="flex h-11 w-10 shrink-0 items-center justify-center rounded-xl text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      {data.items.length < 12 && (
        <button
          type="button"
          onClick={addItem}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 py-2.5 text-sm font-medium text-neutral-500 transition-colors hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-700"
        >
          <Plus className="h-4 w-4" /> Add social
        </button>
      )}
    </div>
  )
}
