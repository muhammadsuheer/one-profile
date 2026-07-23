'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PanelsTopLeft, Palette, Users, BarChart3, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { seg: 'editor', label: 'Editor', icon: PanelsTopLeft },
  { seg: 'design', label: 'Design', icon: Palette },
  { seg: 'audience', label: 'Audience', icon: Users },
  { seg: 'analytics', label: 'Analytics', icon: BarChart3 },
  { seg: 'settings', label: 'Settings', icon: Settings },
] as const

export function SiteTabs({ siteId }: { siteId: string }) {
  const pathname = usePathname()

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-neutral-200">
      {TABS.map((t) => {
        const href = `/dashboard/${siteId}/${t.seg}`
        const active = pathname === href || pathname.startsWith(`${href}/`)
        const Icon = t.icon
        return (
          <Link
            key={t.seg}
            href={href}
            className={cn(
              'flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800',
            )}
          >
            <Icon className="h-4 w-4" />
            {t.label}
          </Link>
        )
      })}
    </nav>
  )
}
