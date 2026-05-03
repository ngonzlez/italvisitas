import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { StockBadge, PlaceTypeBadge } from "@/components/ui/badge";
import { formatDate, formatTime, PLACE_TYPE_LABEL } from "@/lib/utils";
import VisitsFilter from "@/components/admin/VisitsFilter";

export default async function AdminVisitsPage({
  searchParams,
}: {
  searchParams: { visitorId?: string; placeType?: string; from?: string; to?: string };
}) {
  const sp = await searchParams;
  const where: Record<string, unknown> = {};
  if (sp.visitorId) where.visitorId = sp.visitorId;
  if (sp.placeType)  where.place = { type: sp.placeType };
  if (sp.from || sp.to) {
    where.date = {};
    if (sp.from) (where.date as Record<string,unknown>).gte = new Date(sp.from);
    if (sp.to)   (where.date as Record<string,unknown>).lte = new Date(sp.to + "T23:59:59");
  }

  const [visits, visitors] = await Promise.all([
    prisma.visit.findMany({
      where,
      include: { visitor: true, place: true, doctor: true },
      orderBy: { date: "desc" },
      take: 100,
    }),
    prisma.user.findMany({ where: { role: "VISITOR" }, select: { id: true, name: true } }),
  ]);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: "var(--ink-900)" }}>Visitas</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--ink-500)" }}>{visits.length} registros</p>
      </div>

      <VisitsFilter visitors={visitors} />

      <Card className="mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs font-semibold uppercase tracking-wide" style={{ borderColor: "var(--ink-100)", color: "var(--ink-500)" }}>
                {["Fecha", "Visitador", "Lugar", "Tipo", "Médico", "Stock", "Objetivo"].map(h => (
                  <th key={h} className="text-left px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visits.map((v, i) => (
                <tr
                  key={v.id}
                  className="border-b transition-colors hover:bg-[var(--ink-50)]"
                  style={{ borderColor: "var(--ink-100)", background: i % 2 === 0 ? "transparent" : "var(--ink-50)" }}
                >
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--ink-700)" }}>
                    <span className="block">{formatDate(v.date)}</span>
                    <span className="text-xs" style={{ color: "var(--ink-400)" }}>{formatTime(v.date)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: "var(--brand-600)" }}>
                        {v.visitor.initials}
                      </div>
                      <span className="whitespace-nowrap" style={{ color: "var(--ink-800)" }}>{v.visitor.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--ink-800)" }}>
                    <span className="font-medium">{v.place.name}</span>
                    <span className="block text-xs" style={{ color: "var(--ink-500)" }}>{v.place.zone}</span>
                  </td>
                  <td className="px-4 py-3"><PlaceTypeBadge type={v.place.type} /></td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--ink-600)" }}>{v.doctor?.name ?? "—"}</td>
                  <td className="px-4 py-3"><StockBadge stock={v.stock} /></td>
                  <td className="px-4 py-3 max-w-[200px] truncate text-xs" style={{ color: "var(--ink-600)" }}>{v.objective}</td>
                </tr>
              ))}
              {visits.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm" style={{ color: "var(--ink-400)" }}>Sin visitas para los filtros seleccionados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
