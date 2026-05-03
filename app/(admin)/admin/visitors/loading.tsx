import { SkeletonCards } from "@/components/admin/Skeleton";

export default function VisitorsLoading() {
  return (
    <div>
      <div className="mb-5">
        <div className="h-6 w-32 animate-pulse rounded-lg mb-1" style={{ background: "var(--ink-100)" }} />
        <div className="h-4 w-28 animate-pulse rounded" style={{ background: "var(--ink-100)" }} />
      </div>
      <SkeletonCards count={6} />
    </div>
  );
}
