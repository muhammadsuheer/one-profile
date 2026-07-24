import { describe, it, expect } from 'vitest'
import { sanitizeHtml } from './sanitize'

describe('sanitizeHtml', () => {
  it('strips <script> tags', () => {
    const out = sanitizeHtml('<p>hi</p><script>alert(1)</script>')
    expect(out).toContain('<p>hi</p>')
    expect(out.toLowerCase()).not.toContain('<script')
    expect(out).not.toContain('alert(1)')
  })

  it('strips inline event handlers', () => {
    const out = sanitizeHtml('<p onclick="steal()">x</p><img src=x onerror="hack()">')
    expect(out).not.toContain('onclick')
    expect(out).not.toContain('onerror')
  })

  it('removes disallowed tags (img, iframe, style)', () => {
    const out = sanitizeHtml('<img src="x"><iframe src="evil"></iframe><style>*{}</style><p>ok</p>')
    expect(out.toLowerCase()).not.toContain('<img')
    expect(out.toLowerCase()).not.toContain('<iframe')
    expect(out.toLowerCase()).not.toContain('<style')
    expect(out).toContain('<p>ok</p>')
  })

  it('neutralizes javascript: hrefs', () => {
    const out = sanitizeHtml('<a href="javascript:alert(1)">x</a>')
    expect(out).not.toContain('javascript:')
  })

  it('keeps the allowed formatting subset', () => {
    const out = sanitizeHtml('<strong>a</strong> <em>b</em> <ul><li>c</li></ul>')
    expect(out).toContain('<strong>a</strong>')
    expect(out).toContain('<em>b</em>')
    expect(out).toContain('<li>c</li>')
  })

  it('drops style attributes but keeps safe links', () => {
    const out = sanitizeHtml('<a href="https://x.com" style="color:red">link</a>')
    expect(out).toContain('href="https://x.com"')
    expect(out).not.toContain('style=')
  })
})
