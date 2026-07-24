'use client'

import { GripVertical } from 'lucide-react'
import { BLOCK_REGISTRY } from '@/lib/blocks/registry'
import type { BlockType } from '@/lib/blocks/schemas'
import type { EditorBlock } from '@/components/editor/types'

/** The "lifted" card shown under the cursor while dragging a block. */
export function BlockOverlayCard({ block }: { block: EditorBlock }) {
  const entry = BLOCK_REGISTRY[block.type as BlockType]
  const Icon = entry?.icon
  return (
    <div className="flex cursor-grabbing items-center gap-2 rounded-2xl border border-neutral-300 bg-white p-2.5 shadow-2xl ring-1 ring-black/5">
      <span className="flex h-9 w-5 items-center justify-center text-neutral-400">
        <GripVertical className="h-4 w-4" />
      </span>
      {Icon && (
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
          <Icon className="h-[18px] w-[18px]" />
        </div>
      )}
      <p className="text-[15px] font-semibold text-neutral-900">{entry?.label ?? block.type}</p>
    </div>
  )
}
