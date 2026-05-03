import { SkeletonCards } from "@/components/admin/Skeleton";

export default function PlacesLoading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="h-6 w-24 animate-pulse rounded-lg mb-1" style={{ background: "var(--ink-100)" }} />
          <div className="h-4 w-28 animate-pulse rounded" style={{ background: "var(--ink-100)" }} />
        </div>
        <div className="h-9 w-32 animate-pulse rounded-[var(--r-md)]" style={{ background: "var(--ink-100)" }} />
      </div>
      <SkeletonCards count={6} />
    </div>
  );
}
