export default function PlaceDetailLoading() {
  const pulse = { background: "var(--ink-100)" } as const;
  return (
    <div className="pb-4">
      <div className="h-4 w-20 animate-pulse rounded mb-4" style={pulse} />
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-6 w-44 animate-pulse rounded-lg" style={pulse} />
            <div className="h-5 w-20 animate-pulse rounded-full" style={pulse} />
          </div>
          <div className="h-3 w-56 animate-pulse rounded mt-1" style={pulse} />
        </div>
        <div className="h-6 w-20 animate-pulse rounded-full" style={pulse} />
      </div>
      <div className="p-4 rounded-[var(--r-xl)] border mb-4" style={{ borderColor: "var(--ink-100)" }}>
        <div className="h-3 w-16 animate-pulse rounded mb-2.5" style={pulse} />
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-6 w-28 animate-pulse rounded-full" style={pulse} />
          ))}
        </div>
      </div>
      <div className="rounded-[var(--r-xl)] border overflow-hidden" style={{ borderColor: "var(--ink-100)" }}>
        <div className="h-10 border-b" style={{ ...pulse, borderColor: "var(--ink-100)" }} />
        <div className="h-10 border-b" style={{ borderColor: "var(--ink-100)" }} />
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="flex gap-4 px-4 py-3 border-b last:border-0" style={{ borderColor: "var(--ink-100)" }}>
            <div className="h-4 w-32 animate-pulse rounded" style={pulse} />
            <div className="h-4 w-24 animate-pulse rounded" style={pulse} />
            <div className="h-4 w-24 animate-pulse rounded" style={pulse} />
            <div className="h-4 w-16 animate-pulse rounded" style={pulse} />
          </div>
        ))}
      </div>
    </div>
  );
}
