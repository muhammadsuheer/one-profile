import type { ReactNode } from 'react'
import {
  UserCircle,
  Share2,
  Link2,
  Mail,
  Video,
  Images,
  Type,
  Minus,
  ShoppingBag,
  Clapperboard,
  HelpCircle,
  Quote,
  type LucideIcon,
} from 'lucide-react'
import type { BlockType, BlockData } from '@/lib/blocks/schemas'
import { isHttpUrl } from '@/lib/utils'
import { isSocialLink } from '@/lib/social'
import { ProfileBlock } from '@/components/blocks/render/ProfileBlock'
import { SocialRowBlock } from '@/components/blocks/render/SocialRowBlock'
import { LinkCardBlock } from '@/components/blocks/render/LinkCardBlock'
import { EmailCaptureBlock } from '@/components/blocks/render/EmailCaptureBlock'
import { VideoCardBlock } from '@/components/blocks/render/VideoCardBlock'
import { GalleryBlock } from '@/components/blocks/render/GalleryBlock'
import { RichTextBlock } from '@/components/blocks/render/RichTextBlock'
import { DividerBlock } from '@/components/blocks/render/DividerBlock'
import { ProductBlock } from '@/components/blocks/render/ProductBlock'
import { YoutubeFeedBlock } from '@/components/blocks/render/YoutubeFeedBlock'
import { FaqBlock } from '@/components/blocks/render/FaqBlock'
import { TestimonialBlock } from '@/components/blocks/render/TestimonialBlock'

export interface RenderArgs {
  id: string
  data: BlockData
}

export type BlockGroup = 'basic' | 'media' | 'commerce'

export interface BlockRegistryEntry {
  type: BlockType
  label: string
  description: string
  icon: LucideIcon
  group: BlockGroup
  proOnly: boolean
  /** New blocks default to this payload in the editor. */
  defaultData: BlockData
  /** Server-render the block. Narrows `data` on its discriminant — no casts. */
  render: (args: RenderArgs) => ReactNode
  /** One-line summary of the block for the editor list. */
  summary: (data: BlockData) => string
}

/**
 * THE single block registry (§4). Adding a block type = one Zod variant +
 * one render component + one edit component (Phase 4) + one entry here.
 * The page renderer and editor shell never change.
 *
 * Populated incrementally across phases; the public renderer skips any type
 * not yet registered.
 */
