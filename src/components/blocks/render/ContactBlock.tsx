import { UserPlus } from 'lucide-react'
import type { BlockDataOf } from '@/lib/blocks/schemas'

export function ContactBlock({ id, data }: { id: string; data: BlockDataOf<'contact'> }) {
  return (
    <a
      href={`/api/vcard/${id}`}
      className="group flex items-center justify-center gap-2 rounded-[var(--radius-btn)] bg-[var(--surface)] p-4 text-[15px] font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface-hover)]"
    >
      <UserPlus className="h-5 w-5 shrink-0 text-[var(--text-muted)] transition-colors group-hover:text-[var(--text)]" />
      {data.label || 'Save contact'}
    </a>
  )
}
