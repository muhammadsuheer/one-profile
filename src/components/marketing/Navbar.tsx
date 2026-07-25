'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import AnnouncementBar from './AnnouncementBar'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
  { href: '/blog', label: 'Blog' },
]

/**
 * Marketing navbar: an announcement strip above a nav row.
 *
 * Both rows behave as one unit — the whole thing hides on scroll-down and comes
 * back on scroll-up, so nothing is pinned to the top while reading. Because they
 * move together, the sticky wrapper itself carries the transform; translating
 * only the nav row (an earlier version) meant it had to pass behind the strip,
 * which needed explicit layering and slid the row off the top of the viewport
 * when it got that wrong.
 *
 * Motion drives the slide. Tailwind's translate utilities can't: in v4 they
 * compile to `translate: var(--tw-translate-*)` and those custom properties are
 * declared `syntax: "*"`, which isn't interpolatable, so the header snapped
 * between states with no animation.
 *
 * `SCROLL_DELTA` matters too. Reacting to every scroll event meant a stray pixel
 * of trackpad momentum in the opposite direction flipped the state, so the header
 * flickered while scrolling.
 *
 * Hiding is suppressed while the mobile menu is open, so an open menu can't be
 * dragged off-screen by a scroll.
 */
const SCROLL_DELTA = 8 // px of movement before direction is believed
const HIDE_AFTER = 96 // don't hide while still near the top of the page
export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    lastY.current = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const delta = y - lastY.current

      // Always show again near the top, whichever way we're moving.
      if (y <= HIDE_AFTER) {
        setHidden(false)
        lastY.current = y
        return
      }
      // Ignore small movements so momentum jitter can't flip the state.
      if (Math.abs(delta) < SCROLL_DELTA) return

      setHidden(delta > 0)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <motion.div
      className="sticky top-0 z-50"
      animate={{ y: hidden && !open ? '-100%' : '0%' }}
      transition={{ type: 'spring', stiffness: 380, damping: 34, mass: 0.9 }}
    >
      <AnnouncementBar />

      <header className="border-b border-white/10 bg-[#0A0A0B] text-white">
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
    </motion.div>
  )
}
