export default function VisitsLoading() {
  const pulse = { background: "var(--ink-100)" } as const;
  return (
    <div className="px-4 pt-4 pb-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="h-5 w-40 animate-pulse rounded-lg mb-1" style={pulse} />
          <div className="h-3 w-28 animate-pulse rounded" style={pulse} />
        </div>
        <div className="h-8 w-20 animate-pulse rounded-[var(--r-md)]" style={pulse} />
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[0, 1].map((i) => (
          <div key={i} className="p-4 rounded-[var(--r-xl)] border" style={{ background: "var(--ink-white)", borderColor: "var(--ink-100)" }}>
            <div className="h-7 w-8 animate-pulse rounded mx-auto mb-1" style={pulse} />
            <div className="h-3 w-16 animate-pulse rounded mx-auto mb-0.5" style={pulse} />
            <div className="h-2.5 w-10 animate-pulse rounded mx-auto" style={pulse} />
          </div>
        ))}
      </div>
      {/* Attendance card */}
      <div className="h-16 animate-pulse rounded-[var(--r-xl)] mb-4" style={pulse} />
      {/* Visits list */}
      <div className="h-4 w-28 animate-pulse rounded mb-3" style={pulse} />
      <div className="flex flex-col gap-2.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-[var(--r-xl)] border" style={{ background: "var(--ink-white)", borderColor: "var(--ink-100)" }}>
            <div className="flex justify-between gap-2">
              <div className="flex-1">
                <div className="h-4 w-36 animate-pulse rounded mb-1.5" style={pulse} />
                <div className="h-3 w-24 animate-pulse rounded mb-1.5" style={pulse} />
                <div className="h-3 w-48 animate-pulse rounded" style={pulse} />
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <div className="h-3 w-12 animate-pulse rounded" style={pulse} />
                <div className="h-5 w-20 animate-pulse rounded-full" style={pulse} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
