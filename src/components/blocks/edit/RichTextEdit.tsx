'use client'

import type { BlockData } from '@/lib/blocks/schemas'
import { Textarea } from '@/components/ui/textarea'
import { EditField } from '@/components/blocks/edit/field'

export function RichTextEdit({
  data,
  onChange,
}: {
  data: BlockData
  onChange: (data: BlockData) => void
}) {
  if (data.type !== 'richText') return null

  return (
    <EditField
      label="Content (HTML)"
      hint="Basic HTML, sanitized on save. Allowed: p, h1–h3, strong, em, a, ul, ol, li, blockquote."
    >
      <Textarea
        value={data.html}
        rows={6}
        maxLength={10000}
        placeholder="<p>Hello <strong>world</strong></p>"
        onChange={(e) => onChange({ ...data, html: e.target.value })}
      />
    </EditField>
  )
}
