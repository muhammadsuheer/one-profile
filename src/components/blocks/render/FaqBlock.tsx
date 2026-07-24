import { ChevronDown } from 'lucide-react'
import type { BlockDataOf } from '@/lib/blocks/schemas'

export function FaqBlock({ data }: { id: string; data: BlockDataOf<'faq'> }) {
  const items = data.items.filter((it) => it.question.trim() && it.answer.trim())
  if (items.length === 0) return null

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] bg-[var(--surface)]">
      {data.title && (
        <p className="px-4 pt-3.5 text-sm font-semibold text-[var(--text)]">{data.title}</p>
      )}
      <div className="divide-y divide-[var(--border)]">
        {items.map((item, i) => (
          <details key={i} className="group px-4 py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[15px] font-medium text-[var(--text)] [&::-webkit-details-marker]:hidden">
              {item.question}
              <ChevronDown className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[var(--text-muted)]">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  )
}
