import { env } from '@/env'

/** True when a Groq API key is configured. */
export function aiEnabled(): boolean {
  return env.GROQ_API_KEY.length > 0
}

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
// 8B-instant is ~10× cheaper/faster than 70B and plenty for short copy.
const DEFAULT_MODEL = 'llama-3.1-8b-instant'

// Small in-memory cache: identical prompts return instantly, spending 0 tokens.
const cache = new Map<string, { text: string; at: number }>()
const CACHE_TTL = 10 * 60_000

/** Single-shot chat completion via Groq (OpenAI-compatible). Null on any failure. */
export async function groqComplete(
  system: string,
  user: string,
  opts: { maxTokens?: number; model?: string } = {},
): Promise<string | null> {
  if (!aiEnabled()) return null

  const model = opts.model ?? DEFAULT_MODEL
  const maxTokens = opts.maxTokens ?? 60
  const key = `${model}::${system}::${user}`

  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < CACHE_TTL) return hit.text

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.6,
        max_tokens: maxTokens,
      }),
      cache: 'no-store',
    })
    if (!res.ok) return null
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] }
    const text = json.choices?.[0]?.message?.content?.trim()
    if (!text) return null

    const cleaned = cleanCopy(text)
    cache.set(key, { text: cleaned, at: Date.now() })
    if (cache.size > 2000) {
      const now = Date.now()
      for (const [k, v] of cache) if (now - v.at > CACHE_TTL) cache.delete(k)
    }
    return cleaned
  } catch {
    return null
  }
}

/** Strip surrounding quotes / stray whitespace and cap length. */
export function cleanCopy(text: string): string {
  return text
    .replace(/^["'\s]+|["'\s]+$/g, '')
    .replace(/\s+/g, ' ')
    .slice(0, 300)
}
