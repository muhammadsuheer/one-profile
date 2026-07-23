import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize user rich-text HTML server-side before storage (§10). Allows a
 * small, safe formatting subset; strips scripts, event handlers, styles, etc.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'a',
      'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'blockquote', 'span', 'code',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'],
  })
}
