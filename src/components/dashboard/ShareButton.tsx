'use client'

import { useState, useEffect, useCallback } from 'react'
import QRCode from 'qrcode'
import { Share2, Copy, Check, Download, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ShareButton({ url, slug }: { url: string; slug: string }) {
  const [open, setOpen] = useState(false)
  const [qr, setQr] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) return
    let alive = true
    QRCode.toDataURL(url, {
      width: 512,
      margin: 2,
      color: { dark: '#0a0a0a', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    })
      .then((d) => alive && setQr(d))
      .catch(() => alive && setQr(null))
    return () => {
      alive = false
    }
  }, [open, url])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard unavailable */
    }
  }, [url])

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        aria-label="Share page"
        onClick={() => setOpen(true)}
      >
        <Share2 className="h-3.5 w-3.5" />
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/40 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Share your page"
        >
          <div
            className="w-full max-w-xs rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-neutral-900">Share your page</h3>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-neutral-100 bg-white">
              {qr ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qr} alt={`QR code for ${slug}`} className="h-full w-full" />
              ) : (
                <span className="text-xs text-neutral-400">Generating…</span>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
              <span className="min-w-0 flex-1 truncate text-sm text-neutral-600">{url}</span>
              <button
                onClick={copy}
                aria-label="Copy link"
                className="shrink-0 text-neutral-400 hover:text-neutral-900"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>

            {qr && (
              <a href={qr} download={`${slug}-qr.png`} className="mt-3 block">
                <Button variant="default" size="sm" className="w-full">
                  <Download className="h-3.5 w-3.5" /> Download QR
                </Button>
              </a>
            )}
          </div>
        </div>
      )}
    </>
  )
}
