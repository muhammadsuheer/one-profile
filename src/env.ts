import { z } from 'zod'

/**
 * Server-side environment validation. Import ONLY from server code
 * (server components, route handlers, server actions, scripts).
 * Never import this into a client component — it reads secrets.
 *
 * Core keys (DATABASE_URL, AUTH_SECRET, NEXT_PUBLIC_APP_URL) are required
 * and throw at build/boot if missing. Third-party service keys are optional
 * so the app boots before you wire each integration; the features that use
 * them fail gracefully at call time until a value is provided.
 */
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(1),
  AUTH_GOOGLE_ID: z.string().optional().default(''),
  AUTH_GOOGLE_SECRET: z.string().optional().default(''),
  UPLOADTHING_TOKEN: z.string().optional().default(''),
  RESEND_API_KEY: z.string().optional().default(''),
  YOUTUBE_API_KEY: z.string().optional().default(''),
  NEXT_PUBLIC_APP_URL: z.string().url(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error(
    '❌ Invalid environment variables:\n',
    JSON.stringify(parsed.error.issues, null, 2),
  )
  throw new Error(
    'Invalid environment variables. Required: DATABASE_URL, AUTH_SECRET, NEXT_PUBLIC_APP_URL. ' +
      'Locally set them in .env.local; on Vercel add them under Project → Settings → Environment Variables, then redeploy.',
  )
}

export const env = parsed.data

/** True when a Google OAuth client is configured. */
export const googleAuthEnabled = env.AUTH_GOOGLE_ID.length > 0 && env.AUTH_GOOGLE_SECRET.length > 0
