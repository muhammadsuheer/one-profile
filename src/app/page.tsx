import Link from 'next/link'
import {
  Blocks,
  Palette,
  BarChart3,
  Mail,
  Globe,
  Video,
  Check,
} from 'lucide-react'
import HeroCollab from '@/components/marketing/HeroCollab'

const FEATURES = [
  { icon: Blocks, title: 'Block-based editor', body: 'Drag, drop and reorder blocks. Links, video, galleries, products and more.' },
  { icon: Palette, title: 'Themes that fit', body: 'Three presets, a custom accent color, fonts and button styles — live preview as you go.' },
  { icon: BarChart3, title: 'Real analytics', body: 'Views, clicks, click-through rate, top links, devices and countries.' },
  { icon: Mail, title: 'Grow your list', body: 'Capture emails right on your page and export subscribers to CSV anytime.' },
  { icon: Video, title: 'Auto-updating feeds', body: 'Show your latest YouTube videos — refreshed automatically for you.' },
  { icon: Globe, title: 'Your own domain', body: 'Connect a custom domain and remove branding on the Pro plan.' },
]

const STEPS = [
  { n: '1', title: 'Create your page', body: 'Sign up and claim your unique URL in seconds.' },
  { n: '2', title: 'Add your blocks', body: 'Build your page from blocks and arrange it exactly how you want.' },
  { n: '3', title: 'Publish & share', body: 'Go live on your link, track every click, and grow.' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Hero (collaborative-editing style, animated) */}
      <HeroCollab />

      {/* Features */}
      <section className="border-t border-white/5 bg-white/[0.015]">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Everything your bio link should be
          </h2>
          <p className="mt-3 max-w-lg text-white/60">
            Not just a list of links — a real page you control, with the tools to grow.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5124A]/10 text-[#F5124A]">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-white/55">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n}>
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-sm font-semibold text-[#F5124A]">
                {s.n}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-white/55">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-white/5 bg-white/[0.015]">
        <div className="mx-auto max-w-4xl px-5 py-16 lg:py-24">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Simple pricing</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <PlanCard
              name="Free"
              price="$0"
              cta="Start free"
              features={['1 site', 'Unlimited links', 'Core blocks', '7-day analytics', 'Email capture']}
            />
            <PlanCard
              name="Pro"
              price="$9"
              highlight
              cta="Go Pro"
              features={[
                'Unlimited sites',
                'All blocks incl. gallery, product, YouTube',
                'Custom domain',
                'Full 30-day analytics',
                'Remove branding',
              ]}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-white/40 sm:flex-row">
          <span className="font-semibold text-white/70">FolioPage</span>
          <span>Built with Next.js. © {2026}</span>
        </div>
      </footer>
    </div>
  )
}

function PlanCard({
  name,
  price,
  features,
  cta,
  highlight,
}: {
  name: string
  price: string
  features: string[]
  cta: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        highlight ? 'border-[#F5124A]/40 bg-[#F5124A]/[0.06]' : 'border-white/10 bg-white/[0.02]'
      }`}
    >
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-2xl font-bold">
          {price}
          <span className="text-sm font-normal text-white/40">/mo</span>
        </p>
      </div>
      <ul className="mt-5 space-y-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-white/70">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#F5124A]" />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href="/signup"
        className={`mt-6 block rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition-opacity hover:opacity-90 ${
          highlight ? 'bg-[#F5124A] text-white' : 'bg-white/10 text-white'
        }`}
      >
        {cta}
      </Link>
    </div>
  )
}