export const BLOCK_REGISTRY: Partial<Record<BlockType, BlockRegistryEntry>> = {
  profile: {
    type: 'profile',
    label: 'Profile',
    description: 'Avatar, name, badge and tagline',
    icon: UserCircle,
    group: 'basic',
    proOnly: false,
    defaultData: { type: 'profile', avatarUrl: '', name: 'Your name', tagline: '' },
    render: ({ id, data }) =>
      data.type === 'profile' ? <ProfileBlock id={id} data={data} /> : null,
    summary: (data) => (data.type === 'profile' ? data.name : ''),
  },
  socialRow: {
    type: 'socialRow',
    label: 'Social row',
    description: 'A row of social platform icons',
    icon: Share2,
    group: 'basic',
    proOnly: false,
    defaultData: { type: 'socialRow', items: [] },
    render: ({ id, data }) =>
      data.type === 'socialRow' ? <SocialRowBlock id={id} data={data} /> : null,
    summary: (data) =>
      data.type === 'socialRow' ? `${data.items.length} link${data.items.length === 1 ? '' : 's'}` : '',
  },
  linkCard: {
    type: 'linkCard',
    label: 'Link card',
    description: 'A tappable link with title and thumbnail',
    icon: Link2,
    group: 'basic',
    proOnly: false,
    defaultData: { type: 'linkCard', title: 'New link', url: 'https://example.com' },
    render: ({ id, data }) =>
      data.type === 'linkCard' ? <LinkCardBlock id={id} data={data} /> : null,
    summary: (data) => (data.type === 'linkCard' ? data.title : ''),
  },
  emailCapture: {
    type: 'emailCapture',
    label: 'Email capture',
    description: 'Collect email subscribers',
    icon: Mail,
    group: 'basic',
    proOnly: false,
    defaultData: {
      type: 'emailCapture',
      heading: 'Get exclusive updates & offers',
      placeholder: 'you@example.com',
      buttonLabel: 'Subscribe',
      successMessage: 'Thanks for subscribing!',
    },
    render: ({ id, data }) =>
      data.type === 'emailCapture' ? <EmailCaptureBlock id={id} data={data} /> : null,
    summary: (data) => (data.type === 'emailCapture' ? data.heading : ''),
  },
  videoCard: {
    type: 'videoCard',
    label: 'Video',
    description: 'A YouTube video with a lite thumbnail',
    icon: Video,
    group: 'media',
    proOnly: false,
    defaultData: { type: 'videoCard', title: 'Watch this', youtubeUrl: '' },
    render: ({ id, data }) =>
      data.type === 'videoCard' ? <VideoCardBlock id={id} data={data} /> : null,
    summary: (data) => (data.type === 'videoCard' ? data.title : ''),
  },
  gallery: {
    type: 'gallery',
    label: 'Gallery',
    description: 'A grid or carousel of images',
    icon: Images,
    group: 'media',
    proOnly: true,
    defaultData: { type: 'gallery', images: [], layout: 'grid' },
    render: ({ id, data }) =>
      data.type === 'gallery' ? <GalleryBlock id={id} data={data} /> : null,
    summary: (data) =>
      data.type === 'gallery' ? `${data.images.length} image${data.images.length === 1 ? '' : 's'}` : '',
  },
  richText: {
    type: 'richText',
    label: 'Text',
    description: 'A block of formatted text',
    icon: Type,
    group: 'basic',
    proOnly: false,
    defaultData: { type: 'richText', html: '' },
    render: ({ id, data }) =>
      data.type === 'richText' ? <RichTextBlock id={id} data={data} /> : null,
    summary: () => 'Rich text',
  },
  divider: {
    type: 'divider',
    label: 'Divider',
    description: 'A separator line, with an optional label',
    icon: Minus,
    group: 'basic',
    proOnly: false,
    defaultData: { type: 'divider' },
    render: ({ id, data }) =>
      data.type === 'divider' ? <DividerBlock id={id} data={data} /> : null,
    summary: (data) => (data.type === 'divider' ? data.label ?? 'Divider' : ''),
  },
  product: {
    type: 'product',
    label: 'Product',
    description: 'A product card with price and buy button',
    icon: ShoppingBag,
    group: 'commerce',
    proOnly: true,
    defaultData: {
      type: 'product',
      title: 'New product',
      price: 0,
      currency: 'USD',
      imageUrl: '',
      buyUrl: '',
    },
    render: ({ id, data }) =>
      data.type === 'product' ? <ProductBlock id={id} data={data} /> : null,
    summary: (data) => (data.type === 'product' ? data.title : ''),
  },
  youtubeFeed: {
    type: 'youtubeFeed',
    label: 'YouTube feed',
    description: 'Latest videos from a channel (auto-refreshed)',
    icon: Clapperboard,
    group: 'media',
    proOnly: true,
    defaultData: { type: 'youtubeFeed', channelId: '', limit: 4 },
    render: ({ id, data }) =>
      data.type === 'youtubeFeed' ? <YoutubeFeedBlock id={id} data={data} /> : null,
    summary: (data) =>
      data.type === 'youtubeFeed' ? data.channelId || 'No channel set' : '',
  },
  faq: {
    type: 'faq',
    label: 'FAQ',
    description: 'Expandable questions & answers',
    icon: HelpCircle,
    group: 'basic',
    proOnly: false,
    defaultData: { type: 'faq', items: [] },
    render: ({ id, data }) => (data.type === 'faq' ? <FaqBlock id={id} data={data} /> : null),
    summary: (data) =>
      data.type === 'faq' ? `${data.items.length} question${data.items.length === 1 ? '' : 's'}` : '',
  },
  testimonial: {
    type: 'testimonial',
    label: 'Testimonial',
    description: 'A quote with an author',
    icon: Quote,
    group: 'basic',
    proOnly: false,
    defaultData: { type: 'testimonial', quote: '' },
    render: ({ id, data }) =>
      data.type === 'testimonial' ? <TestimonialBlock id={id} data={data} /> : null,
    summary: (data) => (data.type === 'testimonial' ? data.author || 'Testimonial' : ''),
  },
}

/** Ordered list of registered blocks (for the editor's "add block" picker). */
export function registeredBlocks(): BlockRegistryEntry[] {
  return Object.values(BLOCK_REGISTRY).filter((e): e is BlockRegistryEntry => !!e)
}

/** Render one block via the registry. Returns null for unregistered types. */
export function renderBlock(block: { id: string; type: string; data: BlockData }): ReactNode {
  const entry = BLOCK_REGISTRY[block.type as BlockType]
  if (!entry) return null
  return entry.render({ id: block.id, data: block.data })
}

/** Whether a block will paint anything on the page (used to keep the preview honest). */
export function blockRendersContent(data: BlockData): boolean {
  switch (data.type) {
    case 'socialRow':
      return data.items.some((i) => isSocialLink(i.url))
    case 'gallery':
      return data.images.some((i) => isHttpUrl(i.url))
    case 'richText':
      return data.html.trim().length > 0
    case 'faq':
      return data.items.some((i) => i.question.trim() && i.answer.trim())
    case 'testimonial':
      return data.quote.trim().length > 0
    default:
      return true
  }
}
