'use client'

import { Plus, Trash2 } from 'lucide-react'
import {
  socialPlatformSchema,
  type BlockData,
  type SocialPlatform,
} from '@/lib/blocks/schemas'
import { SOCIAL_LABELS } from '@/components/blocks/social-icons'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'

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
    onChange({ ...data, items: [...data.items, { platform: 'instagram', url: '' }] })
  }

  return (
    <div className="space-y-2.5">
      {data.items.length === 0 && (
        <p className="text-sm text-neutral-400">No socials yet. Add your first below.</p>
      )}

      {data.items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-36 shrink-0">
            <Select
              value={item.platform}
              onChange={(e) => setItem(i, { platform: e.target.value as SocialPlatform })}
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {SOCIAL_LABELS[p]}
                </option>
              ))}
            </Select>
          </div>
          <Input
            value={item.url}
            placeholder="https://…"
            onChange={(e) => setItem(i, { url: e.target.value })}
          />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Remove"
            onClick={() => removeItem(i)}
            className="shrink-0 text-neutral-400 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {data.items.length < 12 && (
        <Button variant="outline" size="sm" onClick={addItem} className="w-full">
          <Plus className="h-4 w-4" /> Add social
        </Button>
      )}
    </div>
  )
}
