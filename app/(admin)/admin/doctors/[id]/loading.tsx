export default function DoctorDetailLoading() {
  const pulse = { background: "var(--ink-100)" } as const;
  return (
    <div className="px-0 pt-0 pb-4">
      <div className="h-4 w-20 animate-pulse rounded mb-4" style={pulse} />
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 animate-pulse rounded-full" style={pulse} />
          <div>
            <div className="h-6 w-40 animate-pulse rounded-lg mb-1" style={pulse} />
            <div className="h-3 w-24 animate-pulse rounded" style={pulse} />
          </div>
        </div>
        <div className="h-6 w-20 animate-pulse rounded-full" style={pulse} />
      </div>
      <div className="p-4 rounded-[var(--r-xl)] border mb-4" style={{ borderColor: "var(--ink-100)" }}>
        <div className="h-4 w-64 animate-pulse rounded" style={pulse} />
      </div>
      <div className="rounded-[var(--r-xl)] border overflow-hidden" style={{ borderColor: "var(--ink-100)" }}>
        <div className="h-10 border-b" style={{ ...pulse, borderColor: "var(--ink-100)" }} />
        <div className="h-10 border-b" style={{ borderColor: "var(--ink-100)" }} />
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="flex gap-4 px-4 py-3 border-b last:border-0" style={{ borderColor: "var(--ink-100)" }}>
            <div className="h-4 w-32 animate-pulse rounded" style={pulse} />
            <div className="h-4 w-24 animate-pulse rounded" style={pulse} />
            <div className="h-4 w-16 animate-pulse rounded" style={pulse} />
          </div>
        ))}
      </div>
    </div>
  );
}
