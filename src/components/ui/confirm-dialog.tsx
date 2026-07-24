'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  loading?: boolean
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, loading, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => !loading && onClose()}
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        {destructive && (
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
        )}
        <h2 id="confirm-title" className="text-lg font-semibold tracking-tight text-neutral-900">
          {title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{description}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'destructive' : 'primary'}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Working…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
