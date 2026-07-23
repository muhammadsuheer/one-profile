interface Point {
  label: string
  views: number
  clicks: number
}

export function LineChart({ data }: { data: Point[] }) {
  const W = 720
  const H = 220
  const padL = 6
  const padR = 6
  const padT = 14
  const padB = 22
  const innerW = W - padL - padR
  const innerH = H - padT - padB

  const max = Math.max(1, ...data.map((d) => Math.max(d.views, d.clicks)))
  const n = data.length
  const x = (i: number) => padL + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW)
  const y = (v: number) => padT + innerH - (v / max) * innerH

  const path = (key: 'views' | 'clicks') =>
    data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(d[key]).toFixed(1)}`).join(' ')

  const viewsArea =
    n > 0
      ? `${path('views')} L${x(n - 1).toFixed(1)} ${(padT + innerH).toFixed(1)} L${x(0).toFixed(1)} ${(padT + innerH).toFixed(1)} Z`
      : ''

  const totalViews = data.reduce((a, d) => a + d.views, 0)
  const totalClicks = data.reduce((a, d) => a + d.clicks, 0)
  const hasData = totalViews + totalClicks > 0

  const first = data[0]?.label ?? ''
  const last = data[data.length - 1]?.label ?? ''

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900">Traffic</h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-neutral-500">
            <span className="h-2 w-2 rounded-full bg-[#8b5cf6]" /> Views
          </span>
          <span className="flex items-center gap-1.5 text-neutral-500">
            <span className="h-2 w-2 rounded-full bg-[#F5124A]" /> Clicks
          </span>
        </div>
      </div>

      <div className="relative mt-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Traffic over time">
          {/* gridlines */}
          {[0, 0.5, 1].map((t) => (
            <line
              key={t}
              x1={padL}
              x2={W - padR}
              y1={padT + innerH * t}
              y2={padT + innerH * t}
              stroke="#eee"
              strokeWidth={1}
            />
          ))}
          {hasData && (
            <>
              <path d={viewsArea} fill="#8b5cf6" opacity={0.08} />
              <path d={path('views')} fill="none" stroke="#8b5cf6" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              <path d={path('clicks')} fill="none" stroke="#F5124A" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            </>
          )}
        </svg>
        {!hasData && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-neutral-400">No traffic in this period yet</p>
          </div>
        )}
      </div>

      <div className="mt-1 flex justify-between text-xs text-neutral-400">
        <span>{first}</span>
        <span className="tabular-nums">peak {max.toLocaleString()}</span>
        <span>{last}</span>
      </div>
    </div>
  )
}
