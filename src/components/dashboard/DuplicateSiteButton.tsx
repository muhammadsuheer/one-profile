'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, Loader2 } from 'lucide-react'
import { duplicateSite } from '@/app/dashboard/actions'
import { Button } from '@/components/ui/button'

export function DuplicateSiteButton({ siteId }: { siteId: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>()
  const [pending, startTransition] = useTransition()

  function handleClick() {
    setError(undefined)
    startTransition(async () => {
      try {
        const res = await duplicateSite({ siteId })
        if (res.ok && res.id) {
          router.push(`/dashboard/${res.id}/editor`)
          router.refresh()
        } else {
          setError(res.error ?? 'Could not duplicate the site.')
        }
      } catch {
        setError('Could not duplicate the site.')
      }
    })
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        aria-label="Duplicate site"
        title="Duplicate site"
        onClick={handleClick}
        disabled={pending}
      >
        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Copy className="h-3.5 w-3.5" />}
      </Button>
      {error && (
        <p
          role="alert"
          className="absolute bottom-full right-0 z-10 mb-1 w-max max-w-[220px] rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg"
        >
          {error}
        </p>
      )}
    </div>
  )
}
