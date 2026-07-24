'use client'

import { useEffect } from 'react'
import { X, Lock } from 'lucide-react'
import { registeredBlocks, type BlockGroup } from '@/lib/blocks/registry'
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
  useEffect(() => {
    if (!open) return
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
                  {groupItems.map((entry) => {
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
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
