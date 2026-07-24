import type { MetadataRoute } from 'next'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { sites } from '@/db/schema'
import { env } from '@/env'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')

  let published: { slug: string }[] = []
  try {
    published = await db
      .select({ slug: sites.slug })
      .from(sites)
      .where(eq(sites.isPublished, true))
      .limit(10000)
  } catch {
    // Sitemap should never crash a deploy on a DB blip.
  }

  return [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    ...published.map((s) => ({
      url: `${base}/${s.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
