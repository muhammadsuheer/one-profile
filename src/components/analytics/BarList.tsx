export function BarList({
  title,
  items,
  empty,
}: {
  title: string
  items: { label: string; count: number }[]
  empty: string
}) {
  const max = Math.max(1, ...items.map((i) => i.count))

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-400">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item, i) => (
            <li key={i} className="relative">
              <div
                className="absolute inset-y-0 left-0 rounded-md bg-[#F5124A]/10"
                style={{ width: `${(item.count / max) * 100}%` }}
                aria-hidden
              />
              <div className="relative flex items-center justify-between gap-3 px-2 py-1.5">
                <span className="truncate text-sm text-neutral-700">{item.label}</span>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-neutral-900">
                  {item.count.toLocaleString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
