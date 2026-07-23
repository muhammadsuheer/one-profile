'use client'

import { useActionState } from 'react'
import { updateSettings, type SettingsState } from '@/app/dashboard/[siteId]/actions'
import type { SeoConfig } from '@/lib/theme'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface SiteSettings {
  id: string
  slug: string
  customDomain: string | null
  isPublished: boolean
  seo: SeoConfig | null
}

export function SettingsForm({
  site,
  plan,
  appHost,
}: {
  site: SiteSettings
  plan: 'free' | 'pro'
  appHost: string
}) {
  const [state, action, pending] = useActionState<SettingsState, FormData>(updateSettings, undefined)

  return (
    <form action={action} className="max-w-xl space-y-5">
      <input type="hidden" name="siteId" value={site.id} />

      <div className="space-y-1.5">
        <Label htmlFor="slug">Page URL</Label>
        <div className="flex items-center rounded-lg border border-neutral-300 pl-3 focus-within:ring-2 focus-within:ring-neutral-400">
          <span className="whitespace-nowrap text-sm text-neutral-400">{appHost}/</span>
          <input
            id="slug"
            name="slug"
            defaultValue={site.slug}
            required
            minLength={3}
            maxLength={30}
            pattern="[a-z0-9-]+"
            autoCapitalize="none"
            className="h-10 min-w-0 flex-1 bg-transparent px-1 text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="customDomain">Custom domain</Label>
        <Input
          id="customDomain"
          name="customDomain"
          defaultValue={site.customDomain ?? ''}
          disabled={plan !== 'pro'}
          placeholder={plan === 'pro' ? 'links.example.com' : 'Pro only'}
        />
        {plan !== 'pro' && (
          <p className="text-xs text-neutral-400">Upgrade to Pro to connect a custom domain.</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="seoTitle">SEO title</Label>
        <Input id="seoTitle" name="seoTitle" defaultValue={site.seo?.title ?? ''} maxLength={120} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="seoDescription">SEO description</Label>
        <Textarea
          id="seoDescription"
          name="seoDescription"
          defaultValue={site.seo?.description ?? ''}
          maxLength={300}
          rows={3}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="seoOgImageUrl">Social share image URL</Label>
        <Input
          id="seoOgImageUrl"
          name="seoOgImageUrl"
          defaultValue={site.seo?.ogImageUrl ?? ''}
          placeholder="https://…"
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={site.isPublished}
          className="h-4 w-4 rounded border-neutral-300"
        />
        <span className="text-sm font-medium">Published</span>
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.ok && <p className="text-sm text-green-600">Settings saved.</p>}

      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? 'Saving…' : 'Save settings'}
      </Button>
    </form>
  )
}
