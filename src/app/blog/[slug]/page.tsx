import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import { getPost, getAllPosts, formatPostDate, type PostBlock } from '@/lib/blog'

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return { title: 'Post not found' }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: 'article' },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Navbar />

      <article className="mx-auto max-w-2xl px-5 py-16 lg:py-20">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> All posts
        </Link>

        <div className="mt-8 flex items-center gap-3 text-xs text-white/45">
          <span className="rounded-full bg-[#F5124A]/15 px-2.5 py-0.5 font-semibold text-[#F5124A]">{post.tag}</span>
          <span>{formatPostDate(post.date)}</span>
          <span>·</span>
          <span>{post.readingMinutes} min read</span>
        </div>

        <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
        <p className="mt-4 text-lg text-white/60">{post.excerpt}</p>
        <p className="mt-6 border-t border-white/10 pt-6 text-sm text-white/40">By {post.author}</p>

        <div className="mt-8 space-y-6">
          {post.body.map((block, i) => (
            <PostBlockView key={i} block={block} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 rounded-2xl border border-[#F5124A]/20 bg-[#F5124A]/[0.06] p-7 text-center">
          <h2 className="text-xl font-bold tracking-tight">Put everything you are on one page.</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-white/60">
            Build your bio page in minutes — free, no credit card required.
          </p>
          <Link
            href="/signup"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#F5124A] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Get started free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  )
}

function PostBlockView({ block }: { block: PostBlock }) {
  if (typeof block === 'string') {
    return <p className="text-lg leading-relaxed text-white/70">{block}</p>
  }
  if ('h' in block) {
    return <h2 className="pt-2 text-2xl font-bold tracking-tight">{block.h}</h2>
  }
  return (
    <ul className="space-y-2.5">
      {block.ul.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-lg leading-relaxed text-white/70">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F5124A]" />
          {item}
        </li>
      ))}
    </ul>
  )
}
