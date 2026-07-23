'use client'

import type { CSSProperties } from 'react'
import { Eye } from 'lucide-react'
import { themeToCssVars, type ThemeConfig } from '@/lib/theme'
import { renderBlock, blockRendersContent } from '@/lib/blocks/registry'
import type { EditorBlock } from '@/components/editor/types'

export function PhonePreview({ blocks, theme }: { blocks: EditorBlock[]; theme: ThemeConfig }) {
  const style = {
    ...themeToCssVars(theme),
    fontFamily: 'var(--font-page)',
  } as unknown as CSSProperties

  const visible = blocks.filter((b) => b.isVisible && blockRendersContent(b.data))

  return (
    <div>
      <div className="mb-2 flex items-center justify-center gap-1.5 text-xs font-medium text-neutral-400">
        <Eye className="h-3.5 w-3.5" /> Live preview
      </div>
      <div className="mx-auto w-[320px] max-w-full rounded-[44px] bg-black p-2.5 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.5)] ring-1 ring-black/10">
        <div
          className="relative h-[640px] overflow-hidden rounded-[36px] bg-[var(--bg)]"
          style={style}
        >
          {/* notch */}
          <div className="absolute left-1/2 top-2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-black/90" />
          <div className="h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="mx-auto flex w-full max-w-[440px] flex-col gap-3 px-4 pb-12 pt-11">
              {visible.length === 0 ? (
                <div className="flex flex-col items-center gap-2 pt-24 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface)]">
                    <Eye className="h-5 w-5 text-[var(--text-muted)]" />
                  </div>
                  <p className="text-sm font-medium text-[var(--text)]">Your page is empty</p>
                  <p className="max-w-[200px] text-xs text-[var(--text-muted)]">
                    Add a block or fill one in to see it here.
                  </p>
                </div>
              ) : (
                visible.map((b) => <div key={b.id}>{renderBlock(b)}</div>)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
