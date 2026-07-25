import type { Metadata } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple pricing for FolioPage — start free, upgrade to Pro for unlimited sites, custom domains and full analytics.',
}

const FAQ = [
  { q: 'Is the Free plan really free?', a: 'Yes. One site, unlimited links, core blocks, email capture and 7-day analytics — no credit card, no time limit.' },
  { q: 'Can I use my own domain?', a: 'Custom domains are a Pro feature. Add your domain in the dashboard, create one DNS record, and we route it to your page automatically.' },
  { q: 'Can I cancel anytime?', a: 'Absolutely. Downgrade whenever you like — your page stays live on the Free plan and your data is always exportable.' },
  { q: 'Do you take a cut of my sales?', a: 'Never. FolioPage is a flat subscription — what you earn from your links and products is entirely yours.' },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Navbar />

      {/* Header */}
      <section className="border-b border-white/10 bg-[#08080A]">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center lg:py-24">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Simple, honest pricing
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-lg text-white/60">
            Start free and upgrade when you grow. No sales cuts, no hidden fees.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-4xl px-5 py-16 lg:py-20">
          <div className="grid gap-4 md:grid-cols-2">
            <PlanCard
              name="Free"
              price="$0"
              blurb="Everything you need to launch."
              cta="Start free"
              features={['1 site', 'Unlimited links', 'Core blocks', 'Email capture', '7-day analytics', 'FolioPage QR code']}
            />
            <PlanCard
              name="Pro"
              price="$9"
              blurb="For creators ready to grow."
              highlight
              cta="Go Pro"
              features={[
                'Everything in Free',
                'Unlimited sites',
                'All blocks (gallery, product, YouTube, Spotify, Calendly…)',
                'Custom domain',
                'Full 30-day analytics + CSV export',
                'AI copy tools',
                'Remove FolioPage branding',
              ]}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#08080A]">
        <div className="mx-auto max-w-3xl px-5 py-20 lg:py-24">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Questions & answers</h2>
          <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
            {FAQ.map((item) => (
              <div key={item.q} className="py-6">
                <h3 className="font-semibold">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function PlanCard({
  name,
  price,
  blurb,
  features,
  cta,
  highlight,
}: {
  name: string
  price: string
  blurb: string
  features: string[]
  cta: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-7 ${
        highlight ? 'border-[#F5124A]/40 bg-[#F5124A]/[0.06]' : 'border-white/10 bg-white/[0.02]'
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{name}</h3>
        {highlight && (
          <span className="rounded-full bg-[#F5124A] px-2.5 py-0.5 text-[11px] font-semibold text-white">
            Most popular
          </span>
        )}
      </div>
      <p className="mt-4 text-4xl font-bold">
        {price}
        <span className="text-base font-normal text-white/40">/mo</span>
      </p>
      <p className="mt-2 text-sm text-white/55">{blurb}</p>
      <ul className="mt-6 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-white/75">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#F5124A]" />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href="/signup"
        className={`mt-7 block rounded-xl px-4 py-3 text-center text-sm font-semibold transition-opacity hover:opacity-90 ${
          highlight ? 'bg-[#F5124A] text-white shadow-[0_0_40px_-8px_rgba(245,18,74,0.7)]' : 'bg-white/10 text-white'
        }`}
      >
        {cta}
      </Link>
    </div>
  )
}
