import { env } from '@/env'

/** True when a Groq API key is configured. */
export function aiEnabled(): boolean {
  return env.GROQ_API_KEY.length > 0
}

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

/** Single-shot chat completion via Groq (OpenAI-compatible). Null on any failure. */
export async function groqComplete(
  system: string,
  user: string,
  maxTokens = 120,
): Promise<string | null> {
  if (!aiEnabled()) return null
  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.7,
        max_tokens: maxTokens,
      }),
      cache: 'no-store',
    })
    if (!res.ok) return null
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] }
    const text = json.choices?.[0]?.message?.content?.trim()
    return text ? cleanCopy(text) : null
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
