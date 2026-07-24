import type { BlockDataOf } from '@/lib/blocks/schemas'
import { parseCalendly } from '@/lib/calendly'

export function CalendlyBlock({ data }: { id: string; data: BlockDataOf<'calendly'> }) {
  const src = parseCalendly(data.url)
  if (!src) return null

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] bg-[var(--surface)]">
      {data.title && (
        <p className="px-4 pt-4 text-[15px] font-semibold text-[var(--text)]">{data.title}</p>
      )}
      <iframe
        title="Book a time"
        src={src}
        width="100%"
        height={660}
        loading="lazy"
        style={{ border: 0, minWidth: 0 }}
      />
    </div>
  )
}
