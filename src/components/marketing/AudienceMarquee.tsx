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
 * Two identical copies of the list sit side by side, and *each* animates by
 * -100% of its own width (see `.fp-marquee-group` in globals.css). When the
 * first has travelled its own width the second occupies where the first began,
 * so the reset is invisible. An earlier version slid a shared track by -50%
 * instead; that's equivalent on paper but makes the percentage depend on the
 * parent resolving `width: max-content` first, and it didn't reliably run.
 *
 * The spacing lives on each list (`gap` plus a matching `pr`) rather than on the
 * container — without the trailing padding the two copies would butt together
 * one gap short, and the loop would visibly stutter once per cycle.
 *
 * The animation is CSS, so this stays a server component and the row scrolls
 * without waiting on hydration.
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
    <div className="fp-marquee">
      <AudienceList />
      <AudienceList duplicate />
    </div>
  )
}

function AudienceList({ duplicate }: { duplicate?: boolean }) {
  return (
    // The trailing padding must match the gap, so the two copies stay exactly
    // one gap apart and the loop doesn't jump.
    <ul
      className="fp-marquee-group flex items-center gap-12 pr-12"
      aria-hidden={duplicate || undefined}
    >
      {AUDIENCES.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap text-sm font-medium text-white/35 transition-colors hover:text-white/70"
        >
          <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
          {label}
        </li>
      ))}
    </ul>
  )
}
