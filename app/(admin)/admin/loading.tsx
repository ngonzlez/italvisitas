import { SkeletonKPI, SkeletonChart, SkeletonCards } from "@/components/admin/Skeleton";

export default function DashboardLoading() {
  return (
    <div>
      <div className="mb-6">
        <div className="h-6 w-32 animate-pulse rounded-lg mb-1" style={{ background: "var(--ink-100)" }} />
        <div className="h-4 w-48 animate-pulse rounded" style={{ background: "var(--ink-100)" }} />
      </div>
      <SkeletonKPI />
      <div className="grid lg:grid-cols-3 gap-4 mt-6 mb-6">
        <div className="lg:col-span-2"><SkeletonChart /></div>
        <SkeletonChart />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <SkeletonChart />
        <SkeletonChart />
      </div>
    </div>
  );
}
