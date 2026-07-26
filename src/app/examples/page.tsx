import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Blocks, Palette, Eye } from 'lucide-react'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import ExampleBrowser from '@/components/marketing/ExampleBrowser'

export const metadata: Metadata = {
  title: 'Examples',
  description:
    'Real FolioPage pages across five fields — musician, coach, photographer, podcaster, founder. See what yours could look like.',
}

/**
 * The examples gallery.
 *
 * Replaces a single "see a live example" link, which asked a visitor to imagine
 * their own field from someone else's page. Five pages across five fields answers
 * the real question — "can it do the thing *I* need?"
 *
 * The browsing itself lives in ExampleBrowser: pick a field, see that page render
 * in place. An earlier version was a grid of cards that linked out, which meant
 * comparing two examples took a round trip through the back button, and the page
 * you landed on gave no hint the other four existed.
 *
 * The pages are real and published, seeded by `scripts/seed-examples.ts`.
 */
export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Navbar />

      <section className="border-b border-white/10 bg-[#08080A]">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:py-24">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/30">
            Real pages, not screenshots
          </p>
          <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            See what yours could look like.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/55">
            Five published pages across five fields. Every one is live — open any of
            them and you&apos;re looking at the product, rendering real content.
          </p>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:py-20">
          <ExampleBrowser />
        </div>
      </section>

      {/* What to notice — turns browsing into understanding */}
      <section className="border-b border-white/10 bg-[#08080A]">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:py-24">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            What to look for
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Blocks,
                title: 'No two are the same shape',
                body: 'Each page uses a different mix of blocks in a different order. You build the page your field needs, not the one a template decided on.',
              },
              {
                icon: Palette,
                title: 'No two are the same colour',
                body: 'Five palettes from the twenty built in, each with its own accent, fonts and button shape. Nothing here says “made with a builder”.',
              },
              {
                icon: Eye,
                title: 'The numbers are real',
                body: 'The view count at the bottom of each page is its actual traffic — the same figure its owner sees in analytics, not a decoration.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5124A]/10 text-[#F5124A]">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-semibold">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/55">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0A0A0B]">
        <div className="mx-auto max-w-3xl px-5 py-24 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Yours takes about ten minutes.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/60">
            Claim your link, drag in the blocks you need, publish. Free, no credit card.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#F5124A] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_0_40px_-8px_rgba(245,18,74,0.7)] transition-opacity hover:opacity-90"
          >
            Start building free
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
