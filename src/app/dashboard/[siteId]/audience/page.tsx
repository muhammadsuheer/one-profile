import { and, eq, desc } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { Download, Users } from 'lucide-react'
import { db } from '@/db'
import { sites, subscribers } from '@/db/schema'
import { getCurrentUser } from '@/lib/auth/session'
import { Button } from '@/components/ui/button'

export const metadata = { title: 'Audience' }

export default async function AudiencePage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params
  const user = await getCurrentUser()
  if (!user) notFound()

  const [site] = await db
    .select({ id: sites.id })
    .from(sites)
    .where(and(eq(sites.id, siteId), eq(sites.ownerId, user.id)))
    .limit(1)
  if (!site) notFound()

  const subs = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.siteId, siteId))
    .orderBy(desc(subscribers.createdAt))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Audience</h1>
          <p className="text-sm text-neutral-500">
            {subs.length} subscriber{subs.length === 1 ? '' : 's'}
          </p>
        </div>
        {subs.length > 0 && (
          <a href={`/dashboard/${siteId}/audience/export`} download>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </a>
        )}
      </div>

      {subs.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-neutral-300 py-14 text-center">
          <Users className="h-6 w-6 text-neutral-300" />
          <p className="text-sm text-neutral-500">No subscribers yet</p>
          <p className="text-xs text-neutral-400">Add an Email capture block to start collecting emails.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-400">
              <tr>
                <th className="px-4 py-2.5 font-medium">Email</th>
                <th className="px-4 py-2.5 font-medium">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {subs.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-2.5 text-neutral-800">{s.email}</td>
                  <td className="px-4 py-2.5 text-neutral-500">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
