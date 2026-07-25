import { config } from 'dotenv'
config({ path: '.env.local' })

import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { eq, inArray } from 'drizzle-orm'
import * as schema from '../src/db/schema'
import { hashPassword } from '../src/lib/password'
import type { ThemeConfig } from '../src/lib/theme'
import type { BlockData } from '../src/lib/blocks/schemas'

/**
 * Seeds the example pages behind /examples.
 *
 * ── Row budget ──
 *
 * Keep this small. An earlier version seeded ~5,000 click rows per site across 90
 * days to make the analytics charts look busy, which came to ~25,000 rows over a
 * hundred-odd round trips and exhausted the database's free-tier allowance. The
 * charts looked good and the database stopped answering, which is a bad trade.
 *
 * Now: ~250-600 views per site over 30 days, inserted 500 rows at a time. Roughly
 * 2,500 rows and under ten round trips in total. An example page reading "410
 * views" is perfectly credible — the number never needed to be large, it needed to
 * be real.
 *
 * These are the strongest sales asset the marketing site has: a visitor deciding
 * whether to sign up wants to see a page in *their* field, not one generic demo.
 * So there are five, across five fields, each on a different palette and using a
 * different mix of blocks — the point being that no two look like the same
 * template.
 *
 * A few decisions worth knowing about:
 *
 * View counts are real rows, not a number typed into a field. Each site gets
 * page-view and block-click rows spread over the last 30 days, weighted toward
 * recent days, so the public counter, the analytics chart and the click-through
 * rate all agree with each other and with what the product would actually record.
 * A hard-coded count would have been faster and would have started lying the
 * moment anyone opened the analytics tab.
 *
 * The personas are fictional but written straight — no jokes, no placeholder
 * names. `/examples` frames them as example pages, which is the honest way to
 * present invented people.
 *
 * Outbound links point at real platform homepages rather than invented domains,
 * because a dead link on the page we use to sell the product is worse than a
 * slightly generic destination. The blocks that need a real third-party account
 * to look right — Calendly, and a Spotify embed per persona — are deliberately
 * left out; see the note at the bottom of this file.
 *
 * Idempotent: deleting the example users cascades to their sites, blocks and
 * click rows, so this can be re-run freely.
 */

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL is missing. Set it in .env.local')

const sql = neon(databaseUrl)
const db = drizzle(sql, { schema })

/** Deterministic stand-in photography, so the examples look like real pages. */
const photo = (seed: string, w = 600, h = 600) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

function theme(preset: string, accentColor: string): ThemeConfig {
  return {
    preset,
    accentColor,
    fontFamily: 'Inter',
    buttonStyle: 'rounded',
    hideBranding: false, // the badge on an example page is free advertising
    showViewCount: true, // these are exactly the pages where the number helps
  }
}

type Example = {
  slug: string
  name: string
  email: string
  field: string
  /** One line for the gallery card. */
  summary: string
  theme: ThemeConfig
  seo: { title: string; description: string }
  /** Roughly how many lifetime views to seed. */
  views: number
  blocks: BlockData[]
}

