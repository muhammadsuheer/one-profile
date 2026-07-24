import type { BlockData } from '@/lib/blocks/schemas'
import type { Block } from '@/db/schema'

export interface EditorBlock {
  id: string
  type: string
  position: number
  isVisible: boolean
  /** ISO strings (UTC) or null — optional scheduling window. */
  visibleFrom: string | null
  visibleUntil: string | null
  data: BlockData
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

/** DB row -> editor state. Dates are serialized to ISO strings for the UI. */
export function toEditorBlock(b: Block): EditorBlock {
  return {
    id: b.id,
    type: b.type,
    position: b.position,
    isVisible: b.isVisible,
    visibleFrom: b.visibleFrom ? b.visibleFrom.toISOString() : null,
    visibleUntil: b.visibleUntil ? b.visibleUntil.toISOString() : null,
    data: b.data,
  }
}
