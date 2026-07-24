'use server'

import { getCurrentUser } from '@/lib/auth/session'
import { aiEnabled, groqComplete } from '@/lib/ai'
import { rateLimit } from '@/lib/ratelimit'

export type AiResult = { ok: true; text: string } | { ok: false; error: string }

const NOT_READY = 'AI isn’t set up yet — add a GROQ_API_KEY to enable it.'
const RATE_LIMITED = 'Too many AI requests — please wait a minute.'
const AI_PER_MIN = 20

async function ready(): Promise<AiResult | { userId: string }> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Not signed in.' }
  if (!aiEnabled()) return { ok: false, error: NOT_READY }
  if (user.plan !== 'pro') return { ok: false, error: 'AI copy is a Pro feature — upgrade to unlock.' }
  // Cap spend/abuse per user (also keeps token cost predictable).
  if (!rateLimit(`ai:${user.id}`, AI_PER_MIN, 60_000)) return { ok: false, error: RATE_LIMITED }
  return { userId: user.id }
}

export async function generateTagline(input: {
  name: string
  role?: string
}): Promise<AiResult> {
  const gate = await ready()
  if ('ok' in gate) return gate

  const system = 'Write one bio-link tagline, under 8 words. No quotes, emojis or hashtags.'
  const prompt = `${(input.name || 'Someone').slice(0, 60)}${input.role ? `, ${input.role.slice(0, 40)}` : ''}`
  const text = await groqComplete(system, prompt, { maxTokens: 28 })
  if (!text) return { ok: false, error: 'Couldn’t generate right now — please try again.' }
  return { ok: true, text }
}

export async function improveText(input: {
  text: string
  kind: 'tagline' | 'title' | 'text'
  context?: string
}): Promise<AiResult> {
  const gate = await ready()
  if ('ok' in gate) return gate

  const label = input.kind === 'tagline' ? 'tagline' : input.kind === 'title' ? 'link title' : 'short line'
  const source = (input.text ?? '').slice(0, 400)
  const system = `Reply with only an improved ${label}. No quotes, emojis or extra words.`
  const prompt = source
    ? `Improve: ${source}`
    : `Write a ${label}${input.context ? ` for ${input.context.slice(0, 60)}` : ''}`
  const text = await groqComplete(system, prompt, { maxTokens: input.kind === 'title' ? 20 : 48 })
  if (!text) return { ok: false, error: 'Couldn’t generate right now — please try again.' }
  return { ok: true, text }
}
