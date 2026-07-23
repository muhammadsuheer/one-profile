import type { BlockData } from '@/lib/blocks/schemas'

export interface EditorBlock {
  id: string
  type: string
  position: number
  isVisible: boolean
  data: BlockData
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
