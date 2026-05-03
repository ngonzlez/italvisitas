import { SkeletonChart } from "@/components/admin/Skeleton";

export default function ReportsLoading() {
  return (
    <div>
      <div className="mb-5">
        <div className="h-6 w-24 animate-pulse rounded-lg mb-1" style={{ background: "var(--ink-100)" }} />
        <div className="h-4 w-28 animate-pulse rounded" style={{ background: "var(--ink-100)" }} />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <SkeletonChart />
        <SkeletonChart />
        <SkeletonChart />
        <SkeletonChart />
      </div>
    </div>
  );
}
