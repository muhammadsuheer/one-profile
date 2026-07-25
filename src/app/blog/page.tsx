import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import { getAllPosts, formatPostDate } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Playbooks, product updates and ideas on building a bio page that grows your audience.',
}

export default function BlogPage() {
  const posts = getAllPosts()
  const [featured, ...rest] = posts

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Navbar />

      {/* Header */}
      <section className="border-b border-white/10 bg-[#08080A]">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:py-20">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">The FolioPage blog</h1>
          <p className="mt-4 max-w-lg text-lg text-white/60">
            Playbooks, product updates and ideas on turning one link into real growth.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:py-20">
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group mb-10 block rounded-3xl border border-white/10 bg-white/[0.02] p-8 transition-colors hover:border-white/20 hover:bg-white/[0.04] lg:p-10"
            >
              <div className="flex items-center gap-3 text-xs text-white/45">
                <span className="rounded-full bg-[#F5124A]/15 px-2.5 py-0.5 font-semibold text-[#F5124A]">
                  {featured.tag}
                </span>
                <span>{formatPostDate(featured.date)}</span>
                <span>·</span>
                <span>{featured.readingMinutes} min read</span>
              </div>
              <h2 className="mt-4 max-w-2xl text-balance text-2xl font-bold tracking-tight sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 max-w-2xl text-white/60">{featured.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#F5124A]">
                Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className="flex items-center gap-2 text-xs text-white/45">
                  <span className="rounded-full bg-white/5 px-2 py-0.5 font-medium text-white/60">{post.tag}</span>
                  <span>{post.readingMinutes} min</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{post.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">{post.excerpt}</p>
                <span className="mt-4 text-xs text-white/40">{formatPostDate(post.date)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
