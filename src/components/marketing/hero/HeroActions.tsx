import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { ACCENT } from './tokens'

/**
 * Hero call to action: one unmistakable primary button, with the secondary
 * path demoted to a quiet text link underneath. A single loud button reads far
 * more decisively than two competing ones — the reference does the same.
 */
export default function HeroActions() {
  return (
    <div className="flex flex-col items-center">
      <Link
        href="/signup"
        className="inline-flex items-center gap-2.5 rounded-xl px-7 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_0_44px_-10px_rgba(245,18,74,0.85)] transition-transform duration-200 hover:scale-[1.02]"
        style={{ backgroundColor: ACCENT }}
      >
        Start building free
        <ArrowUpRight className="h-4 w-4" />
      </Link>

      <Link
        href="/ava"
        className="mt-5 text-sm text-white/45 underline-offset-4 transition-colors hover:text-white/80 hover:underline"
      >
        or see a live example
      </Link>
    </div>
  )
}
