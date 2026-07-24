'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  Code,
  Palette,
  Music,
  Camera,
  Rocket,
  GraduationCap,
  PenLine,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Check,
  type LucideIcon,
} from 'lucide-react'
import { ONBOARDING_ROLES, ONBOARDING_VIBES } from '@/lib/onboarding'
import { createSiteFromOnboarding } from '@/app/onboarding/actions'
import type { SocialPlatform } from '@/lib/blocks/schemas'
import { PlatformPicker } from '@/components/blocks/edit/PlatformPicker'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const ROLE_ICONS: Record<string, LucideIcon> = {
  creator: Sparkles,
  developer: Code,
  designer: Palette,
  musician: Music,
  photographer: Camera,
  founder: Rocket,
  coach: GraduationCap,
  writer: PenLine,
}

const STEP_LABELS = ['Your link', 'What you do', 'Your socials', 'Your vibe']
const LOADING_MESSAGES = [
  'Analyzing your vibe…',
  'Picking your colors…',
  'Setting up your page…',
  'Adding your links…',
  'Almost ready…',
]

export function OnboardingWizard({
  userName,
  suggestedSlug,
  appHost,
}: {
  userName: string
  suggestedSlug: string
  appHost: string
}) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [slug, setSlug] = useState(suggestedSlug)
  const [role, setRole] = useState('')
  const [socials, setSocials] = useState<{ platform: SocialPlatform; url: string }[]>([
    { platform: 'instagram', url: '' },
  ])
  const [mode, setMode] = useState<'light' | 'dark'>('dark')
  const [mood, setMood] = useState('bold')
  const [generating, setGenerating] = useState(false)
  const [loadMsg, setLoadMsg] = useState(LOADING_MESSAGES[0])
  const [error, setError] = useState('')
  const interval = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const canContinue = step === 0 ? slug.trim().length >= 3 : step === 1 ? !!role : true
  const isLast = step === STEP_LABELS.length - 1

  async function generate() {
    setError('')
    setGenerating(true)
    let i = 0
    setLoadMsg(LOADING_MESSAGES[0])
    interval.current = setInterval(() => {
      i = Math.min(i + 1, LOADING_MESSAGES.length - 1)
      setLoadMsg(LOADING_MESSAGES[i])
    }, 750)

    try {
      const res = await createSiteFromOnboarding({ slug, role, mode, mood, socials })
      clearInterval(interval.current)
      if (res.ok) {
        setLoadMsg('Done! Taking you to your page…')
        router.push(`/dashboard/${res.data.siteId}/editor`)
        router.refresh()
      } else {
        setGenerating(false)
        setError(res.error ?? 'Something went wrong. Please try again.')
        setStep(0)
      }
    } catch {
      clearInterval(interval.current)
      setGenerating(false)
      setError('Something went wrong. Please try again.')
    }
  }

  function next() {
    if (isLast) void generate()
    else setStep((s) => s + 1)
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-neutral-50">
      {/* header */}
      <header className="flex items-center justify-between px-5 py-4 sm:px-8">
        <span className="text-lg font-semibold tracking-tight">OnePage</span>
        <Link href="/dashboard" className="text-sm font-medium text-neutral-400 hover:text-neutral-700">
          Skip
        </Link>
      </header>

      {/* progress */}
      <div className="mx-auto w-full max-w-lg px-5">
        <div className="flex gap-1.5">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex-1">
              <div
                className={cn(
                  'h-1.5 rounded-full transition-colors',
                  i <= step ? 'bg-[#F5124A]' : 'bg-neutral-200',
                )}
              />
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
          Step {step + 1} of {STEP_LABELS.length} · {STEP_LABELS[step]}
        </p>
      </div>

      {/* content */}
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-5 py-8">
        {step === 0 && (
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Claim your link</h1>
            <p className="mt-1.5 text-sm text-neutral-500">
              Hey {userName.split(' ')[0]} 👋 — pick your unique URL.
            </p>
            <div className="mt-6 flex items-center rounded-xl border border-neutral-200 bg-white pl-3.5 focus-within:border-neutral-400 focus-within:ring-4 focus-within:ring-neutral-900/[0.06]">
              <span className="whitespace-nowrap text-sm text-neutral-400">{appHost}/</span>
              <input
                autoFocus
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder="your-name"
                maxLength={30}
                className="h-12 min-w-0 flex-1 bg-transparent px-1 text-[15px] outline-none"
              />
            </div>
            <p className="mt-2 text-xs text-neutral-400">3–30 characters · letters, numbers, hyphens.</p>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">What do you do?</h1>
            <p className="mt-1.5 text-sm text-neutral-500">We&apos;ll tailor your page to fit.</p>
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {ONBOARDING_ROLES.map((r) => {
                const Icon = ROLE_ICONS[r.id] ?? Sparkles
                const active = role === r.id
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all',
                      active
                        ? 'border-neutral-900 bg-white shadow-md ring-1 ring-neutral-900'
                        : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-xl',
                        active ? 'bg-[#F5124A] text-white' : 'bg-neutral-100 text-neutral-600',
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium">{r.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Add your socials</h1>
            <p className="mt-1.5 text-sm text-neutral-500">Optional — you can add or edit these later.</p>
            <div className="mt-6 space-y-2.5">
              {socials.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <PlatformPicker
                    value={s.platform}
                    onChange={(platform) =>
                      setSocials((list) => list.map((x, j) => (j === i ? { ...x, platform } : x)))
                    }
                  />
                  <Input
                    value={s.url}
                    placeholder="https://…"
                    onChange={(e) =>
                      setSocials((list) =>
                        list.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)),
                      )
                    }
                  />
                  <button
                    type="button"
                    aria-label="Remove"
                    onClick={() => setSocials((list) => list.filter((_, j) => j !== i))}
                    className="flex h-11 w-10 shrink-0 items-center justify-center rounded-xl text-neutral-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {socials.length < 8 && (
                <button
                  type="button"
                  onClick={() => setSocials((list) => [...list, { platform: 'website', url: '' }])}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 py-2.5 text-sm font-medium text-neutral-500 hover:border-neutral-400 hover:bg-white hover:text-neutral-700"
                >
                  <Plus className="h-4 w-4" /> Add social
                </button>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Pick your vibe</h1>
            <p className="mt-1.5 text-sm text-neutral-500">
              We&apos;ll build a matching theme — tweak it anytime in Design.
            </p>

            <div className="mt-6 inline-flex rounded-xl border border-neutral-200 bg-white p-1">
              {(['light', 'dark'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={cn(
                    'rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-colors',
                    mode === m ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100',
                  )}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
              {ONBOARDING_VIBES.map((v) => {
                const active = mood === v.id
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setMood(v.id)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-xl border p-3 transition-all',
                      active
                        ? 'border-neutral-900 ring-1 ring-neutral-900'
                        : 'border-neutral-200 hover:border-neutral-300',
                    )}
                  >
                    <span className="h-8 w-8 rounded-full" style={{ background: v.accent }} />
                    <span className="text-xs font-medium">{v.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {/* nav */}
        <div className="mt-auto flex items-center justify-between pt-8">
          {step > 0 ? (
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          ) : (
            <span />
          )}
          <Button variant="primary" size="lg" onClick={next} disabled={!canContinue}>
            {isLast ? (
              <>
                <Sparkles className="h-4 w-4" /> Create my page
              </>
            ) : (
              <>
                Continue <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* generating overlay */}
      {generating && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-neutral-50/95 backdrop-blur-sm">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-neutral-200 border-t-[#F5124A]" />
            <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-[#F5124A]" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold tracking-tight">Building your page</p>
            <p className="mt-1 text-sm text-neutral-500">{loadMsg}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Check className="h-3.5 w-3.5 text-green-600" /> Crafted just for you
          </div>
        </div>
      )}
    </div>
  )
}
