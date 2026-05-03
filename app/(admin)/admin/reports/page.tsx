import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { STOCK_CONFIG } from "@/lib/utils";
import ReportsCharts from "@/components/admin/ReportsCharts";
import ReportsExportButton from "@/components/admin/ReportsExportButton";
import { PlaceTypeBadge } from "@/components/ui/badge";

export default async function AdminReportsPage() {
  const now = new Date();
  const monthAgo = new Date(now); monthAgo.setDate(monthAgo.getDate() - 30);

  const [byStock, byPlaceType, byVisitor, monthlyVisits, doctorsList, placesList, visitorsList] = await Promise.all([
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
    prisma.doctor.findMany({
      include: {
        specialty: { select: { name: true } },
        places: { select: { name: true } },
        _count: { select: { visits: true } },
      },
      orderBy: { visits: { _count: "desc" } },
    }),
    prisma.place.findMany({
      include: { zone: { select: { name: true } }, _count: { select: { visits: true } } },
      orderBy: { visits: { _count: "desc" } },
    }),
    prisma.user.findMany({
      where: { role: "VISITOR" },
      select: { name: true, _count: { select: { visits: true } } },
      orderBy: { visits: { _count: "desc" } },
    }),
  ]);

  const placeIds = byPlaceType.map(p => p.placeId);
  const visitorIds = byVisitor.map(v => v.visitorId);
  const [chartPlaces, chartVisitors] = await Promise.all([
    prisma.place.findMany({ where: { id: { in: placeIds } }, select: { id: true, name: true, type: true } }),
    prisma.user.findMany({ where: { id: { in: visitorIds } }, select: { id: true, name: true } }),
  ]);

  const stockData = byStock.map(s => ({
    name: STOCK_CONFIG[s.stock]?.label ?? s.stock,
    value: s._count.id,
    color: STOCK_CONFIG[s.stock]?.color ?? "#999",
  }));

  const placeData = byPlaceType.map(p => ({
    name: chartPlaces.find(pl => pl.id === p.placeId)?.name ?? "—",
    visitas: p._count.id,
  }));

  const visitorData = byVisitor.map(v => ({
    name: chartVisitors.find(u => u.id === v.visitorId)?.name ?? "—",
    visitas: v._count.id,
  }));

  const trendData = monthlyVisits.map(m => ({
    month: m.month,
    visitas: Number(m.count),
  }));

  const exportData = {
    stockData,
    trendData,
    doctorsList: doctorsList.map(d => ({
      name: d.name,
      specialty: d.specialty.name,
      place: d.places[0]?.name ?? "—",
      visitas: d._count.visits,
    })),
    placesList: placesList.map(p => ({
      name: p.name,
      type: p.type,
      zone: p.zone.name,
      visitas: p._count.visits,
    })),
    visitorsList: visitorsList.map(v => ({
      name: v.name,
      visitas: v._count.visits,
    })),
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--ink-900)" }}>Reportes</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--ink-500)" }}>Últimos 30 días</p>
        </div>
        <ReportsExportButton data={exportData} />
      </div>

      {/* Charts section */}
      <p className="text-sm font-semibold mb-3" style={{ color: "var(--ink-600)" }}>Gráficos</p>
      <ReportsCharts stockData={stockData} placeData={placeData} visitorData={visitorData} trendData={trendData} />

      {/* Lista section */}
      <p className="text-sm font-semibold mt-8 mb-3" style={{ color: "var(--ink-600)" }}>Lista</p>

      <div className="flex flex-col gap-5">
        {/* Médicos */}
        <Card className="overflow-hidden">
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--ink-100)" }}>
            <p className="text-sm font-bold" style={{ color: "var(--ink-800)" }}>Médicos</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs font-semibold uppercase tracking-wide" style={{ borderColor: "var(--ink-100)", color: "var(--ink-500)" }}>
                  {["Médico", "Especialidad", "Lugar", "Visitas"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {doctorsList.map((d, i) => (
                  <tr key={d.name + i} className="border-b last:border-0" style={{ borderColor: "var(--ink-100)", background: i % 2 === 0 ? "transparent" : "var(--ink-50)" }}>
                    <td className="px-4 py-2.5 font-medium" style={{ color: "var(--ink-900)" }}>{d.name}</td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: "var(--brand-600)" }}>{d.specialty.name}</td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: "var(--ink-600)" }}>{d.places[0]?.name ?? "—"}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--ink-100)", color: "var(--ink-700)" }}>
                        {d._count.visits}
                      </span>
                    </td>
                  </tr>
                ))}
                {doctorsList.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-sm" style={{ color: "var(--ink-400)" }}>Sin médicos</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Lugares */}
        <Card className="overflow-hidden">
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--ink-100)" }}>
            <p className="text-sm font-bold" style={{ color: "var(--ink-800)" }}>Lugares</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs font-semibold uppercase tracking-wide" style={{ borderColor: "var(--ink-100)", color: "var(--ink-500)" }}>
                  {["Lugar", "Tipo", "Zona", "Visitas"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {placesList.map((p, i) => (
                  <tr key={p.name + i} className="border-b last:border-0" style={{ borderColor: "var(--ink-100)", background: i % 2 === 0 ? "transparent" : "var(--ink-50)" }}>
                    <td className="px-4 py-2.5 font-medium" style={{ color: "var(--ink-900)" }}>{p.name}</td>
                    <td className="px-4 py-2.5"><PlaceTypeBadge type={p.type as "FARMACIA" | "HOSPITAL" | "CLINICA" | "MEDICO"} /></td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: "var(--ink-600)" }}>{p.zone.name}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--ink-100)", color: "var(--ink-700)" }}>
                        {p._count.visits}
                      </span>
                    </td>
                  </tr>
                ))}
                {placesList.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-sm" style={{ color: "var(--ink-400)" }}>Sin lugares</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Visitadores */}
        <Card className="overflow-hidden">
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--ink-100)" }}>
            <p className="text-sm font-bold" style={{ color: "var(--ink-800)" }}>Visitadores</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs font-semibold uppercase tracking-wide" style={{ borderColor: "var(--ink-100)", color: "var(--ink-500)" }}>
                  {["Visitador", "Visitas"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visitorsList.map((v, i) => (
                  <tr key={v.name + i} className="border-b last:border-0" style={{ borderColor: "var(--ink-100)", background: i % 2 === 0 ? "transparent" : "var(--ink-50)" }}>
                    <td className="px-4 py-2.5 font-medium" style={{ color: "var(--ink-900)" }}>{v.name}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--ink-100)", color: "var(--ink-700)" }}>
                        {v._count.visits}
                      </span>
                    </td>
                  </tr>
                ))}
                {visitorsList.length === 0 && (
                  <tr><td colSpan={2} className="px-4 py-6 text-center text-sm" style={{ color: "var(--ink-400)" }}>Sin visitadores</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
