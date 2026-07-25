import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, MessageCircle, ArrowRight } from 'lucide-react'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the FolioPage team — support, sales or general questions.',
}

const CHANNELS = [
  {
    icon: Mail,
    title: 'Email support',
    body: 'The fastest way to reach us. We typically reply within one business day.',
    cta: 'support@foliopage.site',
    href: 'mailto:support@foliopage.site',
  },
  {
    icon: MessageCircle,
    title: 'Sales & Pro',
    body: 'Questions about Pro, custom domains, or upgrading a team? Talk to us.',
    cta: 'sales@foliopage.site',
    href: 'mailto:sales@foliopage.site',
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Navbar />

      <section className="border-b border-white/10 bg-[#08080A]">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center lg:py-24">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">Get in touch</h1>
          <p className="mx-auto mt-5 max-w-lg text-lg text-white/60">
            Questions about your page, billing, or something you'd like to see built? We'd love to hear it.
          </p>
        </div>
      </section>

      <section className="bg-[#0A0A0B]">
        <div className="mx-auto max-w-4xl px-5 py-16 lg:py-20">
          <div className="grid gap-4 sm:grid-cols-2">
            {CHANNELS.map((c) => (
              <a
                key={c.title}
                href={c.href}
                className="group rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5124A]/10 text-[#F5124A]">
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-semibold">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/55">{c.body}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#F5124A]">
                  {c.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
            <h2 className="text-xl font-semibold">Looking for answers right now?</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/55">
              Most billing and feature questions are already answered on our pricing page.
            </p>
            <Link
              href="/pricing"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/85 hover:bg-white/5"
            >
              View pricing & FAQ <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
