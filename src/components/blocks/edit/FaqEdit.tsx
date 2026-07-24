'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { BlockData } from '@/lib/blocks/schemas'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { EditField } from '@/components/blocks/edit/field'

export function FaqEdit({
  data,
  onChange,
}: {
  data: BlockData
  onChange: (data: BlockData) => void
}) {
  if (data.type !== 'faq') return null

  const setItem = (index: number, patch: Partial<{ question: string; answer: string }>) => {
    onChange({
      ...data,
      items: data.items.map((it, j) => (j === index ? { ...it, ...patch } : it)),
    })
  }

  return (
    <div className="space-y-3">
      <EditField label="Title (optional)">
        <Input
          value={data.title ?? ''}
          maxLength={80}
          placeholder="Frequently asked questions"
          onChange={(e) => onChange({ ...data, title: e.target.value })}
        />
      </EditField>

      <div className="space-y-2">
        {data.items.map((it, i) => (
          <div key={i} className="space-y-2 rounded-xl border border-neutral-200 p-2.5">
            <div className="flex items-center gap-2">
              <Input
                value={it.question}
                placeholder="Question"
                onChange={(e) => setItem(i, { question: e.target.value })}
              />
              <button
                type="button"
                aria-label="Remove"
                onClick={() => onChange({ ...data, items: data.items.filter((_, j) => j !== i) })}
                className="flex h-11 w-10 shrink-0 items-center justify-center rounded-xl text-neutral-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <Textarea
              value={it.answer}
              rows={2}
              placeholder="Answer"
              onChange={(e) => setItem(i, { answer: e.target.value })}
            />
          </div>
        ))}
      </div>

      {data.items.length < 20 && (
        <button
          type="button"
          onClick={() => onChange({ ...data, items: [...data.items, { question: '', answer: '' }] })}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 py-2.5 text-sm font-medium text-neutral-500 hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-700"
        >
          <Plus className="h-4 w-4" /> Add question
        </button>
      )}
    </div>
  )
}
