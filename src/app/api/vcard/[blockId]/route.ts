import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { blocks, clicks } from '@/db/schema'
import { detectDevice } from '@/lib/clicks'

const paramsSchema = z.object({ blockId: z.string().uuid() })

/** Escape a value per vCard 3.0 (RFC 6350-ish): backslash, comma, semicolon, newline. */
function esc(v: string): string {
  return v.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
}

function buildVCard(d: {
  fullName: string
  org?: string
  phone?: string
  email?: string
  website?: string
}): string {
  const lines = ['BEGIN:VCARD', 'VERSION:3.0', `FN:${esc(d.fullName)}`, `N:${esc(d.fullName)};;;;`]
  if (d.org) lines.push(`ORG:${esc(d.org)}`)
  if (d.phone) lines.push(`TEL;TYPE=CELL:${esc(d.phone)}`)
  if (d.email) lines.push(`EMAIL;TYPE=INTERNET:${esc(d.email)}`)
  if (d.website) lines.push(`URL:${esc(d.website)}`)
  lines.push('END:VCARD')
  return lines.join('\r\n')
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ blockId: string }> }) {
  const parsed = paramsSchema.safeParse(await ctx.params)
  if (!parsed.success) return new NextResponse('Not found', { status: 404 })

  const [block] = await db
    .select()
    .from(blocks)
    .where(eq(blocks.id, parsed.data.blockId))
    .limit(1)
  if (!block || block.data.type !== 'contact') {
    return new NextResponse('Not found', { status: 404 })
  }

  const d = block.data
  const vcard = buildVCard({
    fullName: d.fullName,
    org: d.org,
    phone: d.phone,
    email: d.email || undefined,
    website: d.website || undefined,
  })

  // Log the download as a click. Never let a logging failure block the file.
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

  const filename = (d.fullName || 'contact').replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'contact'
  return new NextResponse(vcard, {
    status: 200,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}.vcf"`,
      'Cache-Control': 'no-store',
    },
  })
}
