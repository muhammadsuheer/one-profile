'use client'

import { useEffect, useState } from 'react'
import { X, Lock, Search } from 'lucide-react'
import { registeredBlocks, type BlockGroup, type BlockRegistryEntry } from '@/lib/blocks/registry'
import { cn } from '@/lib/utils'

const GROUPS: { key: BlockGroup; label: string }[] = [
  { key: 'basic', label: 'Basic' },
  { key: 'media', label: 'Media' },
  { key: 'commerce', label: 'Commerce' },
]

export function AddBlockModal({
  open,
  onClose,
  onAdd,
  plan,
}: {
  open: boolean
  onClose: () => void
  onAdd: (type: string) => void
  plan: 'free' | 'pro'
}) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!open) return
    setQuery('') // reset each time the modal opens
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const items = registeredBlocks()
  const q = query.trim().toLowerCase()
  const matches = (e: BlockRegistryEntry) =>
    !q || e.label.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
  const filtered = items.filter(matches)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Add a block"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <div className="relative z-10 max-h-[86vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900">Add a block</h2>
            <p className="text-sm text-neutral-400">Pick what to add to your page.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blocks…"
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50/80 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-neutral-900 focus:bg-white"
          />
        </div>

        {q ? (
          <div className="mt-4">
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-neutral-400">
                No blocks match &ldquo;{query}&rdquo;.
              </p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {filtered.map((entry) => renderItem(entry))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 space-y-5">
            {GROUPS.map((group) => {
              const groupItems = items.filter((i) => i.group === group.key)
              if (groupItems.length === 0) return null
              return (
                <div key={group.key}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                    {group.label}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {groupItems.map((entry) => renderItem(entry))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  function renderItem(entry: BlockRegistryEntry) {
    const locked = entry.proOnly && plan !== 'pro'
    const Icon = entry.icon
    return (
      <button
        key={entry.type}
        type="button"
        disabled={locked}
        onClick={() => {
          onAdd(entry.type)
          onClose()
        }}
        className={cn(
          'flex items-start gap-3 rounded-2xl border p-3 text-left transition-all',
          locked
            ? 'cursor-not-allowed border-neutral-200 opacity-60'
            : 'border-neutral-200 hover:border-neutral-900 hover:shadow-md',
        )}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-neutral-900">
            {entry.label}
            {locked && <Lock className="h-3 w-3 text-neutral-400" />}
            {entry.proOnly && (
              <span className="rounded bg-[#F5124A]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#F5124A]">
                PRO
              </span>
            )}
          </span>
          <span className="mt-0.5 block text-xs leading-snug text-neutral-400">
            {entry.description}
          </span>
        </span>
      </button>
    )
  }
}
