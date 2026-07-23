import { config } from 'dotenv'
config({ path: '.env.local' })

import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { eq } from 'drizzle-orm'
import * as schema from '../src/db/schema'
import { hashPassword } from '../src/lib/password'
import { DEFAULT_THEME } from '../src/lib/theme'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL is missing. Set it in .env.local')
}

const sql = neon(databaseUrl)
const db = drizzle(sql, { schema })

async function main() {
  const demoEmail = 'demo@onepage.dev'

  // Idempotent: removing the demo user cascades to its sites, blocks, etc.
  await db.delete(schema.users).where(eq(schema.users.email, demoEmail))

  const [user] = await db
    .insert(schema.users)
    .values({
      email: demoEmail,
      passwordHash: hashPassword('password123'),
      name: 'Ava Nocturne',
      plan: 'pro',
    })
    .returning()

  if (!user) throw new Error('Failed to create demo user')

  const [site] = await db
    .insert(schema.sites)
    .values({
      ownerId: user.id,
      slug: 'ava',
      isPublished: true,
      theme: DEFAULT_THEME,
      seo: {
        title: 'Ava Nocturne — Paranormal Investigator',
        description: 'Follow my investigations, links, and updates.',
      },
    })
    .returning()

  if (!site) throw new Error('Failed to create demo site')

  await db.insert(schema.blocks).values([
    {
      siteId: site.id,
      type: 'profile',
      position: 1000,
      data: {
        type: 'profile',
        avatarUrl:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
        name: 'Ava Nocturne',
        badgeText: '2.2M Followers',
        badgeIcon: 'sparkles',
        tagline: 'Paranormal Investigator',
      },
    },
    {
      siteId: site.id,
      type: 'socialRow',
      position: 2000,
      data: {
        type: 'socialRow',
        items: [
          { platform: 'tiktok', url: 'https://tiktok.com/@ava' },
          { platform: 'youtube', url: 'https://youtube.com/@ava' },
          { platform: 'instagram', url: 'https://instagram.com/ava' },
          { platform: 'x', url: 'https://x.com/ava' },
        ],
      },
    },
    {
      siteId: site.id,
      type: 'linkCard',
      position: 3000,
      data: {
        type: 'linkCard',
        title: 'Watch my latest investigation',
        subtitle: 'The haunting of Blackwood Manor',
        url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        emoji: '👻',
      },
    },
    {
      siteId: site.id,
      type: 'linkCard',
      position: 4000,
      data: {
        type: 'linkCard',
        title: 'Join my newsletter',
        subtitle: 'Weekly paranormal case files',
        url: 'https://example.com/newsletter',
        emoji: '📩',
      },
    },
  ])

  console.log('✅ Seeded demo data')
  console.log('   Login:       demo@onepage.dev / password123')
  console.log('   Public page: /ava')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Seed failed:', err)
    process.exit(1)
  })
