import { Sparkles } from 'lucide-react'
import { ACCENT, CARD } from './tokens'

/**
 * Lower-left corner card: an AI suggestion waiting to be applied.
 *
 * Kept to a title and a single line, like the reference. An earlier version had
 * a second line plus its own Apply/Dismiss row, which made it tall and heavy
 * enough to crowd the CTA — these cards are meant to be glanced at, not read.
 */
export default function AgentCard() {
  return (
    <div
      className="w-60 rounded-xl border border-white/10 p-3.5 shadow-2xl backdrop-blur"
      style={{ backgroundColor: `${CARD}e6` }}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex h-5 w-5 items-center justify-center rounded"
          style={{ backgroundColor: `${ACCENT}26`, color: ACCENT }}
        >
          <Sparkles className="h-3 w-3" />
        </span>
        <span className="font-mono text-xs font-semibold text-white">FolioPage-AI</span>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-white/55">
        Move your top link up — <span style={{ color: ACCENT }}>Apply</span>
      </p>
    </div>
  )
}
