'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { BlockData } from '@/lib/blocks/schemas'
import { Input } from '@/components/ui/input'
import { EditField } from '@/components/blocks/edit/field'
import { ImageUploadField } from '@/components/blocks/edit/ImageUploadField'

export function GalleryEdit({
  data,
  onChange,
}: {
  data: BlockData
  onChange: (data: BlockData) => void
}) {
  if (data.type !== 'gallery') return null

  const setImage = (index: number, patch: Partial<{ url: string; alt: string; linkUrl: string }>) => {
    onChange({
      ...data,
      images: data.images.map((img, i) => (i === index ? { ...img, ...patch } : img)),
    })
  }

  return (
    <div className="space-y-3">
      <EditField label="Layout">
        <div className="flex gap-2">
          {(['grid', 'carousel'] as const).map((layout) => (
            <button
              key={layout}
              type="button"
              onClick={() => onChange({ ...data, layout })}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm capitalize ${
                data.layout === layout
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {layout}
            </button>
          ))}
        </div>
      </EditField>

      <div className="space-y-2">
        {data.images.map((img, i) => (
          <div key={i} className="space-y-2 rounded-xl border border-neutral-200 p-2.5">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <ImageUploadField
                  value={img.url}
                  placeholder="Image URL"
                  onChange={(url) => setImage(i, { url })}
                />
              </div>
              <button
                type="button"
                aria-label="Remove image"
                onClick={() =>
                  onChange({ ...data, images: data.images.filter((_, j) => j !== i) })
                }
                className="flex h-11 w-10 shrink-0 items-center justify-center rounded-xl text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={img.alt ?? ''}
                placeholder="Alt text"
                onChange={(e) => setImage(i, { alt: e.target.value })}
              />
              <Input
                value={img.linkUrl ?? ''}
                placeholder="Link URL (optional)"
                onChange={(e) => setImage(i, { linkUrl: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>

      {data.images.length < 24 && (
        <button
          type="button"
          onClick={() => onChange({ ...data, images: [...data.images, { url: '' }] })}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 py-2.5 text-sm font-medium text-neutral-500 transition-colors hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-700"
        >
          <Plus className="h-4 w-4" /> Add image
        </button>
      )}
    </div>
  )
}
