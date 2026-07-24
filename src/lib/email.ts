import { env } from '@/env'

export function emailEnabled(): boolean {
  return env.RESEND_API_KEY.length > 0
}

/**
 * Default from-address. Set EMAIL_FROM to an address on a domain you've
 * verified in Resend (e.g. "OnePage <noreply@yourdomain.com>") to send to real
 * recipients. The resend.dev fallback only delivers to the account owner.
 */
const FROM = env.EMAIL_FROM || 'OnePage <onboarding@resend.dev>'

/**
 * Send a transactional email via the Resend REST API (no SDK dependency).
 * Returns true on success. Never throws — callers decide how to degrade when
 * email isn't configured (e.g. password reset still returns a generic message).
 */
export async function sendEmail(opts: {
  to: string
  subject: string
  html: string
  from?: string
}): Promise<boolean> {
  if (!emailEnabled()) {
    console.warn('[email] RESEND_API_KEY not set — skipping send to', opts.to)
    return false
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: opts.from ?? FROM,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
      }),
    })
    if (!res.ok) {
      console.error('[email] Resend error', res.status, await res.text().catch(() => ''))
      return false
    }
    return true
  } catch (err) {
    console.error('[email] send failed', err)
    return false
  }
}

/** Minimal branded wrapper for transactional emails. */
export function renderEmail(opts: { heading: string; body: string; ctaLabel?: string; ctaUrl?: string }): string {
  const button =
    opts.ctaLabel && opts.ctaUrl
      ? `<a href="${opts.ctaUrl}" style="display:inline-block;background:#171717;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px;margin:8px 0 16px">${opts.ctaLabel}</a>`
      : ''
  return `<!doctype html><html><body style="margin:0;background:#fafafa;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#0a0a0a">
    <div style="max-width:480px;margin:40px auto;background:#fff;border:1px solid #e5e5e5;border-radius:16px;padding:32px">
      <div style="font-weight:700;font-size:15px;margin-bottom:24px">OnePage</div>
      <h1 style="font-size:20px;font-weight:600;letter-spacing:-0.02em;margin:0 0 12px">${opts.heading}</h1>
      <p style="font-size:14px;color:#525252;line-height:1.6;margin:0 0 16px">${opts.body}</p>
      ${button}
      <p style="font-size:12px;color:#a3a3a3;margin:24px 0 0">If you didn't request this, you can safely ignore this email.</p>
    </div>
  </body></html>`
}
