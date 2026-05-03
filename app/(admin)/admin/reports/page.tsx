import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { PLACE_TYPE_LABEL, STOCK_CONFIG } from "@/lib/utils";
import ReportsCharts from "@/components/admin/ReportsCharts";

export default async function AdminReportsPage() {
  const now = new Date();
  const monthAgo = new Date(now); monthAgo.setDate(monthAgo.getDate() - 30);

  const [byStock, byPlaceType, byVisitor, monthlyVisits] = await Promise.all([
    prisma.visit.groupBy({ by: ["stock"], _count: { id: true } }),
    prisma.visit.groupBy({
      by: ["placeId"], _count: { id: true },
      where: { date: { gte: monthAgo } }, orderBy: { _count: { id: "desc" } }, take: 8,
    }),
    prisma.visit.groupBy({
      by: ["visitorId"], _count: { id: true },
      where: { date: { gte: monthAgo } }, orderBy: { _count: { id: "desc" } },
    }),
    prisma.$queryRaw<{ month: string; count: bigint }[]>`
      SELECT TO_CHAR("date", 'YYYY-MM') as month, COUNT(*) as count
      FROM "Visit"
      GROUP BY TO_CHAR("date", 'YYYY-MM')
      ORDER BY month ASC
      LIMIT 12
    `,
  ]);

  const placeIds = byPlaceType.map(p => p.placeId);
  const visitorIds = byVisitor.map(v => v.visitorId);
  const [places, visitors] = await Promise.all([
    prisma.place.findMany({ where: { id: { in: placeIds } }, select: { id: true, name: true, type: true } }),
    prisma.user.findMany({ where: { id: { in: visitorIds } }, select: { id: true, name: true } }),
  ]);

  const stockData = byStock.map(s => ({
    name: STOCK_CONFIG[s.stock]?.label ?? s.stock,
    value: s._count.id,
    color: STOCK_CONFIG[s.stock]?.color ?? "#999",
  }));

  const placeData = byPlaceType.map(p => ({
    name: places.find(pl => pl.id === p.placeId)?.name ?? "—",
    visitas: p._count.id,
  }));

  const visitorData = byVisitor.map(v => ({
    name: visitors.find(u => u.id === v.visitorId)?.name ?? "—",
    visitas: v._count.id,
  }));

  const trendData = monthlyVisits.map(m => ({
    month: m.month,
    visitas: Number(m.count),
  }));

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: "var(--ink-900)" }}>Reportes</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--ink-500)" }}>Últimos 30 días</p>
      </div>

      <ReportsCharts stockData={stockData} placeData={placeData} visitorData={visitorData} trendData={trendData} />
    </div>
  );
}
