import { Music, Dumbbell, Camera, Mic, Rocket, type LucideIcon } from 'lucide-react'

/**
 * The example pages shown in the /examples gallery.
 *
 * This is the shop window: someone deciding whether to sign up wants to see a
 * page in *their* field, not one generic demo. So there are five across five
 * fields, each on a different palette and using a different mix of blocks —
 * nothing here should look like the same template twice.
 *
 * The list is duplicated from `scripts/seed-examples.ts` on purpose rather than
 * derived from the database. The gallery is a marketing page: it needs to render
 * instantly and statically, and it shouldn't break or half-render if a seed
 * hasn't been run in an environment. `slug` is the contract between the two — the
 * gallery links out, and the seeded page is what a visitor lands on.
 *
 * `blocks` and `highlight` are what actually sell it. A visitor skimming the
 * gallery is asking "can it do the thing I need?", so each card names the blocks
 * that page uses and the one thing it's doing well.
 */
export type ExampleProfile = {
  slug: string
  name: string
  field: string
  icon: LucideIcon
  /** One line on the card — what this page is doing for its owner. */
  summary: string
  /** The specific capability worth pointing at. */
  highlight: string
  /** Block names, shown as chips. */
  blocks: string[]
  /** Palette name, so the gallery can say the pages really do look different. */
  palette: string
  accent: string
  /**
   * The same portrait the seeded page shows, so the switcher and the page agree.
   * Derived from the name by DiceBear — see `avatar()` in scripts/seed-examples.ts
   * for why it's an illustration and why it's PNG.
   */
  avatar: string
}

export const EXAMPLE_PROFILES: ExampleProfile[] = [
  {
    slug: 'mara',
    avatar:
      'https://api.dicebear.com/9.x/notionists/png?seed=Mara%20Vance&size=400&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    name: 'Mara Vance',
    field: 'Musician',
    icon: Music,
    summary: 'Releases, tour dates and a mailing list, all above the fold.',
    highlight: 'Counts down to the next show, then flips itself to “we’re live”',
    blocks: ['Profile', 'Socials', 'Countdown', 'Link', 'Product', 'Email capture'],
    palette: 'Plum',
    accent: '#A855F7',
  },
  {
    slug: 'deniz',
    avatar:
      'https://api.dicebear.com/9.x/notionists/png?seed=Deniz%20Kaya&size=400&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    name: 'Deniz Kaya',
    field: 'Coach',
    icon: Dumbbell,
    summary: 'Sells a program, answers the objections, then books the client.',
    highlight: 'A testimonial and an FAQ doing the work a sales page usually does',
    blocks: ['Profile', 'Socials', 'Link', 'Product', 'Testimonial', 'FAQ', 'Email capture'],
    palette: 'Forest',
    accent: '#10B981',
  },
  {
    slug: 'isabela',
    avatar:
      'https://api.dicebear.com/9.x/notionists/png?seed=Isabela%20Rocha&size=400&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    name: 'Isabela Rocha',
    field: 'Photographer',
    icon: Camera,
    summary: 'A gallery, a print for sale, and a tap-to-save contact card.',
    highlight: 'Save-contact block drops her straight into a client’s phone',
    blocks: ['Profile', 'Gallery', 'Link', 'Product', 'Save contact', 'Socials'],
    palette: 'Paper',
    accent: '#E86A33',
  },
  {
    slug: 'theo',
    avatar:
      'https://api.dicebear.com/9.x/notionists/png?seed=Theo%20Aluko&size=400&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    name: 'Theo Aluko',
    field: 'Podcaster',
    icon: Mic,
    summary: 'Every listening app in one row, plus show notes and a newsletter.',
    highlight: 'One link that satisfies Spotify listeners and Apple listeners both',
    blocks: ['Profile', 'Banner', 'Links', 'Rich text', 'Email capture', 'Socials'],
    palette: 'Ocean',
    accent: '#06B6D4',
  },
  {
    slug: 'priya',
    avatar:
      'https://api.dicebear.com/9.x/notionists/png?seed=Priya%20Raman&size=400&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    name: 'Priya Raman',
    field: 'Founder',
    icon: Rocket,
    summary: 'A product link, proof it works, and a build log to follow.',
    highlight: 'Reads like a landing page without being one',
    blocks: ['Profile', 'Link', 'Rich text', 'Testimonial', 'Divider', 'Email capture'],
    palette: 'Navy',
    accent: '#3B82F6',
  },
]

/** The example with this slug, or undefined if the slug isn't one of ours. */
export function getExampleBySlug(slug: string): ExampleProfile | undefined {
  return EXAMPLE_PROFILES.find((e) => e.slug === slug)
}

/**
 * The example after this one, wrapping around at the end.
 *
 * Wrapping rather than stopping is deliberate: someone paging through the examples
 * should never hit a dead end and have to work out where to go next. Returns
 * undefined only if the slug isn't an example at all.
 */
export function getNextExample(slug: string): ExampleProfile | undefined {
  const i = EXAMPLE_PROFILES.findIndex((e) => e.slug === slug)
  if (i === -1) return undefined
  return EXAMPLE_PROFILES[(i + 1) % EXAMPLE_PROFILES.length]
}
