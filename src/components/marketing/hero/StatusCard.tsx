import { CARD } from './tokens'

/**
 * Bottom-right corner card: the page as published, mirroring the reference's
 * pull-request card — a mono title, the blocks that make up the page, and a
 * summary row. Anchors the right side of the composition.
 */
const BLOCKS = [
  { color: '#22d3ee', label: 'Profile' },
  { color: '#a78bfa', label: 'LinkCard' },
  { color: '#fbbf24', label: 'EmailCapture' },
]

export default function StatusCard() {
  return (
    <div
      className="w-64 rounded-xl border border-white/10 p-3.5 shadow-2xl backdrop-blur"
      style={{ backgroundColor: `${CARD}e6` }}
    >
      <div className="font-mono text-xs font-semibold text-white">ava.foliopage.site</div>

      <ul className="mt-3 space-y-2">
        {BLOCKS.map((block) => (
          <li key={block.label} className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: block.color }} />
            <span className="font-mono text-xs text-white/55">{block.label}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-3 font-mono text-[11px]">
        <span className="font-semibold text-[#34d399]">+3</span>
        <span className="text-white/35">blocks</span>
        <span className="ml-auto rounded bg-[#34d399]/15 px-2 py-0.5 font-bold tracking-wide text-[#34d399]">
          LIVE
        </span>
      </div>
    </div>
  )
}
