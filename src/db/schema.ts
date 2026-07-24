import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  bigserial,
  index,
  unique,
  primaryKey,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import type { AdapterAccountType } from 'next-auth/adapters'

// JSONB payload types. Zod is the single source of truth (§4); these are
// `z.infer`-derived. They are TYPE-ONLY imports so they are erased at runtime
// (drizzle-kit / tsx never resolve the `@/` alias).
import type { BlockData } from '@/lib/blocks/schemas'
import type { ThemeConfig, SeoConfig } from '@/lib/theme'

/* ------------------------------------------------------------------ */
/*  Auth.js (NextAuth v5) — Drizzle adapter tables.                    */
/*  `users` is extended with app columns (passwordHash, plan, …).      */
/* ------------------------------------------------------------------ */

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash'), // null for OAuth-only users
  name: text('name'),
  image: text('image'),
  plan: text('plan', { enum: ['free', 'pro'] }).notNull().default('free'),
  creemCustomerId: text('creem_customer_id'),
  creemSubscriptionId: text('creem_subscription_id'),
  emailVerified: timestamp('email_verified', { withTimezone: true, mode: 'date' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const accounts = pgTable(
  'accounts',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (t) => ({
    compoundKey: primaryKey({ columns: [t.provider, t.providerAccountId] }),
    userIdx: index('accounts_user_idx').on(t.userId),
  }),
)

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { withTimezone: true, mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { withTimezone: true, mode: 'date' }).notNull(),
  },
  (t) => ({
    compoundKey: primaryKey({ columns: [t.identifier, t.token] }),
  }),
)

/**
 * Password reset tokens (app-managed, separate from Auth.js verificationTokens
 * which the adapter owns). One row per outstanding reset request; consumed and
 * deleted on use, and purged when expired.
 */
export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    token: text('token').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires', { withTimezone: true, mode: 'date' }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('prt_user_idx').on(t.userId),
  }),
)

/* ------------------------------------------------------------------ */
/*  Application tables (§5).                                           */
/* ------------------------------------------------------------------ */

export const sites = pgTable(
  'sites',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    slug: text('slug').unique().notNull(), // reserved-word blocklist enforced in app layer
    customDomain: text('custom_domain').unique(),
    isPublished: boolean('is_published').notNull().default(false),
    theme: jsonb('theme').$type<ThemeConfig>().notNull(),
    seo: jsonb('seo').$type<SeoConfig>(), // { title, description, ogImageUrl }
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugIdx: index('sites_slug_idx').on(t.slug),
    ownerIdx: index('sites_owner_idx').on(t.ownerId),
  }),
)

export const blocks = pgTable(
  'blocks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    siteId: uuid('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    position: integer('position').notNull(), // gap-based: 1000, 2000, 3000
    isVisible: boolean('is_visible').notNull().default(true),
    data: jsonb('data').$type<BlockData>().notNull(),
  },
  (t) => ({
    sitePositionIdx: index('blocks_site_position_idx').on(t.siteId, t.position),
  }),
)

export const subscribers = pgTable(
  'subscribers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    siteId: uuid('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    siteEmailUnq: unique('subscribers_site_email_unq').on(t.siteId, t.email),
  }),
)

export const clicks = pgTable(
  'clicks',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    siteId: uuid('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'cascade' }),
    // No FK: click history must survive block deletion. NULL blockId = page-view event.
    blockId: uuid('block_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    country: text('country'),
    referrer: text('referrer'),
    device: text('device', { enum: ['mobile', 'desktop', 'tablet'] }),
  },
  (t) => ({
    siteCreatedIdx: index('clicks_site_created_idx').on(t.siteId, t.createdAt),
  }),
)

export const media = pgTable('media', {
  id: uuid('id').primaryKey().defaultRandom(),
  siteId: uuid('site_id')
    .notNull()
    .references(() => sites.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  width: integer('width'),
  height: integer('height'),
  bytes: integer('bytes'),
})

/* ------------------------------------------------------------------ */
/*  Relations (Drizzle query API).                                    */
/* ------------------------------------------------------------------ */

export const usersRelations = relations(users, ({ many }) => ({
  sites: many(sites),
  accounts: many(accounts),
  sessions: many(sessions),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const sitesRelations = relations(sites, ({ one, many }) => ({
  owner: one(users, { fields: [sites.ownerId], references: [users.id] }),
  blocks: many(blocks),
  subscribers: many(subscribers),
  clicks: many(clicks),
  media: many(media),
}))

export const blocksRelations = relations(blocks, ({ one }) => ({
  site: one(sites, { fields: [blocks.siteId], references: [sites.id] }),
}))

export const subscribersRelations = relations(subscribers, ({ one }) => ({
  site: one(sites, { fields: [subscribers.siteId], references: [sites.id] }),
}))

export const clicksRelations = relations(clicks, ({ one }) => ({
  site: one(sites, { fields: [clicks.siteId], references: [sites.id] }),
}))

export const mediaRelations = relations(media, ({ one }) => ({
  site: one(sites, { fields: [media.siteId], references: [sites.id] }),
}))

/* ------------------------------------------------------------------ */
/*  Inferred row types.                                               */
/* ------------------------------------------------------------------ */

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Site = typeof sites.$inferSelect
export type NewSite = typeof sites.$inferInsert
export type Block = typeof blocks.$inferSelect
export type NewBlock = typeof blocks.$inferInsert
export type Subscriber = typeof subscribers.$inferSelect
export type Click = typeof clicks.$inferSelect
export type Media = typeof media.$inferSelect
