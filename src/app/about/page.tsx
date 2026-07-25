import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Blocks, Shield, LineChart, Heart } from 'lucide-react'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: 'About',
  description: 'FolioPage helps creators, coaches and founders put everything they are on one page.',
}

const VALUES = [
  { icon: Blocks, title: 'Simple by default', body: 'Blocks you can drag, drop and reorder. No builders to learn, no code to write.' },
  { icon: LineChart, title: 'Honest analytics', body: 'Real numbers behind every click — so you make decisions, not guesses.' },
  { icon: Shield, title: 'Yours to own', body: 'Your domain, your data, your brand. Export anytime; no lock-in.' },
  { icon: Heart, title: 'Built for creators', body: 'Musicians, coaches, writers and founders — people with something to share.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-white/10 bg-[#08080A]">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center lg:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/70">
            Our story
          </span>
          <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            One link should do more.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/60">
            Your audience gives you a single tap. FolioPage turns that tap into a page you fully
            control — one that looks like you, works for you, and tells you what’s working.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-3xl px-5 py-20 lg:py-24">
          <div className="space-y-6 text-lg leading-relaxed text-white/70">
            <p>
              FolioPage started with a simple frustration: the “link in bio” had become a boring list
              of blue links. Creators were pouring themselves into their work, then sending fans to a
              page that felt like an afterthought.
            </p>
            <p>
              We think your page should feel like the best part of your brand — fast, beautiful and
              genuinely useful. So we built it from blocks: add a profile, your links, a video, an
              email capture, a booking widget, and rearrange it all in seconds with a live preview.
            </p>
            <p>
              Under the hood it’s a real product, not a template — server-rendered pages, honest
              analytics, custom domains and email capture, all designed to help you grow the audience
              you’ve earned.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-white/10 bg-[#08080A]">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:py-24">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">What we care about</h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5124A]/10 text-[#F5124A]">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-semibold">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/55">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0A0A0B]">
        <div className="mx-auto max-w-3xl px-5 py-24 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to build yours?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/60">
            Claim your link and publish in minutes — free, no credit card required.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#F5124A] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_-8px_rgba(245,18,74,0.7)] transition-opacity hover:opacity-90"
          >
            Get started free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
