'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
  { href: '/blog', label: 'Blog' },
]

/**
 * Marketing navbar. The announcement strip always stays pinned at the very
 * top; the nav row below it hides on scroll-down and reappears on scroll-up
 * (a standard "auto-hide" header) so it never eats screen space while reading,
 * but is always one upward scroll away.
 */
export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [navHidden, setNavHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    lastY.current = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const goingDown = y > lastY.current
      const pastThreshold = y > 96 // don't hide while still near the top
      setNavHidden(goingDown && pastThreshold)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <div className="sticky top-0 z-50">
      {/* Announcement bar — always pinned, never hides */}
      <Link
        href="/blog"
        className="relative block overflow-hidden bg-gradient-to-r from-[#4c0e22] via-[#F5124A] to-[#7a1130] text-center text-white"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_120%_at_50%_0%,rgba(255,255,255,0.18),transparent_70%)]" />
        <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium">
          <span className="hidden rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide sm:inline">
            New
          </span>
          Connect your own custom domain in one click
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </Link>

      {/* Nav bar — auto-hides on scroll-down, reappears on scroll-up */}
      <header
        className={`border-b border-white/10 bg-[#0A0A0B] text-white transition-transform duration-300 ease-out ${
          navHidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5124A] text-sm font-bold text-white">
              F
            </span>
            <span className="text-lg font-semibold tracking-tight">FolioPage</span>
          </Link>

          {/* Center links (desktop) */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href) ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right actions (desktop) */}
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/login"
              className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white/85 transition-colors hover:bg-white/5"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-[#F5124A] px-4 py-2 text-sm font-semibold text-white shadow-[0_0_30px_-8px_rgba(245,18,74,0.7)] transition-opacity hover:opacity-90"
            >
              Start building
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="border-t border-white/10 bg-[#0A0A0B] px-5 py-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive(item.href) ? 'bg-white/5 text-white' : 'text-white/70'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3">
              <Link
                href="/login"
                className="rounded-lg border border-white/15 px-4 py-2.5 text-center text-sm font-semibold text-white/85"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-[#F5124A] px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Start building
              </Link>
            </div>
          </div>
        )}
      </header>
    </div>
  )
}
