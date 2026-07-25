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
    <ul className="flex shrink-0 items-center gap-3 pr-3" aria-hidden={duplicate || undefined}>
      {AUDIENCES.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:border-white/15 hover:text-white/85"
        >
          <Icon className="h-4 w-4 shrink-0 text-[#F5124A]/70" />
          {label}
        </li>
      ))}
    </ul>
  )
}
