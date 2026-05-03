import Link from "next/link";
import { MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { StockBadge, PlaceTypeBadge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/utils";
import VisitsFilter from "@/components/admin/VisitsFilter";

const PAGE_SIZE = 25;

function firstOfMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

function buildPageUrl(
  sp: { visitorId?: string; placeType?: string; from?: string; to?: string },
  effectiveFrom: string,
  page: number
) {
  const params = new URLSearchParams();
  if (sp.visitorId) params.set("visitorId", sp.visitorId);
  if (sp.placeType)  params.set("placeType", sp.placeType);
  // always set from (even empty string = no date filter)
  params.set("from", effectiveFrom);
  if (sp.to) params.set("to", sp.to);
  params.set("page", String(page));
  return `/admin/visits?${params.toString()}`;
}

export default async function AdminVisitsPage({
  searchParams,
}: {
  searchParams: Promise<{ visitorId?: string; placeType?: string; from?: string; to?: string; page?: string }>;
}) {
  const sp = await searchParams;

  // undefined = first load → default to first of month
  // ""        = user explicitly cleared → no date filter
  // "YYYY-MM-DD" = specific date
  const effectiveFrom = sp.from === undefined ? firstOfMonth() : sp.from;
  const page = Math.max(1, parseInt(sp.page ?? "1") || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const where: Record<string, unknown> = {};
  if (sp.visitorId) where.visitorId = sp.visitorId;
  if (sp.placeType) where.place = { type: sp.placeType };
  const dateFilter: Record<string, Date> = {};
  if (effectiveFrom) dateFilter.gte = new Date(effectiveFrom);
  if (sp.to)         dateFilter.lte = new Date(sp.to + "T23:59:59");
  if (Object.keys(dateFilter).length > 0) where.date = dateFilter;

  const [visits, total, visitors] = await Promise.all([
    prisma.visit.findMany({
      where,
      include: { visitor: true, place: true, doctor: true },
      orderBy: { date: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.visit.count({ where }),
    prisma.user.findMany({ where: { role: "VISITOR" }, select: { id: true, name: true } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const rangeStart = total === 0 ? 0 : skip + 1;
  const rangeEnd = Math.min(skip + PAGE_SIZE, total);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: "var(--ink-900)" }}>Visitas</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--ink-500)" }}>{total} registros</p>
      </div>

      <VisitsFilter visitors={visitors} defaultFrom={effectiveFrom} defaultTo={sp.to ?? ""} />

      <Card className="mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="border-b text-xs font-semibold uppercase tracking-wide"
                style={{ borderColor: "var(--ink-100)", color: "var(--ink-500)" }}
              >
                {["Fecha", "Visitador", "Lugar", "Tipo", "Médico", "Stock", "Objetivo / Hallazgo", ""].map((h) => (
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
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                        style={{ background: "var(--brand-600)" }}
                      >
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
                  <td className="px-4 py-3 max-w-[200px] text-xs" style={{ color: "var(--ink-600)" }}>
                    <span className="block truncate">{v.objective}</span>
                    {v.finding && (
                      <span className="block truncate mt-0.5" style={{ color: "var(--ink-400)" }}>{v.finding}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {v.gpsLat && v.gpsLng && (
                      <Link
                        href={`https://maps.google.com?q=${v.gpsLat},${v.gpsLng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`${v.gpsLat.toFixed(4)}, ${v.gpsLng.toFixed(4)}`}
                        className="flex items-center justify-center w-7 h-7 rounded-[var(--r-sm)] hover:bg-[var(--ink-100)] transition"
                        style={{ color: "var(--brand-600)" }}
                      >
                        <MapPin className="w-4 h-4" />
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
              {visits.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm" style={{ color: "var(--ink-400)" }}>
                    Sin visitas para los filtros seleccionados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 0 && (
          <div
            className="flex items-center justify-between px-4 py-3 border-t"
            style={{ borderColor: "var(--ink-100)" }}
          >
            <p className="text-xs" style={{ color: "var(--ink-500)" }}>
              {rangeStart}–{rangeEnd} de {total} visitas
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                {page > 1 ? (
                  <Link
                    href={buildPageUrl(sp, effectiveFrom, page - 1)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-[var(--r-sm)] border border-[var(--ink-200)] hover:bg-[var(--ink-50)] transition"
                    style={{ color: "var(--ink-700)" }}
                  >
                    ← Anterior
                  </Link>
                ) : (
                  <span
                    className="px-3 py-1.5 text-xs font-semibold rounded-[var(--r-sm)] border border-[var(--ink-100)] opacity-40 cursor-not-allowed"
                    style={{ color: "var(--ink-400)" }}
                  >
                    ← Anterior
                  </span>
                )}
                <span className="text-xs px-2" style={{ color: "var(--ink-500)" }}>
                  {page} / {totalPages}
                </span>
                {page < totalPages ? (
                  <Link
                    href={buildPageUrl(sp, effectiveFrom, page + 1)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-[var(--r-sm)] border border-[var(--ink-200)] hover:bg-[var(--ink-50)] transition"
                    style={{ color: "var(--ink-700)" }}
                  >
                    Siguiente →
                  </Link>
                ) : (
                  <span
                    className="px-3 py-1.5 text-xs font-semibold rounded-[var(--r-sm)] border border-[var(--ink-100)] opacity-40 cursor-not-allowed"
                    style={{ color: "var(--ink-400)" }}
                  >
                    Siguiente →
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
