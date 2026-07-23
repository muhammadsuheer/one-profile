import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { blocks, subscribers } from '@/db/schema'
import { rateLimit } from '@/lib/ratelimit'

const bodySchema = z.object({
  blockId: z.string().uuid(),
  email: z.string().email().max(200),
})

export async function POST(req: NextRequest) {
  const ip = (
    req.headers.get('x-forwarded-for')?.split(',')[0] ??
    req.headers.get('x-real-ip') ??
    'unknown'
  ).trim()

  // §10: 5 requests per IP per minute.
  if (!rateLimit(`subscribe:${ip}`, 5, 60_000)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a minute.' },
      { status: 429 },
    )
  }

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  // Resolve the site from the block, and ensure it's actually a capture block.
  const [block] = await db
    .select({ siteId: blocks.siteId, type: blocks.type })
    .from(blocks)
    .where(eq(blocks.id, parsed.data.blockId))
    .limit(1)
  if (!block || block.type !== 'emailCapture') {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  }

  await db
    .insert(subscribers)
    .values({ siteId: block.siteId, email: parsed.data.email.toLowerCase() })
    .onConflictDoNothing()

  return NextResponse.json({ ok: true })
}
