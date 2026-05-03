import { SkeletonTable } from "@/components/admin/Skeleton";

export default function AttendanceLoading() {
  return (
    <div>
      <div className="mb-5">
        <div className="h-6 w-28 animate-pulse rounded-lg mb-1" style={{ background: "var(--ink-100)" }} />
        <div className="h-4 w-24 animate-pulse rounded" style={{ background: "var(--ink-100)" }} />
      </div>
      <SkeletonTable rows={10} />
    </div>
  );
}