const EXAMPLES: Example[] = [
  {
    slug: 'mara',
    name: 'Mara Vance',
    email: 'mara@example.foliopage.site',
    field: 'Musician',
    summary: 'Releases, tour dates and a mailing list, all above the fold.',
    theme: theme('plum', '#A855F7'),
    seo: {
      title: 'Mara Vance — Indie folk from Lisbon',
      description: 'New EP, tour dates, and where to listen.',
    },
    views: 340,
    blocks: [
      {
        type: 'profile',
        avatarUrl: photo('mara-portrait', 400, 400),
        name: 'Mara Vance',
        badgeText: 'New EP out now',
        badgeIcon: 'sparkles',
        tagline: 'Indie folk from Lisbon',
      },
      {
        type: 'socialRow',
        items: [
          { platform: 'instagram', url: 'https://instagram.com' },
          { platform: 'spotify', url: 'https://open.spotify.com' },
          { platform: 'youtube', url: 'https://youtube.com' },
          { platform: 'tiktok', url: 'https://tiktok.com' },
        ],
      },
      {
        type: 'countdown',
        title: 'Lisbon show — doors open',
        targetDate: new Date(Date.now() + 19 * 86_400_000).toISOString(),
        expiredText: 'We’re live tonight',
      },
      {
        type: 'linkCard',
        title: 'Tour dates & tickets',
        subtitle: 'Lisbon, Porto, Madrid — spring 2026',
        url: 'https://bandsintown.com',
        emoji: '🎟️',
      },
      {
        type: 'product',
        title: 'Paper Lanterns — signed vinyl',
        price: 32,
        currency: 'EUR',
        imageUrl: photo('mara-vinyl'),
        buyUrl: 'https://bandcamp.com',
      },
      {
        type: 'emailCapture',
        heading: 'Hear new songs first',
        placeholder: 'you@example.com',
        buttonLabel: 'Join the list',
        successMessage: 'You’re on the list — talk soon.',
      },
    ],
  },
  {
    slug: 'deniz',
    name: 'Deniz Kaya',
    email: 'deniz@example.foliopage.site',
    field: 'Coach',
    summary: 'Sells a program, answers objections, and books new clients.',
    theme: theme('forest', '#10B981'),
    seo: {
      title: 'Deniz Kaya — Strength coach, Berlin',
      description: 'Programs, free mobility plan, and coaching availability.',
    },
    views: 235,
    blocks: [
      {
        type: 'profile',
        avatarUrl: photo('deniz-portrait', 400, 400),
        name: 'Deniz Kaya',
        badgeText: 'Taking 4 clients',
        badgeIcon: 'check',
        tagline: 'Strength coach · Berlin',
      },
      {
        type: 'socialRow',
        items: [
          { platform: 'instagram', url: 'https://instagram.com' },
          { platform: 'youtube', url: 'https://youtube.com' },
          { platform: 'x', url: 'https://x.com' },
        ],
      },
      {
        type: 'linkCard',
        title: 'Free 5-day mobility plan',
        subtitle: 'No equipment, 12 minutes a day',
        url: 'https://notion.so',
        emoji: '🧘',
      },
      {
        type: 'product',
        title: '12-week strength program',
        price: 149,
        currency: 'EUR',
        imageUrl: photo('deniz-program'),
        buyUrl: 'https://gumroad.com',
      },
      {
        type: 'testimonial',
        quote:
          'I’d trained for six years and never squatted pain-free. Eleven weeks in, I’m back under a heavy bar and my knees are quiet.',
        author: 'Lena F.',
        role: 'Program member',
      },
      {
        type: 'faq',
        title: 'Before you book',
        items: [
          {
            question: 'Do I need a gym?',
            answer:
              'For the 12-week program, yes — you’ll need a barbell, a rack and plates. The free mobility plan needs nothing at all.',
          },
          {
            question: 'How much time per week?',
            answer:
              'Three sessions of about 55 minutes, plus two short mobility days you can do at home.',
          },
          {
            question: 'What if I’m coming back from an injury?',
            answer:
              'Message me before you buy. If the program isn’t the right call yet, I’ll tell you and point you somewhere better.',
          },
        ],
      },
      {
        type: 'emailCapture',
        heading: 'Get the weekly training note',
        placeholder: 'you@example.com',
        buttonLabel: 'Subscribe',
        successMessage: 'Done — first note lands Sunday.',
      },
    ],
  },
  {
    slug: 'isabela',
    name: 'Isabela Rocha',
    email: 'isabela@example.foliopage.site',
    field: 'Photographer',
    summary: 'A gallery, a print for sale, and a tap-to-save contact card.',
    theme: theme('paper', '#E86A33'),
    seo: {
      title: 'Isabela Rocha — Documentary photographer',
      description: 'Selected work, archival prints, and how to reach me.',
    },
    views: 410,
    blocks: [
      {
        type: 'profile',
        avatarUrl: photo('isabela-portrait', 400, 400),
        name: 'Isabela Rocha',
        tagline: 'Documentary photographer · São Paulo',
      },
      {
        type: 'gallery',
        layout: 'grid',
        images: [
          { url: photo('serra-1'), alt: 'Serra series — morning fog' },
          { url: photo('serra-2'), alt: 'Serra series — the road up' },
          { url: photo('serra-3'), alt: 'Serra series — kitchen window' },
          { url: photo('serra-4'), alt: 'Serra series — after the rain' },
          { url: photo('serra-5'), alt: 'Serra series — hands' },
          { url: photo('serra-6'), alt: 'Serra series — last light' },
        ],
      },
      {
        type: 'linkCard',
        title: 'Full portfolio',
        subtitle: 'Long-form series, 2019 – today',
        url: 'https://behance.net',
        emoji: '📷',
      },
      {
        type: 'product',
        title: 'Serra series — archival print',
        price: 85,
        currency: 'USD',
        imageUrl: photo('serra-print'),
        buyUrl: 'https://etsy.com',
      },
      {
        type: 'contact',
        label: 'Save my contact',
        fullName: 'Isabela Rocha',
        email: 'hello@example.com',
        org: 'Independent',
        website: 'https://behance.net',
      },
      {
        type: 'socialRow',
        items: [
          { platform: 'instagram', url: 'https://instagram.com' },
          { platform: 'pinterest', url: 'https://pinterest.com' },
          { platform: 'email', url: 'mailto:hello@example.com' },
        ],
      },
    ],
  },
  {
    slug: 'theo',
    name: 'Theo Aluko',
    email: 'theo@example.foliopage.site',
    field: 'Podcaster',
    summary: 'Every listening app in one row, plus show notes and a newsletter.',
    theme: theme('ocean', '#06B6D4'),
    seo: {
      title: 'Theo Aluko — The Long Game',
      description: 'Listen to the show, read the notes, join the newsletter.',
    },
    views: 615,
    blocks: [
      {
        type: 'profile',
        avatarUrl: photo('theo-portrait', 400, 400),
        name: 'Theo Aluko',
        badgeText: 'Season 3 out now',
        badgeIcon: 'zap',
        tagline: 'Host of The Long Game',
      },
      {
        type: 'imageBanner',
        imageUrl: photo('longgame-cover', 900, 400),
        alt: 'The Long Game — season three cover art',
        linkUrl: 'https://open.spotify.com',
      },
      {
        type: 'linkCard',
        title: 'Listen on Spotify',
        subtitle: 'New episodes every Tuesday',
        url: 'https://open.spotify.com',
        emoji: '🎧',
      },
      {
        type: 'linkCard',
        title: 'Listen on Apple Podcasts',
        url: 'https://podcasts.apple.com',
        emoji: '🎙️',
      },
      {
        type: 'richText',
        html:
          '<p><strong>This week:</strong> why the best operators are the ones who stay bored. A conversation about compounding, patience, and the quiet years nobody posts about.</p>',
      },
      {
        type: 'emailCapture',
        heading: 'One email per episode. Nothing else.',
        placeholder: 'you@example.com',
        buttonLabel: 'Subscribe',
        successMessage: 'Confirmed — see you Tuesday.',
      },
      {
        type: 'socialRow',
        items: [
          { platform: 'x', url: 'https://x.com' },
          { platform: 'youtube', url: 'https://youtube.com' },
          { platform: 'linkedin', url: 'https://linkedin.com' },
        ],
      },
    ],
  },
  {
    slug: 'priya',
    name: 'Priya Raman',
    email: 'priya@example.foliopage.site',
    field: 'Founder',
    summary: 'A product link, proof it works, and a build log to follow.',
    theme: theme('navy', '#3B82F6'),
    seo: {
      title: 'Priya Raman — Building Ledgerly',
      description: 'What I’m building, why, and how to try it.',
    },
    views: 175,
    blocks: [
      {
        type: 'profile',
        avatarUrl: photo('priya-portrait', 400, 400),
        name: 'Priya Raman',
        badgeText: 'Building Ledgerly',
        badgeIcon: 'star',
        tagline: 'Indie founder · Bengaluru',
      },
      {
        type: 'linkCard',
        title: 'Try Ledgerly free',
        subtitle: 'Bookkeeping for people who hate bookkeeping',
        url: 'https://producthunt.com',
        emoji: '📊',
      },
      {
        type: 'richText',
        html:
          '<p>I spent four years doing finance at other people’s startups and watched the same problem every time: the books were always a month behind the decisions. Ledgerly is my attempt at closing that gap.</p>',
      },
      {
        type: 'testimonial',
        quote:
          'We closed our books in two days instead of three weeks. I genuinely did not think that was possible for a team our size.',
        author: 'Arun M.',
        role: 'Ops lead, 22-person team',
      },
      { type: 'divider', label: 'Follow along' },
      {
        type: 'linkCard',
        title: 'The build log',
        subtitle: 'Monthly revenue, mistakes and what shipped',
        url: 'https://github.com',
        emoji: '📓',
      },
      {
        type: 'emailCapture',
        heading: 'Monthly build log, by email',
        placeholder: 'you@example.com',
        buttonLabel: 'Subscribe',
        successMessage: 'You’re in — next one goes out on the 1st.',
      },
      {
        type: 'socialRow',
        items: [
          { platform: 'x', url: 'https://x.com' },
          { platform: 'github', url: 'https://github.com' },
          { platform: 'linkedin', url: 'https://linkedin.com' },
        ],
      },
    ],
  },
]

