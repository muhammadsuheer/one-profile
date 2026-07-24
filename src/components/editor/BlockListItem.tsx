'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Eye, EyeOff, Copy, Trash2, ChevronDown, AlertCircle } from 'lucide-react'
import { BLOCK_REGISTRY, blockRendersContent } from '@/lib/blocks/registry'
import { BLOCK_EDITORS } from '@/lib/blocks/edit-registry'
import type { BlockData, BlockType } from '@/lib/blocks/schemas'
import type { EditorBlock } from '@/components/editor/types'
import { cn } from '@/lib/utils'

function IconButton({
  label,
  onClick,
  children,
  className,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function BlockListItem({
  block,
  selected,
  onSelect,
  onToggleVisibility,
  onDuplicate,
  onDelete,
  onChange,
}: {
  block: EditorBlock
  selected: boolean
  onSelect: () => void
  onToggleVisibility: () => void
  onDuplicate: () => void
  onDelete: () => void
  onChange: (data: BlockData) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  })
  const style = { transform: CSS.Transform.toString(transform), transition }

  const entry = BLOCK_REGISTRY[block.type as BlockType]
  const Editor = BLOCK_EDITORS[block.type as BlockType]
  const Icon = entry?.icon
  const summary = entry?.summary(block.data) ?? ''
  const needsAttention = block.isVisible && !blockRendersContent(block.data)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group rounded-2xl border bg-white transition-all',
        isDragging ? 'opacity-40' : 'shadow-sm hover:shadow-md',
        selected ? 'border-neutral-900 ring-1 ring-neutral-900' : 'border-neutral-200',
        !block.isVisible && !isDragging && 'opacity-70',
      )}
    >
      <div className="flex items-center gap-1 p-2 sm:p-2.5">
        <button
          type="button"
          aria-label="Drag to reorder"
          className="flex h-9 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-neutral-300 transition-colors hover:bg-neutral-100 hover:text-neutral-600 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Whole area = edit trigger (bigger, clearer target) */}
        <button
          type="button"
          onClick={onSelect}
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-1 py-1 text-left transition-colors hover:bg-neutral-50"
        >
          {Icon && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
              <Icon className="h-[18px] w-[18px]" />
            </span>
          )}
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2 text-[15px] font-semibold text-neutral-900">
              {entry?.label ?? block.type}
              {!block.isVisible && (
                <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                  Hidden
                </span>
              )}
            </span>
            {needsAttention ? (
              <span className="flex items-center gap-1 truncate text-[13px] font-medium text-amber-600">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" /> Needs a link to show
              </span>
            ) : summary ? (
              <span className="block truncate text-[13px] text-neutral-400">{summary}</span>
            ) : null}
          </span>
        </button>

        <div className="flex items-center">
          <IconButton label={block.isVisible ? 'Hide' : 'Show'} onClick={onToggleVisibility}>
            {block.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </IconButton>
          <IconButton label="Duplicate" onClick={onDuplicate}>
            <Copy className="h-4 w-4" />
          </IconButton>
          <IconButton label="Delete" onClick={onDelete} className="hover:bg-red-50 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </IconButton>
          <IconButton label={selected ? 'Collapse' : 'Edit'} onClick={onSelect}>
            <ChevronDown className={cn('h-4 w-4 transition-transform', selected && 'rotate-180')} />
          </IconButton>
        </div>
      </div>

      {selected && Editor && (
        <div className="border-t border-neutral-100 bg-neutral-50/50 p-4">
          <Editor data={block.data} onChange={onChange} />
        </div>
      )}
    </div>
  )
}
