/** Discriminated result returned by dashboard server actions. */
export type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string }
