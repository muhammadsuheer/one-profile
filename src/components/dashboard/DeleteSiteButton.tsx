'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { deleteSite } from '@/app/dashboard/actions'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

export function DeleteSiteButton({ siteId, slug }: { siteId: string; slug: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [pending, startTransition] = useTransition()

  function handleConfirm() {
    setError(undefined)
    startTransition(async () => {
      const fd = new FormData()
      fd.set('siteId', siteId)
      try {
        const res = await deleteSite(fd)
        if (res?.ok) {
          setOpen(false)
          // Navigate + refresh on the client (avoids redirect-in-action errors).
          router.push('/dashboard')
          router.refresh()
        } else {
          setError(res?.error ?? 'Could not delete the site. Please try again.')
        }
      } catch {
        setError('Could not delete the site. Please try again.')
      }
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(undefined)
          setOpen(true)
        }}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete
      </button>

      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        loading={pending}
        destructive
        error={error}
        title={`Delete /${slug}?`}
        description="This permanently removes its blocks, subscribers and analytics. This can’t be undone."
        confirmLabel="Delete site"
      />
    </>
  )
}
