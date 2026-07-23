'use client'

import { deleteSite } from '@/app/dashboard/actions'
import { Button } from '@/components/ui/button'

export function DeleteSiteButton({ siteId, slug }: { siteId: string; slug: string }) {
  return (
    <form
      action={deleteSite}
      onSubmit={(e) => {
        if (
          !window.confirm(
            `Delete /${slug}? This permanently removes its blocks, subscribers and analytics. This cannot be undone.`,
          )
        ) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name="siteId" value={siteId} />
      <Button type="submit" variant="ghost" size="sm" className="text-neutral-400 hover:text-red-600">
        Delete
      </Button>
    </form>
  )
}
