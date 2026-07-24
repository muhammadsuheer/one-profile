'use client'

import { useState, useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteSite } from '@/app/dashboard/actions'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

export function DeleteSiteButton({ siteId, slug }: { siteId: string; slug: string }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleConfirm() {
    const fd = new FormData()
    fd.set('siteId', siteId)
    startTransition(async () => {
      await deleteSite(fd)
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
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
        title={`Delete /${slug}?`}
        description="This permanently removes its blocks, subscribers and analytics. This can’t be undone."
        confirmLabel="Delete site"
      />
    </>
  )
}
