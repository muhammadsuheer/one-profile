'use client'

import { useRef, useState } from 'react'
import { Check, Loader2, AlertCircle } from 'lucide-react'
import {
  themeConfigSchema,
  PALETTES,
  type ThemeConfig,
  type ButtonStyle,
  type FontFamily,
} from '@/lib/theme'
import { PhonePreview } from '@/components/editor/PhonePreview'
import type { EditorBlock, SaveStatus } from '@/components/editor/types'
import { updateTheme } from '@/app/dashboard/[siteId]/actions'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

const FONTS: FontFamily[] = ['Inter', 'Sans', 'Serif', 'Mono', 'Rounded']
const BUTTONS: ButtonStyle[] = ['rounded', 'pill', 'square']
const SWATCHES = ['#F5124A', '#6366F1', '#10B981', '#F59E0B', '#EC4899', '#0EA5E9']

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{title}</h3>
      {children}
    </section>
  )
}

export function DesignClient({
  siteId,
  plan,
  initialTheme,
  blocks,
}: {
  siteId: string
  plan: 'free' | 'pro'
  initialTheme: ThemeConfig
  blocks: EditorBlock[]
}) {
  const [theme, setTheme] = useState<ThemeConfig>(initialTheme)
  const [hex, setHex] = useState(initialTheme.accentColor)
  const [status, setStatus] = useState<SaveStatus>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  function update(patch: Partial<ThemeConfig>) {
    const next = { ...theme, ...patch }
    setTheme(next)
    setStatus('saving')
    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      if (!themeConfigSchema.safeParse(next).success) {
        setStatus('error')
        return
      }
      try {
        const res = await updateTheme({ siteId, theme: next })
        setStatus(res.ok ? 'saved' : 'error')
      } catch {
        setStatus('error')
      }
    }, 500)
  }

  function setAccent(value: string) {
    setHex(value)
    if (/^#[0-9a-fA-F]{6}$/.test(value)) update({ accentColor: value.toUpperCase() })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5">
        <Section title="Palette">
          <div className="space-y-4">
            {(['light', 'dark'] as const).map((mode) => (
              <div key={mode} className="space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                  {mode === 'light' ? 'Light' : 'Dark'}
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {PALETTES.filter((p) => p.mode === mode).map((p) => {
                    const active = theme.preset === p.id
                    return (
                      <button
                        key={p.id}
                        type="button"
                        title={p.name}
                        onClick={() => {
                          setHex(p.accent)
                          update({ preset: p.id, accentColor: p.accent })
                        }}
                        className={cn(
                          'rounded-xl border p-1 transition-all',
                          active
                            ? 'border-neutral-900 ring-1 ring-neutral-900'
                            : 'border-neutral-200 hover:border-neutral-300',
                        )}
                      >
                        <div
                          className="flex h-9 items-center justify-center gap-1 rounded-lg"
                          style={{ background: p.tokens.bg }}
                        >
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: p.accent }}
                          />
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                              background: p.tokens.surface,
                              boxShadow: `inset 0 0 0 1px ${p.tokens.border}`,
                            }}
                          />
                        </div>
                        <p className="mt-1 truncate text-center text-[10px] font-medium text-neutral-500">
                          {p.name}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Accent color">
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="color"
              value={/^#[0-9a-fA-F]{6}$/.test(hex) ? hex : theme.accentColor}
              onChange={(e) => setAccent(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-neutral-300 bg-white"
              aria-label="Accent color picker"
            />
            <input
              type="text"
              value={hex}
              onChange={(e) => setAccent(e.target.value)}
              maxLength={7}
              className="h-10 w-28 rounded-lg border border-neutral-300 px-3 text-sm uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            />
            <div className="flex gap-1.5">
              {SWATCHES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setAccent(c)}
                  className="h-6 w-6 rounded-full ring-1 ring-black/10"
                  style={{ background: c }}
                  aria-label={`Use ${c}`}
                />
              ))}
            </div>
          </div>
        </Section>

        <Section title="Button style">
          <div className="flex gap-2">
            {BUTTONS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => update({ buttonStyle: b })}
                className={cn(
                  'flex-1 rounded-lg border px-3 py-2 text-sm capitalize transition-colors',
                  theme.buttonStyle === b
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50',
                )}
              >
                {b}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Font">
          <select
            value={theme.fontFamily}
            onChange={(e) => update({ fontFamily: e.target.value as FontFamily })}
            className="h-10 w-full rounded-lg border border-neutral-300 bg-white px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          >
            {FONTS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </Section>

        <Section title="Branding">
          <div className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 p-3">
            <div>
              <p className="text-sm font-medium">Remove &ldquo;Made with OnePage&rdquo;</p>
              <p className="text-xs text-neutral-400">
                {plan === 'pro'
                  ? 'Hide the footer badge on your public page.'
                  : 'Upgrade to Pro to remove branding.'}
              </p>
            </div>
            <Switch
              checked={plan === 'pro' && !!theme.hideBranding}
              disabled={plan !== 'pro'}
              onCheckedChange={(v) => update({ hideBranding: v })}
              aria-label="Remove branding"
            />
          </div>
        </Section>
      </div>

      <div className="space-y-2 lg:sticky lg:top-20 lg:self-start">
        <div className="flex justify-end">
          <SaveText status={status} />
        </div>
        <PhonePreview blocks={blocks} theme={theme} />
      </div>
    </div>
  )
}

function SaveText({ status }: { status: SaveStatus }) {
  if (status === 'saving')
    return (
      <span className="flex items-center gap-1 text-xs text-neutral-400">
        <Loader2 className="h-3 w-3 animate-spin" /> Saving…
      </span>
    )
  if (status === 'saved')
    return (
      <span className="flex items-center gap-1 text-xs text-green-600">
        <Check className="h-3 w-3" /> Saved
      </span>
    )
  if (status === 'error')
    return (
      <span className="flex items-center gap-1 text-xs text-red-600">
        <AlertCircle className="h-3 w-3" /> Not saved
      </span>
    )
  return <span className="text-xs text-neutral-400">Live preview</span>
}
