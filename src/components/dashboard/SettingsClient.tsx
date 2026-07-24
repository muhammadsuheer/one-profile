'use client'

import { useRef, useState } from 'react'
import { Check, Loader2, AlertCircle } from 'lucide-react'
import { saveSettings } from '@/app/dashboard/[siteId]/actions'
import type { SeoConfig } from '@/lib/theme'
import type { SaveStatus } from '@/components/editor/types'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ImageUploadField } from '@/components/blocks/edit/ImageUploadField'

interface SiteSettings {
  id: string
  slug: string
  customDomain: string | null
  isPublished: boolean
  seo: SeoConfig | null
}

export function SettingsClient({
  site,
  plan,
  appHost,
}: {
  site: SiteSettings
  plan: 'free' | 'pro'
  appHost: string
}) {
  const [slug, setSlug] = useState(site.slug)
  const [customDomain, setCustomDomain] = useState(site.customDomain ?? '')
  const [seoTitle, setSeoTitle] = useState(site.seo?.title ?? '')
  const [seoDescription, setSeoDescription] = useState(site.seo?.description ?? '')
  const [seoOg, setSeoOg] = useState(site.seo?.ogImageUrl ?? '')
  const [isPublished, setIsPublished] = useState(site.isPublished)
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [error, setError] = useState('')

  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const latest = useRef({ slug, customDomain, seoTitle, seoDescription, seoOg, isPublished })
  latest.current = { slug, customDomain, seoTitle, seoDescription, seoOg, isPublished }

  function save(immediate = false) {
    setStatus('saving')
    clearTimeout(timer.current)
    const run = async () => {
      const v = latest.current
      const res = await saveSettings({
        siteId: site.id,
        slug: v.slug,
        customDomain: v.customDomain,
        seoTitle: v.seoTitle,
        seoDescription: v.seoDescription,
        seoOgImageUrl: v.seoOg,
        isPublished: v.isPublished,
      })
      if (res.ok) {
        setStatus('saved')
        setError('')
      } else {
        setStatus('error')
        setError(res.error)
      }
    }
    timer.current = setTimeout(run, immediate ? 0 : 700)
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <SaveIndicator status={status} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="slug">Page URL</Label>
        <div className="flex items-center rounded-xl border border-neutral-200 bg-neutral-50/80 pl-3 focus-within:border-neutral-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-neutral-900/[0.06]">
          <span className="whitespace-nowrap text-sm text-neutral-400">{appHost}/</span>
          <input
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value)
              save()
            }}
            minLength={3}
            maxLength={30}
            autoCapitalize="none"
            className="h-11 min-w-0 flex-1 bg-transparent px-1 text-[15px] outline-none"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="customDomain">Custom domain</Label>
        <Input
          id="customDomain"
          value={customDomain}
          disabled={plan !== 'pro'}
          placeholder={plan === 'pro' ? 'links.example.com' : 'Pro only'}
          onChange={(e) => {
            setCustomDomain(e.target.value)
            save()
          }}
        />
        {plan !== 'pro' && (
          <p className="text-xs text-neutral-400">Upgrade to Pro to connect a custom domain.</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="seoTitle">SEO title</Label>
        <Input
          id="seoTitle"
          value={seoTitle}
          maxLength={120}
          placeholder="How your page appears in search & shares"
          onChange={(e) => {
            setSeoTitle(e.target.value)
            save()
          }}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="seoDescription">SEO description</Label>
        <Textarea
          id="seoDescription"
          value={seoDescription}
          maxLength={300}
          rows={3}
          onChange={(e) => {
            setSeoDescription(e.target.value)
            save()
          }}
        />
      </div>

      <ImageUploadField
        label="Social share image"
        hint="Shown when your link is shared (recommended 1200×630)."
        value={seoOg}
        onChange={(url) => {
          setSeoOg(url)
          save()
        }}
      />

      <div className="flex items-center justify-between rounded-xl border border-neutral-200 p-3">
        <div>
          <p className="text-sm font-medium">Published</p>
          <p className="text-xs text-neutral-400">Make your page live at {appHost}/{slug}</p>
        </div>
        <Switch
          checked={isPublished}
          onCheckedChange={(v) => {
            setIsPublished(v)
            save(true)
          }}
          aria-label="Publish site"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

function SaveIndicator({ status }: { status: SaveStatus }) {
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
  return <span className="text-xs text-neutral-400">Auto-saves</span>
}
