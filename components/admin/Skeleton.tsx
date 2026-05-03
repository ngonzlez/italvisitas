import { cn } from "@/lib/utils";

function Pulse({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-xl", className)}
      style={{ background: "var(--ink-100)" }}
    />
  );
}

export function SkeletonKPI() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-[var(--r-xl)] border p-4"
          style={{ background: "var(--ink-white)", borderColor: "var(--ink-100)" }}
        >
          <Pulse className="h-3 w-20 mb-3" />
          <Pulse className="h-8 w-12" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div
      className="rounded-[var(--r-xl)] border p-4"
      style={{ background: "var(--ink-white)", borderColor: "var(--ink-100)" }}
    >
      <Pulse className="h-4 w-40 mb-4" />
      <Pulse className="h-44 w-full" />
    </div>
  );
}

export function SkeletonTable({ rows = 8 }: { rows?: number }) {
  return (
    <div
      className="rounded-[var(--r-xl)] border overflow-hidden"
      style={{ background: "var(--ink-white)", borderColor: "var(--ink-100)" }}
    >
      <div className="px-4 py-3 border-b" style={{ borderColor: "var(--ink-100)" }}>
        <Pulse className="h-3 w-full" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="px-4 py-3 border-b flex gap-4 items-center"
          style={{ borderColor: "var(--ink-100)" }}
        >
          <Pulse className="h-3 w-24 shrink-0" />
          <Pulse className="h-3 w-32 shrink-0" />
          <Pulse className="h-3 flex-1" />
          <Pulse className="h-3 w-16 shrink-0" />
          <Pulse className="h-5 w-20 rounded-full shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonCards({ count = 6 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-[var(--r-xl)] border p-5"
          style={{ background: "var(--ink-white)", borderColor: "var(--ink-100)" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Pulse className="w-11 h-11 rounded-full shrink-0" />
            <div className="flex-1">
              <Pulse className="h-3 w-28 mb-2" />
              <Pulse className="h-2.5 w-40" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Pulse className="h-12 rounded-[var(--r-md)]" />
            <Pulse className="h-12 rounded-[var(--r-md)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ rows = 6 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="rounded-[var(--r-xl)] border p-4 flex items-center gap-3"
          style={{ background: "var(--ink-white)", borderColor: "var(--ink-100)" }}
        >
          <Pulse className="w-10 h-10 rounded-full shrink-0" />
          <div className="flex-1">
            <Pulse className="h-3 w-36 mb-2" />
            <Pulse className="h-2.5 w-48" />
          </div>
          <Pulse className="h-5 w-16 rounded-full shrink-0" />
          <Pulse className="w-7 h-7 rounded-[var(--r-sm)] shrink-0" />
          <Pulse className="w-7 h-7 rounded-[var(--r-sm)] shrink-0" />
        </div>
      ))}
    </div>
  );
}