const COUNTRIES = ['US', 'GB', 'DE', 'BR', 'IN', 'CA', 'AU', 'NL', 'ES', 'PT']
const DEVICES = ['mobile', 'mobile', 'mobile', 'desktop', 'tablet'] as const
const REFERRERS = [
  'instagram.com',
  'instagram.com',
  't.co',
  'youtube.com',
  'google.com',
  'linkedin.com',
  null,
  null,
]

const pick = <T,>(list: readonly T[], i: number) => list[i % list.length]

/**
 * Builds click rows across the last 90 days, weighted so recent days are busier.
 * `blockId` null is a page view; a non-null id is a click on that block — the
 * same convention the app records, so the seeded numbers behave like real ones.
 */
function buildEvents(siteId: string, blockIds: string[], views: number) {
  const rows: (typeof schema.clicks.$inferInsert)[] = []
  const DAYS = 30

  for (let day = 0; day < DAYS; day++) {
    // Newer days get more traffic: ~3x on day 0 tapering to ~0.4x at the end.
    const recency = 0.4 + 2.6 * Math.pow(1 - day / DAYS, 2)
    const dayViews = Math.max(1, Math.round((views / DAYS) * recency))

    for (let v = 0; v < dayViews; v++) {
      const at = new Date(Date.now() - day * 86_400_000 - (v % 24) * 3_600_000)
      rows.push({
        siteId,
        blockId: null,
        createdAt: at,
        country: pick(COUNTRIES, day * 7 + v),
        referrer: pick(REFERRERS, day * 3 + v),
        device: pick(DEVICES, day + v),
      })

      // Roughly a third of visits click something.
      if (blockIds.length > 0 && (day * 5 + v) % 3 === 0) {
        rows.push({
          siteId,
          blockId: pick(blockIds, day + v),
          createdAt: new Date(at.getTime() + 40_000),
          country: pick(COUNTRIES, day * 7 + v),
          referrer: pick(REFERRERS, day * 3 + v),
          device: pick(DEVICES, day + v),
        })
      }
    }
  }
  return rows
}

