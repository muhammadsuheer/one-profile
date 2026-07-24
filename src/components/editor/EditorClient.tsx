'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { ArrowLeft, Check, Loader2, AlertCircle, Sparkles, Plus, Eye, X } from 'lucide-react'
import type { ThemeConfig } from '@/lib/theme'
import { blockDataSchema, type BlockData, type BlockType } from '@/lib/blocks/schemas'
import { BLOCK_REGISTRY } from '@/lib/blocks/registry'
import type { Block } from '@/db/schema'
import type { EditorBlock, SaveStatus } from '@/components/editor/types'
import { BlockListItem } from '@/components/editor/BlockListItem'
import { BlockOverlayCard } from '@/components/editor/BlockOverlayCard'
import { PhonePreview } from '@/components/editor/PhonePreview'
import { AddBlockModal } from '@/components/editor/AddBlockModal'
import { SharePopover } from '@/components/editor/SharePopover'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  addBlock,
  updateBlockData,
  moveBlock,
  duplicateBlock,
  deleteBlock,
  setBlockVisibility,
  setPublished,
} from '@/app/dashboard/[siteId]/actions'

interface Toast {
  id: number
  message: string
  actionLabel?: string
  onAction?: () => void
}

const byPosition = (a: EditorBlock, b: EditorBlock) => a.position - b.position

