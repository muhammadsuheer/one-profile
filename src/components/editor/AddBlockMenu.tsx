'use client'

import { useState } from 'react'
import { Plus, Lock } from 'lucide-react'
import { registeredBlocks } from '@/lib/blocks/registry'
import { Button } from '@/components/ui/button'

export function AddBlockMenu({
  onAdd,
  plan,
}: {
  onAdd: (type: string) => void
  plan: 'free' | 'pro'
}) {
  const [open, setOpen] = useState(false)
  const items = registeredBlocks()

  return (
    <div className="relative">
      <Button variant="primary" size="sm" onClick={() => setOpen((o) => !o)}>
        <Plus className="h-4 w-4" /> Add block
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 z-20 mt-2 w-72 overflow-hidden rounded-xl border border-neutral-200 bg-white p-1 shadow-lg">
            {items.map((entry) => {
              const locked = entry.proOnly && plan !== 'pro'
              const Icon = entry.icon
              return (
                <button
                  key={entry.type}
                  disabled={locked}
                  onClick={() => {
                    if (!locked) {
                      onAdd(entry.type)
                      setOpen(false)
                    }
                  }}
                  className="flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon className="h-4 w-4 shrink-0 text-neutral-500" />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-sm font-medium">
                      {entry.label}
                      {locked && <Lock className="h-3 w-3 text-neutral-400" />}
                    </p>
                    <p className="truncate text-xs text-neutral-400">{entry.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
