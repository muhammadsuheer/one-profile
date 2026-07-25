import {
  Music,
  Mic,
  HeartHandshake,
  Rocket,
  Brush,
  PenLine,
  Camera,
  Video,
  Palette,
  BookOpen,
  Dumbbell,
  Presentation,
} from 'lucide-react'

/**
 * The "who it's for" row, as a continuously scrolling marquee.
 *
 * Seamlessness depends on one structural detail: the track holds exactly two
 * identical copies of the list and slides by -50%, so at the end of a cycle the
 * second copy sits precisely where the first started and the jump back to 0 is
 * invisible. The spacing lives on each list (`gap` plus a matching `pr`) rather
 * than on the track — a gap *between* the two copies would make each half a gap
 * wider than the shift, and the loop would visibly stutter once per cycle.
 *
 * The animation is CSS, so this stays a server component and the row scrolls
 * without waiting on hydration. It uses a literal transform in the keyframes,
 * not Tailwind's translate utilities: those compile to `translate:
 * var(--tw-translate-*)`, and untyped custom properties don't interpolate.
 *
 * The second copy is aria-hidden so the list is announced once, and the whole
 * row pauses on hover.
 *
 * Styling is deliberately near-silent — monochrome, no pill chrome, low opacity.
 * This is a supporting row, and the reference's equivalent is just grey
 * wordmarks. An earlier version put each item in a bordered pill with a
 * brand-pink icon, which meant twelve saturated accents marching across the
 * page, pulling more attention than the CTA itself. The accent belongs to the
 * selected phrase and the primary button; everything here stays grey.
 */
const AUDIENCES = [
  { icon: Music, label: 'Musicians' },
  { icon: Mic, label: 'Podcasters' },
  { icon: HeartHandshake, label: 'Coaches' },
  { icon: Rocket, label: 'Founders' },
  { icon: Brush, label: 'Artists' },
  { icon: PenLine, label: 'Writers' },
  { icon: Camera, label: 'Photographers' },
  { icon: Video, label: 'Streamers' },
  { icon: Palette, label: 'Designers' },
  { icon: BookOpen, label: 'Authors' },
  { icon: Dumbbell, label: 'Trainers' },
  { icon: Presentation, label: 'Speakers' },
]

export default function AudienceMarquee() {
  return (
    <div className="fp-marquee overflow-hidden">
      <div className="fp-marquee-track flex w-max">
        <AudienceList />
        <AudienceList duplicate />
      </div>
    </div>
  )
}

function AudienceList({ duplicate }: { duplicate?: boolean }) {
  return (
    // The gap and the trailing padding must match, so the two copies are
    // separated by exactly one gap and the -50% slide stays seamless.
    <ul className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={duplicate || undefined}>
      {AUDIENCES.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="inline-flex shrink-0 items-center gap-2.5 text-sm font-medium text-white/35 transition-colors hover:text-white/70"
        >
          <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
          {label}
        </li>
      ))}
    </ul>
  )
}
