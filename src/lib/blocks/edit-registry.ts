import type { ComponentType } from 'react'
import type { BlockData, BlockType } from '@/lib/blocks/schemas'
import { ProfileEdit } from '@/components/blocks/edit/ProfileEdit'
import { SocialRowEdit } from '@/components/blocks/edit/SocialRowEdit'
import { LinkCardEdit } from '@/components/blocks/edit/LinkCardEdit'
import { EmailCaptureEdit } from '@/components/blocks/edit/EmailCaptureEdit'
import { VideoCardEdit } from '@/components/blocks/edit/VideoCardEdit'
import { GalleryEdit } from '@/components/blocks/edit/GalleryEdit'
import { RichTextEdit } from '@/components/blocks/edit/RichTextEdit'
import { DividerEdit } from '@/components/blocks/edit/DividerEdit'
import { ProductEdit } from '@/components/blocks/edit/ProductEdit'
import { YoutubeFeedEdit } from '@/components/blocks/edit/YoutubeFeedEdit'

/**
 * Editor forms, kept in a SEPARATE map from the render registry so that
 * importing block rendering (public page, server) never pulls client-side
 * editor code into the visitor bundle (§9: public page ships ~no client JS).
 * Imported only from the editor's client components.
 *
 * The §4 rule still holds — a new block adds: 1 Zod variant, 1 render entry
 * (registry.tsx), 1 edit component, 1 entry here.
 */
export interface BlockEditProps {
  data: BlockData
  onChange: (data: BlockData) => void
}

export const BLOCK_EDITORS: Partial<Record<BlockType, ComponentType<BlockEditProps>>> = {
  profile: ProfileEdit,
  socialRow: SocialRowEdit,
  linkCard: LinkCardEdit,
  emailCapture: EmailCaptureEdit,
  videoCard: VideoCardEdit,
  gallery: GalleryEdit,
  richText: RichTextEdit,
  divider: DividerEdit,
  product: ProductEdit,
  youtubeFeed: YoutubeFeedEdit,
}
