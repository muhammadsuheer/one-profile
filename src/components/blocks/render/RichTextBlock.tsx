import type { BlockDataOf } from '@/lib/blocks/schemas'

export function RichTextBlock({ data }: { id: string; data: BlockDataOf<'richText'> }) {
  if (!data.html.trim()) return null

  // html is sanitized server-side before storage (§10).
  return (
    <div
      className="space-y-2 text-sm leading-relaxed text-[var(--text)] [&_a]:text-[var(--accent)] [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--border)] [&_blockquote]:pl-3 [&_blockquote]:text-[var(--text-muted)] [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:text-base [&_h2]:font-semibold [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
      dangerouslySetInnerHTML={{ __html: data.html }}
    />
  )
}
