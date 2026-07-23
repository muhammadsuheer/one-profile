import { z } from 'zod'

/**
 * Single source of truth for block payloads (§4). Each block type = one Zod
 * variant here + a render component + an edit component + one BLOCK_REGISTRY
 * entry. Adding a block requires ONLY those four; no schema migration.
 */

export const socialPlatformSchema = z.enum([
  'tiktok',
  'youtube',
  'instagram',
  'x',
  'facebook',
  'linkedin',
  'whatsapp',
  'email',
  'website',
])
export type SocialPlatform = z.infer<typeof socialPlatformSchema>

/**
 * A valid absolute URL OR an empty string. Using this for editable URL fields
 * lets a freshly-added block (blank URL) pass validation so autosave works;
 * render components guard empties via isHttpUrl().
 */
const urlOrEmpty = z.union([z.string().url(), z.literal('')])

export const profileBlockSchema = z.object({
  type: z.literal('profile'),
  avatarUrl: urlOrEmpty.default(''),
  name: z.string().min(1).max(80),
  badgeText: z.string().max(60).optional(),
  badgeIcon: z.string().max(40).optional(),
  tagline: z.string().max(120).optional(),
})

export const socialRowBlockSchema = z.object({
  type: z.literal('socialRow'),
  items: z
    .array(
      z.object({
        platform: socialPlatformSchema,
        url: urlOrEmpty,
      }),
    )
    .max(12),
})

export const emailCaptureBlockSchema = z.object({
  type: z.literal('emailCapture'),
  heading: z.string().min(1).max(120),
  placeholder: z.string().max(80).default('you@example.com'),
  buttonLabel: z.string().max(40).default('Subscribe'),
  successMessage: z.string().max(160).default('Thanks for subscribing!'),
})

export const linkCardBlockSchema = z.object({
  type: z.literal('linkCard'),
  title: z.string().min(1).max(120),
  subtitle: z.string().max(160).optional(),
  url: urlOrEmpty,
  thumbnailUrl: urlOrEmpty.optional(),
  emoji: z.string().max(8).optional(),
})

export const videoCardBlockSchema = z.object({
  type: z.literal('videoCard'),
  title: z.string().min(1).max(120),
  subtitle: z.string().max(160).optional(),
  youtubeUrl: urlOrEmpty,
})

export const youtubeFeedBlockSchema = z.object({
  type: z.literal('youtubeFeed'),
  channelId: z.string().min(1).max(64),
  limit: z.number().int().min(3).max(6),
  cachedVideos: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        thumbnail: z.string(),
        publishedAt: z.string(),
      }),
    )
    .optional(),
  cachedAt: z.string().optional(),
})

export const galleryBlockSchema = z.object({
  type: z.literal('gallery'),
  images: z
    .array(
      z.object({
        url: urlOrEmpty,
        alt: z.string().max(160).optional(),
        linkUrl: urlOrEmpty.optional(),
      }),
    )
    .max(24),
  layout: z.enum(['grid', 'carousel']),
})

export const productBlockSchema = z.object({
  type: z.literal('product'),
  title: z.string().min(1).max(120),
  price: z.number().nonnegative(),
  currency: z.string().length(3).default('USD'),
  imageUrl: urlOrEmpty,
  buyUrl: urlOrEmpty,
})

export const richTextBlockSchema = z.object({
  type: z.literal('richText'),
  html: z.string().max(10000),
})

export const dividerBlockSchema = z.object({
  type: z.literal('divider'),
  label: z.string().max(60).optional(),
})

export const blockDataSchema = z.discriminatedUnion('type', [
  profileBlockSchema,
  socialRowBlockSchema,
  emailCaptureBlockSchema,
  linkCardBlockSchema,
  videoCardBlockSchema,
  youtubeFeedBlockSchema,
  galleryBlockSchema,
  productBlockSchema,
  richTextBlockSchema,
  dividerBlockSchema,
])

export type BlockData = z.infer<typeof blockDataSchema>
export type BlockType = BlockData['type']

/** Map a block type to its schema (used by the editor + server validation). */
export const BLOCK_SCHEMAS = {
  profile: profileBlockSchema,
  socialRow: socialRowBlockSchema,
  emailCapture: emailCaptureBlockSchema,
  linkCard: linkCardBlockSchema,
  videoCard: videoCardBlockSchema,
  youtubeFeed: youtubeFeedBlockSchema,
  gallery: galleryBlockSchema,
  product: productBlockSchema,
  richText: richTextBlockSchema,
  divider: dividerBlockSchema,
} as const

/** Narrow BlockData to a specific variant by its `type`. */
export type BlockDataOf<T extends BlockType> = Extract<BlockData, { type: T }>
