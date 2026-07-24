'use server'

import { getCurrentUser } from '@/lib/auth/session'
import { aiEnabled, groqComplete } from '@/lib/ai'

export type AiResult = { ok: true; text: string } | { ok: false; error: string }

const NOT_READY = 'AI isn’t set up yet — add a GROQ_API_KEY to enable it.'

export async function generateTagline(input: {
  name: string
  role?: string
}): Promise<AiResult> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Not signed in.' }
  if (!aiEnabled()) return { ok: false, error: NOT_READY }

  const system =
    'You write short, punchy taglines for a link-in-bio page. Reply with ONE tagline only, under 9 words, no quotes, no emojis, no hashtags.'
  const prompt = `Write a tagline for ${input.name || 'this person'}${input.role ? `, a ${input.role}` : ''}.`
  const text = await groqComplete(system, prompt, 40)
  if (!text) return { ok: false, error: 'Couldn’t generate right now — please try again.' }
  return { ok: true, text }
}

export async function improveText(input: {
  text: string
  kind: 'tagline' | 'title' | 'text'
  context?: string
}): Promise<AiResult> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Not signed in.' }
  if (!aiEnabled()) return { ok: false, error: NOT_READY }

  const label =
    input.kind === 'tagline' ? 'bio-link tagline' : input.kind === 'title' ? 'link button title' : 'short line'
  const system = `You improve short marketing copy for a link-in-bio page. Reply with ONLY the improved ${label} — no quotes, no emojis, no explanation.`
  const prompt = input.text.trim()
    ? `Improve this ${label}: ${input.text}`
    : `Write a great ${label}${input.context ? ` for ${input.context}` : ''}.`
  const text = await groqComplete(system, prompt, input.kind === 'title' ? 24 : 60)
  if (!text) return { ok: false, error: 'Couldn’t generate right now — please try again.' }
  return { ok: true, text }
}
