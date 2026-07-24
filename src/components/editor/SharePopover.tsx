'use client'

import { useState } from 'react'
import { Share2, Copy, Check, ExternalLink, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SharePopover({ url, published }: { url: string; published: boolean }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard blocked — user can still select the text */
    }
  }

  const display = url.replace(/^https?:\/\//, '')

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setOpen((o) => !o)}>
        <Share2 className="h-4 w-4" /> Share
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 z-40 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl">
            <p className="text-sm font-semibold text-neutral-900">Share your page</p>
            <p className="mt-0.5 text-xs text-neutral-400">Anyone with this link can view it.</p>

            <button
              type="button"
              onClick={copy}
              className="mt-3 flex w-full items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-left transition-colors hover:bg-neutral-100"
            >
              <span className="min-w-0 flex-1 truncate text-sm text-neutral-700">{display}</span>
              {copied ? (
                <Check className="h-4 w-4 shrink-0 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 shrink-0 text-neutral-400" />
              )}
            </button>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button variant="primary" size="sm" onClick={copy}>
                {copied ? 'Copied!' : 'Copy link'}
              </Button>
              <a href={url} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="h-4 w-4" /> Open
                </Button>
              </a>
            </div>

            {!published && (
              <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-amber-50 px-2.5 py-2 text-xs text-amber-700">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Your page is a draft — publish it to make this link live.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
