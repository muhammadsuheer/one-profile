import Image from 'next/image'
import { Quote } from 'lucide-react'
import type { BlockDataOf } from '@/lib/blocks/schemas'
import { isHttpUrl } from '@/lib/utils'

export function TestimonialBlock({ data }: { id: string; data: BlockDataOf<'testimonial'> }) {
  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--surface)] p-5 text-center">
      <Quote className="mx-auto h-5 w-5 text-[var(--accent)]" />
      <p className="mt-3 text-[15px] italic leading-relaxed text-[var(--text)]">
        {data.quote}
      </p>
      {(data.author || isHttpUrl(data.avatarUrl)) && (
        <div className="mt-4 flex items-center justify-center gap-2.5">
          {isHttpUrl(data.avatarUrl) && (
            <Image
              src={data.avatarUrl}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
            />
          )}
          {data.author && (
            <div className="text-left">
              <p className="text-sm font-semibold text-[var(--text)]">{data.author}</p>
              {data.role && <p className="text-xs text-[var(--text-muted)]">{data.role}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
