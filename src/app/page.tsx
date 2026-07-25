import Link from 'next/link'
import {
  Blocks,
  Palette,
  BarChart3,
  Mail,
  Globe,
  Video,
  ArrowRight,
} from 'lucide-react'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import Hero from '@/components/marketing/hero'

const FEATURES = [
  { icon: Blocks, title: 'Block-based editor', body: 'Drag, drop and reorder blocks. Links, video, galleries, products and more.' },
  { icon: Palette, title: 'Themes that fit', body: '20 palettes, a custom accent color, fonts and button styles — live preview as you go.' },
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
      <Navbar />
      <Hero />

      {/* Social proof strip */}
      <section className="border-b border-white/10 bg-[#08080A]">
        <div className="mx-auto max-w-7xl px-5 py-10">
          <p className="text-center text-xs font-medium uppercase tracking-wider text-white/35">
            Loved by creators, coaches, founders and musicians
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-white/40">
            {['Musicians', 'Podcasters', 'Coaches', 'Founders', 'Artists', 'Writers'].map((n) => (
              <span key={n} className="text-sm font-semibold tracking-tight">{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b border-white/10 bg-[#0A0A0B]">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:py-28">
          <div className="max-w-2xl">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Everything your bio link should be
            </h2>
            <p className="mt-3 text-lg text-white/55">
              Not just a list of links — a real page you control, with the tools to grow.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5124A]/10 text-[#F5124A]">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/55">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-white/10 bg-[#08080A]">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:py-28">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Live in three steps</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F5124A]/30 bg-[#F5124A]/10 text-sm font-semibold text-[#F5124A]">
                  {s.n}
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/55">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="border-b border-white/10 bg-[#0A0A0B]">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:py-28">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Start free. Upgrade when you grow.
              </h2>
              <p className="mt-3 text-lg text-white/55">
                The Free plan gives you a full page and real analytics. Go Pro for unlimited sites,
                every block, a custom domain and no branding.
              </p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-semibold text-white/90 hover:bg-white/5"
            >
              See full pricing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-[#08080A]">
        <div className="mx-auto max-w-7xl px-5 py-24">
          <div className="relative overflow-hidden rounded-3xl border border-[#F5124A]/20 bg-gradient-to-b from-[#1a0a12] to-[#0A0A0B] px-6 py-16 text-center">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[120%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(245,18,74,0.22),transparent_60%)]" />
            <h2 className="relative text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Your whole world, on one page.
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-white/60">
              Claim your link and publish your page in minutes — free, no credit card required.
            </p>
            <Link
              href="/signup"
              className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-[#F5124A] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_-8px_rgba(245,18,74,0.7)] transition-opacity hover:opacity-90"
            >
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
