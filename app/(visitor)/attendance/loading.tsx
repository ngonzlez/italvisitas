export default function AttendanceLoading() {
  const pulse = { background: "var(--ink-100)" } as const;
  return (
    <div className="px-4 pt-4 pb-4">
      <div className="h-6 w-28 animate-pulse rounded-lg mb-1" style={pulse} />
      <div className="h-3 w-48 animate-pulse rounded mb-4" style={pulse} />
      {/* Attendance toggle */}
      <div className="h-20 animate-pulse rounded-[var(--r-xl)] mb-5" style={pulse} />
      {/* History header */}
      <div className="h-4 w-20 animate-pulse rounded mb-3" style={pulse} />
      <div className="flex flex-col gap-2.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-[var(--r-xl)] border" style={{ background: "var(--ink-white)", borderColor: "var(--ink-100)" }}>
            <div className="flex justify-between gap-2">
              <div>
                <div className="h-4 w-32 animate-pulse rounded mb-2" style={pulse} />
                <div className="h-3 w-44 animate-pulse rounded mb-1.5" style={pulse} />
                <div className="h-3 w-36 animate-pulse rounded" style={pulse} />
              </div>
              <div className="h-5 w-18 animate-pulse rounded-full" style={pulse} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
