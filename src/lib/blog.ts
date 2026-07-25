/**
 * Simple in-repo blog source. Add a new post by appending an object to POSTS —
 * no CMS, no build step. `body` is an array of markdown-ish blocks rendered by
 * the post page (paragraph strings, or {h: '...'} headings, or {ul: [...]}).
 *
 * Dates are ISO (YYYY-MM-DD). Slugs must be unique and URL-safe.
 */

export type PostBlock = string | { h: string } | { ul: string[] }

export type Post = {
  slug: string
  title: string
  excerpt: string
  date: string
  readingMinutes: number
  tag: string
  author: string
  body: PostBlock[]
}

export const POSTS: Post[] = [
  {
    slug: 'why-one-link-beats-a-bio-full-of-links',
    title: 'Why one link beats a bio full of links',
    excerpt:
      'Your audience gives you one tap. Here is how a single, well-designed page turns that tap into follows, sales and subscribers.',
    date: '2026-07-20',
    readingMinutes: 4,
    tag: 'Strategy',
    author: 'The FolioPage Team',
    body: [
      'Most platforms give you exactly one link. Instagram, TikTok, X, a podcast description — one clickable spot for everything you do. Waste it on a raw list of blue links and you leak attention at every step.',
      { h: 'One page, many outcomes' },
      'A good bio page is not a menu, it is a path. Lead with who you are, then give people the two or three actions that actually matter: hear the new single, join the list, book a call.',
      { h: 'What actually moves the needle' },
      { ul: [
        'A clear profile block so people know they are in the right place.',
        'One primary action above the fold — not ten equal links.',
        'An email-capture block so a visit can become a relationship.',
        'Analytics, so you learn what your audience taps and double down.',
      ] },
      'FolioPage is built around exactly this idea: blocks you can reorder in seconds, a live preview, and real numbers behind every click.',
    ],
  },
  {
    slug: 'design-a-bio-page-that-converts',
    title: 'Design a bio page that converts',
    excerpt:
      'Color, hierarchy and one strong call to action. A short, practical guide to a page people actually act on.',
    date: '2026-07-12',
    readingMinutes: 5,
    tag: 'Design',
    author: 'The FolioPage Team',
    body: [
      'Conversion is mostly clarity. If a visitor can tell what you want them to do in under two seconds, you have already won most of the battle.',
      { h: 'Pick one accent, use it once' },
      'Your accent color should point at the single most important button — not decorate the whole page. When everything is highlighted, nothing is.',
      { h: 'Respect the fold' },
      'The first screen should answer three questions: who are you, what do you offer, and what should I tap first. Everything else can scroll.',
      { h: 'Then measure' },
      'Ship it, watch the click-through rate, and move your best link up. Small, data-driven tweaks beat a big redesign every time.',
    ],
  },
  {
    slug: 'introducing-custom-domains',
    title: 'Introducing custom domains on FolioPage',
    excerpt:
      'Connect your own domain in one click and make your page unmistakably yours. Here is how it works.',
    date: '2026-07-04',
    readingMinutes: 3,
    tag: 'Product',
    author: 'The FolioPage Team',
    body: [
      'Your brand deserves your name in the address bar. Pro members can now point a custom domain straight at their FolioPage — no proxies, no fragile redirects.',
      { h: 'How it works' },
      { ul: [
        'Add your domain in the dashboard.',
        'Create the DNS record we show you.',
        'We route the domain to your published page automatically.',
      ] },
      'Combined with removable branding, your page becomes indistinguishable from a bespoke site — without touching a line of code.',
    ],
  },
]

/** All posts, newest first. */
export function getAllPosts(): Post[] {
  return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug)
}

/** Human-friendly date, e.g. "Jul 20, 2026". */
export function formatPostDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[(m ?? 1) - 1]} ${d}, ${y}`
}
