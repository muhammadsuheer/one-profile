import { Sparkles } from 'lucide-react'
import { ACCENT, CARD } from './tokens'

/**
 * Bottom-left corner card: an AI suggestion waiting to be applied. Anchors the
 * left side of the composition so the hero doesn't go hollow at full width.
 */
export default function AgentCard() {
  return (
    <div
      className="w-[17rem] rounded-xl border border-white/10 p-4 shadow-2xl backdrop-blur"
      style={{ backgroundColor: `${CARD}e6` }}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex h-6 w-6 items-center justify-center rounded-md"
          style={{ backgroundColor: `${ACCENT}26`, color: ACCENT }}
        >
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <span className="font-mono text-xs font-semibold text-white">FolioPage-AI</span>
      </div>

      <p className="mt-2.5 text-xs leading-relaxed text-white/60">
        Your top link gets 4× the taps. Move it above the fold?
      </p>

      <div className="mt-3.5 flex items-center gap-2">
        <span
          className="rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
          style={{ backgroundColor: ACCENT }}
        >
          Apply
        </span>
        <span className="text-[11px] text-white/35">Dismiss</span>
      </div>
    </div>
  )
}
