import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { formatDate, formatTimeAgo, PLACE_TYPE_LABEL, STOCK_CONFIG } from "@/lib/utils";
import { StockBadge } from "@/components/ui/badge";
import DashboardCharts from "@/components/admin/DashboardCharts";
import { Users, ClipboardList, TrendingUp, CheckSquare } from "lucide-react";

export default async function AdminDashboardPage() {
  const now = new Date();
  const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(now); monthAgo.setDate(monthAgo.getDate() - 30);
  const today = new Date(now); today.setHours(0, 0, 0, 0);

  const [
    totalVisits,
    weekVisits,
    todayVisits,
    activeVisitors,
    recentVisits,
    visitorStats,
    placeStats,
    todayAttendance,
    dailyData,
  ] = await Promise.all([
    prisma.visit.count(),
    prisma.visit.count({ where: { date: { gte: weekAgo } } }),
    prisma.visit.count({ where: { date: { gte: today } } }),
    prisma.user.count({ where: { role: "VISITOR" } }),
    prisma.visit.findMany({
      take: 8, orderBy: { date: "desc" },
      include: { visitor: true, place: true },
    }),
    prisma.visit.groupBy({
      by: ["visitorId"], _count: { id: true },
      where: { date: { gte: monthAgo } }, orderBy: { _count: { id: "desc" } }, take: 5,
    }),
    prisma.visit.groupBy({
      by: ["placeId"], _count: { id: true },
      where: { date: { gte: monthAgo } }, orderBy: { _count: { id: "desc" } }, take: 5,
    }),
    prisma.attendance.count({ where: { checkIn: { gte: today } } }),
    // Last 7 days visit counts
    prisma.$queryRaw<{ day: string; count: bigint }[]>`
      SELECT DATE("date") as day, COUNT(*) as count
      FROM "Visit"
      WHERE "date" >= ${weekAgo}
      GROUP BY DATE("date")
      ORDER BY day ASC
    `,
  ]);

  // Resolve visitor names
  const visitorIds = visitorStats.map(v => v.visitorId);
  const placeIds = placeStats.map(p => p.placeId);
  const [visitorUsers, visitPlaces] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: visitorIds } }, select: { id: true, name: true, initials: true } }),
    prisma.place.findMany({ where: { id: { in: placeIds } }, select: { id: true, name: true, type: true } }),
  ]);

  const kpis = [
    { label: "Visitas hoy",     value: todayVisits,    icon: ClipboardList, color: "var(--brand-700)"  },
    { label: "Esta semana",     value: weekVisits,     icon: TrendingUp,    color: "var(--accent-600)" },
    { label: "Total visitas",   value: totalVisits,    icon: ClipboardList, color: "var(--ink-700)"    },
    { label: "Presentes hoy",   value: todayAttendance, icon: CheckSquare,  color: "var(--warn-600)"   },
  ];

  const chartData = dailyData.map(d => ({
    day: new Date(d.day).toLocaleDateString("es-PY", { weekday: "short", day: "numeric" }),
    visitas: Number(d.count),
  }));

  const visitorRanking = visitorStats.map(vs => {
    const user = visitorUsers.find(u => u.id === vs.visitorId);
    return { name: user?.name ?? "—", initials: user?.initials ?? "?", count: vs._count.id };
  });

  const placeRanking = placeStats.map(ps => {
    const place = visitPlaces.find(p => p.id === ps.placeId);
    return { name: place?.name ?? "—", type: place?.type ?? "FARMACIA", count: ps._count.id };
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: "var(--ink-900)" }}>Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--ink-500)" }}>
          {formatDate(now, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--ink-500)" }}>{label}</p>
                <p className="text-2xl font-extrabold mt-1" style={{ color }}>{value}</p>
              </div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--ink-100)" }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {/* Chart */}
        <Card className="lg:col-span-2 p-4">
          <p className="text-sm font-bold mb-3" style={{ color: "var(--ink-800)" }}>Visitas últimos 7 días</p>
          <DashboardCharts data={chartData} />
        </Card>

        {/* Visitor ranking */}
        <Card className="p-4">
          <p className="text-sm font-bold mb-3" style={{ color: "var(--ink-800)" }}>Top visitadores</p>
          <div className="flex flex-col gap-2.5">
            {visitorRanking.map((v, i) => (
              <div key={v.name} className="flex items-center gap-2.5">
                <span className="text-xs font-bold w-4 text-right shrink-0" style={{ color: "var(--ink-400)" }}>{i + 1}</span>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: "var(--brand-600)" }}>
                  {v.initials}
                </div>
                <span className="text-sm flex-1 truncate" style={{ color: "var(--ink-800)" }}>{v.name}</span>
                <span className="text-sm font-bold" style={{ color: "var(--brand-700)" }}>{v.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent visits */}
        <Card className="p-4">
          <p className="text-sm font-bold mb-3" style={{ color: "var(--ink-800)" }}>Actividad reciente</p>
          <div className="flex flex-col gap-2.5">
            {recentVisits.map((v) => (
              <div key={v.id} className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5" style={{ background: "var(--brand-600)" }}>
                  {v.visitor.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--ink-900)" }}>{v.place.name}</p>
                  <p className="text-xs truncate" style={{ color: "var(--ink-500)" }}>{v.visitor.name} · {formatTimeAgo(v.date)}</p>
                </div>
                <StockBadge stock={v.stock} />
              </div>
            ))}
          </div>
        </Card>

        {/* Top places */}
        <Card className="p-4">
          <p className="text-sm font-bold mb-3" style={{ color: "var(--ink-800)" }}>Lugares más visitados</p>
          <div className="flex flex-col gap-2.5">
            {placeRanking.map((p, i) => (
              <div key={p.name} className="flex items-center gap-2.5">
                <span className="text-xs font-bold w-4 text-right shrink-0" style={{ color: "var(--ink-400)" }}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--ink-800)" }}>{p.name}</p>
                  <p className="text-xs" style={{ color: "var(--ink-500)" }}>{PLACE_TYPE_LABEL[p.type]}</p>
                </div>
                <span className="text-sm font-bold" style={{ color: "var(--brand-700)" }}>{p.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
