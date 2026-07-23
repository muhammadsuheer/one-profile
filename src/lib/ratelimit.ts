/**
 * Minimal in-memory sliding-window rate limiter. Adequate for a single
 * instance / low volume (§10: 5 req/IP/min on /api/subscribe). For horizontally
 * scaled production, swap the Map for a shared store (Upstash/Redis).
 */
const hits = new Map<string, number[]>()

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  if (recent.length >= limit) {
    hits.set(key, recent)
    return false
  }
  recent.push(now)
  hits.set(key, recent)

  // Opportunistic cleanup so the Map doesn't grow unbounded.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      const live = v.filter((t) => now - t < windowMs)
      if (live.length === 0) hits.delete(k)
      else hits.set(k, live)
    }
  }
  return true
}
