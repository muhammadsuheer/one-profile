'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { improveText } from '@/lib/ai-actions'

export function AiTextButton({
  value,
  kind,
  context,
  onChange,
}: {
  value: string
  kind: 'tagline' | 'title' | 'text'
  context?: string
  onChange: (text: string) => void
}) {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function run() {
    setLoading(true)
    setErr('')
    try {
      const res = await improveText({ text: value, kind, context })
      if (res.ok) onChange(res.text)
      else {
        setErr(res.error)
        setTimeout(() => setErr(''), 4000)
      }
    } catch {
      setErr('AI unavailable — try again.')
      setTimeout(() => setErr(''), 4000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={run}
        disabled={loading}
        title={value.trim() ? 'Improve with AI' : 'Write with AI'}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-[#F5124A] transition-colors hover:bg-[#F5124A]/5 disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
      </button>
      {err && (
        <span className="absolute right-0 top-12 z-20 w-max max-w-[220px] rounded-lg bg-neutral-900 px-2.5 py-1.5 text-xs text-white shadow-lg">
          {err}
        </span>
      )}
    </div>
  )
}
