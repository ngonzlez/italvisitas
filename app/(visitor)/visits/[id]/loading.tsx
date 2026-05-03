export default function VisitDetailLoading() {
  const pulse = { background: "var(--ink-100)" } as const;
  return (
    <div className="px-4 pt-4 pb-4">
      {/* Back link */}
      <div className="h-4 w-16 animate-pulse rounded mb-4" style={pulse} />
      {/* Title + badge */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div>
          <div className="h-6 w-44 animate-pulse rounded-lg mb-1.5" style={pulse} />
          <div className="h-3 w-32 animate-pulse rounded" style={pulse} />
        </div>
        <div className="h-6 w-24 animate-pulse rounded-full" style={pulse} />
      </div>
      {/* Info card */}
      <div className="p-4 rounded-[var(--r-xl)] border mb-3" style={{ background: "var(--ink-white)", borderColor: "var(--ink-100)" }}>
        {[44, 36, 48, 28].map((w, i) => (
          <div key={i} className="flex items-center gap-2 mb-2 last:mb-0">
            <div className="h-4 w-4 animate-pulse rounded shrink-0" style={pulse} />
            <div className={`h-3 w-${w} animate-pulse rounded`} style={pulse} />
          </div>
        ))}
      </div>
      {/* Objetivo + Hallazgo cards */}
      {[0, 1].map((i) => (
        <div key={i} className="p-4 rounded-[var(--r-xl)] border mb-3" style={{ background: "var(--ink-white)", borderColor: "var(--ink-100)" }}>
          <div className="h-3 w-20 animate-pulse rounded mb-2" style={pulse} />
          <div className="h-4 w-full animate-pulse rounded mb-1" style={pulse} />
          <div className="h-4 w-3/4 animate-pulse rounded" style={pulse} />
        </div>
      ))}
    </div>
  );
}
