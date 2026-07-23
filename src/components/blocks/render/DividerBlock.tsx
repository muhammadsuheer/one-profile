import type { BlockDataOf } from '@/lib/blocks/schemas'

export function DividerBlock({ data }: { id: string; data: BlockDataOf<'divider'> }) {
  if (data.label) {
    return (
      <div className="flex items-center gap-3 py-1">
        <span className="h-px flex-1 bg-[var(--border)]" />
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
          {data.label}
        </span>
        <span className="h-px flex-1 bg-[var(--border)]" />
      </div>
    )
  }
  return (
    <div className="py-1">
      <span className="block h-px w-full bg-[var(--border)]" />
    </div>
  )
}