/** neon-http has a statement size limit, so inserts go in chunks. */
async function insertInChunks<T>(rows: T[], insert: (chunk: T[]) => Promise<unknown>, size = 500) {
  for (let i = 0; i < rows.length; i += size) {
    await insert(rows.slice(i, i + size))
  }
}

async function main() {
  const emails = EXAMPLES.map((e) => e.email)

  // Idempotent: cascades to sites, blocks, clicks and subscribers.
  await db.delete(schema.users).where(inArray(schema.users.email, emails))

  for (const example of EXAMPLES) {
    const [user] = await db
      .insert(schema.users)
      .values({
        email: example.email,
        passwordHash: hashPassword(crypto.randomUUID()), // examples aren't meant to be logged into
        name: example.name,
        plan: 'pro', // so every block and every theme is available to them
      })
      .returning()
    if (!user) throw new Error(`Failed to create user for ${example.slug}`)

    const [site] = await db
      .insert(schema.sites)
      .values({
        ownerId: user.id,
        slug: example.slug,
        isPublished: true,
        theme: example.theme,
        seo: example.seo,
      })
      .returning()
    if (!site) throw new Error(`Failed to create site for ${example.slug}`)

    const inserted = await db
      .insert(schema.blocks)
      .values(
        example.blocks.map((data, i) => ({
          siteId: site.id,
          type: data.type,
          position: (i + 1) * 1000,
          data,
        })),
      )
      .returning({ id: schema.blocks.id, type: schema.blocks.type })

    // Only blocks that lead somewhere can be clicked.
    const clickable = inserted
      .filter((b) => ['linkCard', 'product', 'socialRow', 'imageBanner', 'contact'].includes(b.type))
      .map((b) => b.id)

    const events = buildEvents(site.id, clickable, example.views)
    await insertInChunks(events, (chunk) => db.insert(schema.clicks).values(chunk))

    const pageViews = events.filter((e) => e.blockId === null).length
    console.log(
      `  /${example.slug.padEnd(9)} ${example.field.padEnd(13)} ${example.blocks.length} blocks · ${pageViews.toLocaleString('en-US')} views`,
    )
  }

  console.log('\n✅ Example pages seeded.')
  console.log('   Gallery: /examples')
  console.log(
    '\n   Note: Calendly and Spotify embeds are left out on purpose — they need a real\n' +
      '   third-party account to render, and a broken embed on the page we use to sell\n' +
      '   the product is worse than not showing that block. Add them once there are real\n' +
      '   URLs to point at.',
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
