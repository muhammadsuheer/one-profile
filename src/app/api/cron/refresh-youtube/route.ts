import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { blocks } from '@/db/schema'
import { fetchLatestVideos } from '@/lib/youtube'
import { env } from '@/env'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Hourly Vercel Cron. Refreshes the cached videos for every youtubeFeed block.
 * Secure it by setting a `CRON_SECRET` env var in Vercel equal to AUTH_SECRET —
 * Vercel then sends it as `Authorization: Bearer <secret>` to this route.
 */
export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  const isVercelCron = req.headers.get('user-agent')?.includes('vercel-cron') ?? false
  if (auth !== `Bearer ${env.AUTH_SECRET}` && !isVercelCron) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const feedBlocks = await db.select().from(blocks).where(eq(blocks.type, 'youtubeFeed'))

  let updated = 0
  for (const block of feedBlocks) {
    if (block.data.type !== 'youtubeFeed' || !block.data.channelId) continue
    const videos = await fetchLatestVideos(block.data.channelId, block.data.limit)
    if (videos.length === 0) continue
    await db
      .update(blocks)
      .set({
        data: { ...block.data, cachedVideos: videos, cachedAt: new Date().toISOString() },
      })
      .where(eq(blocks.id, block.id))
    updated++
  }

  return NextResponse.json({ ok: true, refreshed: updated, total: feedBlocks.length })
}
