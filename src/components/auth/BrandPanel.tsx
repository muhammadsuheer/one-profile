import Link from 'next/link'
import { Check } from 'lucide-react'

const POINTS = ['Block-based editor with live preview', 'Real-time clicks & audience analytics', 'Custom themes, domains & no branding']

export function BrandPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-[#0A0A0B] p-12 text-white lg:flex lg:flex-col lg:justify-between">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full bg-[#F5124A]/25 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-[#F5124A]/10 blur-[110px]" />

      <Link href="/" className="relative z-10 text-lg font-semibold tracking-tight">
        FolioPage
      </Link>

      <div className="relative z-10">
        <h2 className="max-w-sm text-balance text-4xl font-bold leading-[1.1]">
          Your whole world, behind one link.
        </h2>
        <p className="mt-4 max-w-sm text-white/55">
          Build a beautiful bio page, capture emails, and see exactly what your audience clicks — in
          minutes.
        </p>
        <ul className="mt-8 space-y-3">
          {POINTS.map((p) => (
            <li key={p} className="flex items-center gap-2.5 text-sm text-white/75">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F5124A]/15 text-[#F5124A]">
                <Check className="h-3 w-3" />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative z-10 text-sm text-white/35">Trusted by creators to power their link in bio.</p>
    </div>
  )
}
