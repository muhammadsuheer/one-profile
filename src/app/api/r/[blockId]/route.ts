import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { blocks, clicks } from '@/db/schema'
import { getBlockTargets, getPrimaryTarget } from '@/lib/blocks/targets'
import { detectDevice } from '@/lib/clicks'

const paramsSchema = z.object({ blockId: z.string().uuid() })

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ blockId: string }> },
) {
  const home = new URL('/', req.url)
  const parsed = paramsSchema.safeParse(await ctx.params)
  if (!parsed.success) return NextResponse.redirect(home)

  const [block] = await db
    .select()
    .from(blocks)
    .where(eq(blocks.id, parsed.data.blockId))
    .limit(1)
  if (!block) return NextResponse.redirect(home)

  // Allow-list: only URLs the block actually owns can be redirected to.
  const allowed = getBlockTargets(block.data)
  const to = req.nextUrl.searchParams.get('to')
  const target = to && allowed.includes(to) ? to : getPrimaryTarget(block.data)
  if (!target) return NextResponse.redirect(home)

  // Log the click. Never let a logging failure block the redirect.
  try {
    await db.insert(clicks).values({
      siteId: block.siteId,
      blockId: block.id,
      device: detectDevice(req.headers.get('user-agent') ?? ''),
      referrer: req.headers.get('referer'),
      country: req.headers.get('x-vercel-ip-country'),
    })
  } catch {
    // swallow
  }

  return NextResponse.redirect(target, 302)
}