export function EditorClient({
  siteId,
  slug,
  appUrl,
  initialIsPublished,
  theme,
  plan,
  initialBlocks,
}: {
  siteId: string
  slug: string
  appUrl: string
  initialIsPublished: boolean
  theme: ThemeConfig
  plan: 'free' | 'pro'
  initialBlocks: Block[]
}) {
  const [blocks, setBlocks] = useState<EditorBlock[]>(() =>
    [...initialBlocks]
      .map((b) => ({
        id: b.id,
        type: b.type,
        position: b.position,
        isVisible: b.isVisible,
        data: b.data,
      }))
      .sort(byPosition),
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [isPublished, setIsPublished] = useState(initialIsPublished)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [addOpen, setAddOpen] = useState(false)
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [origin, setOrigin] = useState(() => appUrl.replace(/\/$/, ''))

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const publicUrl = `${origin}/${slug}`
  const activeBlock = activeId ? blocks.find((b) => b.id === activeId) ?? null : null

  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const deleteTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const toastCounter = useRef(0)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const pushToast = useCallback((message: string, opts?: Partial<Toast>) => {
    const id = ++toastCounter.current
    setToasts((t) => [...t, { id, message, ...opts }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000)
    return id
  }, [])

  const dismissToast = (id: number) => setToasts((t) => t.filter((x) => x.id !== id))

  const runStructural = useCallback(
    async (fn: () => Promise<{ ok: boolean; error?: string }>) => {
      setSaveStatus('saving')
      try {
        const res = await fn()
        setSaveStatus(res.ok ? 'saved' : 'error')
        if (!res.ok && res.error) pushToast(res.error)
      } catch {
        setSaveStatus('error')
        pushToast('Something went wrong.')
      }
    },
    [pushToast],
  )

  // ---- field edits: optimistic + debounced, gated on validity ----
  const handleChange = (id: string, data: BlockData) => {
    setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, data } : b)))
    setSaveStatus('saving')
    clearTimeout(saveTimers.current[id])
    saveTimers.current[id] = setTimeout(async () => {
      if (!blockDataSchema.safeParse(data).success) {
        setSaveStatus('error')
        return
      }
      const res = await updateBlockData({ siteId, blockId: id, data })
      setSaveStatus(res.ok ? 'saved' : 'error')
      if (!res.ok) pushToast(res.error)
    }, 700)
  }

  // ---- structural ops ----
  const handleAdd = async (type: string) => {
    setSaveStatus('saving')
    const res = await addBlock({ siteId, type })
    if (res.ok) {
      const nb = res.data
      setBlocks((bs) =>
        [
          ...bs,
          { id: nb.id, type: nb.type, position: nb.position, isVisible: nb.isVisible, data: nb.data },
        ].sort(byPosition),
      )
      setSelectedId(res.data.id)
      setSaveStatus('saved')
    } else {
      setSaveStatus('error')
      pushToast(res.error)
    }
  }

  const handleDuplicate = async (id: string) => {
    setSaveStatus('saving')
    const res = await duplicateBlock({ siteId, blockId: id })
    if (res.ok) {
      const nb = res.data
      setBlocks((bs) =>
        [
          ...bs,
          { id: nb.id, type: nb.type, position: nb.position, isVisible: nb.isVisible, data: nb.data },
        ].sort(byPosition),
      )
      setSaveStatus('saved')
    } else {
      setSaveStatus('error')
      pushToast(res.error)
    }
  }

  const handleToggleVisibility = (id: string) => {
    const block = blocks.find((b) => b.id === id)
    if (!block) return
    const isVisible = !block.isVisible
    setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, isVisible } : b)))
    void runStructural(() => setBlockVisibility({ siteId, blockId: id, isVisible }))
  }

  const handleDelete = (id: string) => {
    const removed = blocks.find((b) => b.id === id)
    if (!removed) return
    setBlocks((bs) => bs.filter((b) => b.id !== id))
    if (selectedId === id) setSelectedId(null)

    deleteTimers.current[id] = setTimeout(async () => {
      delete deleteTimers.current[id]
      const res = await deleteBlock({ siteId, blockId: id })
      if (!res.ok) {
        pushToast('Could not delete block.')
        setBlocks((bs) => [...bs, removed].sort(byPosition))
      } else {
        setSaveStatus('saved')
      }
    }, 5000)

    pushToast('Block deleted', {
      actionLabel: 'Undo',
      onAction: () => {
        clearTimeout(deleteTimers.current[id])
        delete deleteTimers.current[id]
        setBlocks((bs) => [...bs, removed].sort(byPosition))
      },
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = blocks.findIndex((b) => b.id === active.id)
    const newIndex = blocks.findIndex((b) => b.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return

    const reordered = arrayMove(blocks, oldIndex, newIndex)
    const prevB = reordered[newIndex - 1]
    const nextB = reordered[newIndex + 1]
    let position: number
    if (!prevB) position = nextB ? Math.floor(nextB.position / 2) : 1000
    else if (!nextB) position = prevB.position + 1000
    else position = Math.floor((prevB.position + nextB.position) / 2)
    if (prevB && position <= prevB.position) position = prevB.position + 1

    const movedId = reordered[newIndex].id
    setBlocks(reordered.map((b) => (b.id === movedId ? { ...b, position } : b)))
    void runStructural(() => moveBlock({ siteId, blockId: movedId, position }))
  }

  const handlePublish = (value: boolean) => {
    setIsPublished(value)
    void runStructural(() => setPublished({ siteId, isPublished: value }))
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-100"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-sm font-semibold">/{slug}</p>
            <SaveIndicator status={saveStatus} />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <SharePopover url={publicUrl} published={isPublished} />
          <div className="flex items-center gap-2 rounded-lg border border-neutral-200 py-1 pl-3 pr-1.5">
            <span className="text-sm font-medium text-neutral-600">
              {isPublished ? 'Published' : 'Draft'}
            </span>
            <Switch checked={isPublished} onCheckedChange={handlePublish} aria-label="Publish site" />
          </div>
        </div>
      </div>

      {/* Two panes */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Blocks</h2>
            <Button variant="primary" size="sm" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" /> Add block
            </Button>
          </div>

          {blocks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100">
                <Sparkles className="h-6 w-6 text-neutral-400" />
              </div>
              <p className="mt-3 text-base font-semibold text-neutral-900">Let&apos;s build your page</p>
              <p className="mt-1 text-sm text-neutral-500">Start with one of these — add more anytime.</p>
              <div className="mx-auto mt-5 grid max-w-sm grid-cols-2 gap-2">
                {(
                  [
                    ['profile', 'Profile'],
                    ['linkCard', 'Add a link'],
                    ['socialRow', 'Social icons'],
                    ['emailCapture', 'Email signup'],
                  ] as [BlockType, string][]
                ).map(([type, label]) => {
                  const Icon = BLOCK_REGISTRY[type]?.icon
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleAdd(type)}
                      className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-neutral-700 shadow-sm transition-all hover:border-neutral-900 hover:shadow-md"
                    >
                      {Icon && <Icon className="h-4 w-4 text-neutral-500" />} {label}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={(e) => setActiveId(String(e.active.id))}
              onDragEnd={handleDragEnd}
              onDragCancel={() => setActiveId(null)}
            >
              <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {blocks.map((block) => (
                    <BlockListItem
                      key={block.id}
                      block={block}
                      selected={selectedId === block.id}
                      onSelect={() => setSelectedId((s) => (s === block.id ? null : block.id))}
                      onToggleVisibility={() => handleToggleVisibility(block.id)}
                      onDuplicate={() => handleDuplicate(block.id)}
                      onDelete={() => handleDelete(block.id)}
                      onChange={(data) => handleChange(block.id, data)}
                    />
                  ))}
                </div>
              </SortableContext>
              <DragOverlay>
                {activeBlock ? <BlockOverlayCard block={activeBlock} /> : null}
              </DragOverlay>
            </DndContext>
          )}
        </div>

        {/* Live preview (desktop) — sticky side panel, always fully visible */}
        <div className="hidden lg:sticky lg:top-[72px] lg:block lg:self-start">
          <PhonePreview blocks={blocks} theme={theme} selectedId={selectedId} />
        </div>
      </div>

      {/* Mobile preview trigger + sheet */}
      {!mobilePreviewOpen && (
        <button
          type="button"
          onClick={() => setMobilePreviewOpen(true)}
          className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-lg lg:hidden"
        >
          <Eye className="h-4 w-4" /> Preview
        </button>
      )}
      {mobilePreviewOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-neutral-100 lg:hidden">
          <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3">
            <p className="text-sm font-semibold">Preview</p>
            <button
              type="button"
              onClick={() => setMobilePreviewOpen(false)}
              aria-label="Close preview"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center overflow-auto p-6">
            <PhonePreview blocks={blocks} theme={theme} selectedId={selectedId} hideChrome />
          </div>
        </div>
      )}

      {/* Add block modal */}
      <AddBlockModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} plan={plan} />

      {/* Toasts */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center gap-4 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm text-white shadow-lg"
          >
            <span>{t.message}</span>
            {t.actionLabel && t.onAction && (
              <button
                type="button"
                onClick={() => {
                  t.onAction?.()
                  dismissToast(t.id)
                }}
                className="font-semibold text-[#ff6a8f] hover:text-white"
              >
                {t.actionLabel}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === 'idle') return <span className="text-xs text-neutral-400">All changes saved</span>
  if (status === 'saving')
    return (
      <span className="flex items-center gap-1 text-xs text-neutral-400">
        <Loader2 className="h-3 w-3 animate-spin" /> Saving…
      </span>
    )
  if (status === 'saved')
    return (
      <span className="flex items-center gap-1 text-xs text-green-600">
        <Check className="h-3 w-3" /> Saved
      </span>
    )
  return (
    <span className="flex items-center gap-1 text-xs text-red-600">
      <AlertCircle className="h-3 w-3" /> Not saved
    </span>
  )
}
