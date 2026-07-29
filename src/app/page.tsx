import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import Hero from '@/components/marketing/hero'
import AudienceTicker from '@/components/marketing/AudienceTicker'
import JobTabs from '@/components/marketing/JobTabs'
import WorksWith from '@/components/marketing/WorksWith'
import { MonoCta, SectionHeader } from '@/components/marketing/section'

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

      {/* Everything below the hero stands on the hero's own grid.
          The three columns and the framing rules used to stop where the hero did,
          which made the rest of the page read as a different surface bolted on
          underneath. One backdrop for the whole run fixes that — same container
          (max-w-7xl px-5) and the same 33.3% measurements as the hero, so the
          lines cross the seam without a kink.

          The sections themselves carry no background any more. They alternated
          between #0A0A0B and #08080A, a two-value difference nobody could see,
          and an opaque background would have covered these lines. What separates
          them now is the horizontal rule each one already had, which is what makes
          the whole thing read as a grid rather than as a stack. */}
      <div className="relative">
        {/* The backdrop is two layers, and the split is the point.

            The column LINES sit under everything: content cells carry an opaque
            background, so a line is visible only where a cell is genuinely empty —
            never running through a paragraph or between the letters of a button.

            The RAILS sit above everything (z-10, pointer-events-none): the edge
            cells span the full content width, so their opaque backgrounds would
            cover a rail drawn underneath, cutting the frame every time a band is
            fully tiled. Drawing the rails on top keeps the frame unbroken — and
            since every cell pads its content inward, the rails never touch text. */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="mx-auto h-full max-w-7xl px-5">
            <div className="page-grid h-full" />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
          <div className="mx-auto h-full max-w-7xl px-5">
            <div className="h-full border-x border-white/[0.09]" />
          </div>
        </div>

      {/* Who it's for.
          No background and no top border, so this and the hero read as one
          continuous field — the reference runs its hero straight into its logo
          row the same way, and a border here put a hard seam right under the CTA.
          The eyebrow used to name the same four audiences the row below listed,
          which was pure repetition; it sets up the row instead. Framed as who the
          product is built for rather than who "loves" it, since we can't stand
          behind a testimonial claim. */}
      <section className="relative">
        <div className="pb-16 pt-4">
          <p className="mx-auto max-w-7xl px-5 text-center font-mono text-xs font-medium uppercase tracking-[0.14em] text-white/30">
            {/* The plate hugs the text so a column line can't run between its
                letters on a narrow screen, while the band around it stays open. */}
            <span className="bg-[#0A0A0B] px-4">Built for people with something to share</span>
          </p>
          {/* Full-bleed on purpose — the ticker's edge fade needs to run to the
              viewport edges, not stop at the container. */}
          <div className="mt-8">
            <AudienceTicker />
          </div>
        </div>
        {/* The section's bottom rule, clipped to the rails: a border on the
            <section> would run the full viewport and cross the frame. */}
        <div className="mx-auto max-w-7xl px-5">
          <div className="border-b border-white/10" />
        </div>
      </section>

      {/* What the page is for.
          This replaced a six-card feature grid that sat above it. The grid listed
          capabilities in the abstract — "block-based editor", "real analytics" —
          and this section shows three of them doing work, with the artwork to prove
          it. Keeping both meant saying the same things twice, the weaker version
          first. It carries the `features` id the footer links to. */}
      <JobTabs />

      {/* What it plugs into. Sits after the three jobs on purpose: "can it do the
          thing I need?" comes first, "does it work with what I already have?"
          second. */}
      <WorksWith />

      {/* How it works — a header band, then one cell per step, one step per
          background column. */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-5">
          <div className="border-b border-white/10">
            <SectionHeader
              eyebrow="How it works"
              title="Live in three steps."
              titleMuted="About ten minutes."
              body="No templates to fight and no code anywhere — claim your link, arrange your blocks, and publish when it looks right."
            />
            <div className="grid md:grid-cols-3">
              {STEPS.map((s, i) => (
                <div
                  key={s.n}
                  className={`bg-[#0A0A0B] px-6 py-10 lg:px-10 lg:py-12 ${
                    i > 0 ? 'border-t border-white/10 md:border-l md:border-t-0' : ''
                  }`}
                >
                  <p className="font-mono text-xs font-medium text-[#F5124A]">0{s.n}</p>
                  <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/55">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-5">
          <div className="border-b border-white/10 bg-[#0A0A0B] px-6 py-16 lg:px-10 lg:py-20">
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-xl">
                <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                  Start free. <span className="text-white/35">Upgrade when you grow.</span>
                </h2>
                <p className="mt-3 text-lg text-white/55">
                  The Free plan gives you a full page and real analytics. Go Pro for unlimited
                  sites, every block, a custom domain and no branding.
                </p>
              </div>
              <MonoCta href="/pricing">See full pricing</MonoCta>
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="relative">
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
      </div>

      <Footer />
    </div>
  )
}
