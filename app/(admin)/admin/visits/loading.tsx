import { SkeletonTable } from "@/components/admin/Skeleton";

export default function VisitsLoading() {
  return (
    <div>
      <div className="mb-5">
        <div className="h-6 w-24 animate-pulse rounded-lg mb-1" style={{ background: "var(--ink-100)" }} />
        <div className="h-4 w-32 animate-pulse rounded" style={{ background: "var(--ink-100)" }} />
      </div>
      <div className="flex gap-3 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-36 animate-pulse rounded-[var(--r-md)]" style={{ background: "var(--ink-100)" }} />
        ))}
      </div>
      <SkeletonTable rows={10} />
    </div>
  );
}
