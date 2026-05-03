import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { formatDate, formatTime, formatDuration } from "@/lib/utils";
import { Clock } from "lucide-react";
import AttendanceFilter from "@/components/admin/AttendanceFilter";

const PAGE_SIZE = 25;

function firstOfMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

function buildPageUrl(
  sp: { from?: string; to?: string },
  effectiveFrom: string,
  page: number
) {
  const params = new URLSearchParams();
  params.set("from", effectiveFrom);
  if (sp.to) params.set("to", sp.to);
  params.set("page", String(page));
  return `/admin/attendance?${params.toString()}`;
}

export default async function AdminAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; page?: string }>;
}) {
  const sp = await searchParams;

  const effectiveFrom = sp.from === undefined ? firstOfMonth() : sp.from;
  const page = Math.max(1, parseInt(sp.page ?? "1") || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const where: Record<string, unknown> = {};
  const dateFilter: Record<string, Date> = {};
  if (effectiveFrom) dateFilter.gte = new Date(effectiveFrom);
  if (sp.to) dateFilter.lte = new Date(sp.to + "T23:59:59");
  if (Object.keys(dateFilter).length > 0) where.checkIn = dateFilter;

  const [records, total] = await Promise.all([
    prisma.attendance.findMany({
      where,
      include: { visitor: true },
      orderBy: { checkIn: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.attendance.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const rangeStart = total === 0 ? 0 : skip + 1;
  const rangeEnd = Math.min(skip + PAGE_SIZE, total);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: "var(--ink-900)" }}>Asistencia</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--ink-500)" }}>{total} registros</p>
      </div>

      <AttendanceFilter defaultFrom={effectiveFrom} defaultTo={sp.to ?? ""} />

      <Card className="mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs font-semibold uppercase tracking-wide" style={{ borderColor: "var(--ink-100)", color: "var(--ink-500)" }}>
                {["Fecha", "Visitador", "Entrada", "Salida", "Duración", "Estado"].map(h => (
                  <th key={h} className="text-left px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((a, i) => (
                <tr
                  key={a.id}
                  className="border-b transition-colors hover:bg-[var(--ink-50)]"
                  style={{ borderColor: "var(--ink-100)", background: i % 2 === 0 ? "transparent" : "var(--ink-50)" }}
                >
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--ink-700)" }}>
                    {formatDate(a.checkIn, { weekday: "short", day: "numeric", month: "short" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: "var(--brand-600)" }}>
                        {a.visitor.initials}
                      </div>
                      <span style={{ color: "var(--ink-800)" }}>{a.visitor.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" style={{ color: "var(--brand-500)" }} />
                      <span style={{ color: "var(--ink-700)" }}>{formatTime(a.checkIn)}</span>
                    </div>
                    {a.checkInAddr && <p className="text-xs mt-0.5 max-w-[180px] truncate" style={{ color: "var(--ink-400)" }}>{a.checkInAddr}</p>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--ink-700)" }}>
                    {a.checkOut ? (
                      <>
                        {formatTime(a.checkOut)}
                        {a.checkOutAddr && <p className="text-xs mt-0.5 max-w-[180px] truncate" style={{ color: "var(--ink-400)" }}>{a.checkOutAddr}</p>}
                      </>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs font-medium" style={{ color: "var(--ink-600)" }}>
                    {a.checkOut ? formatDuration(a.checkIn, a.checkOut) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={a.checkOut
                        ? { color: "var(--accent-600)", background: "var(--accent-100)" }
                        : { color: "var(--warn-600)", background: "var(--warn-100)" }
                      }
                    >
                      {a.checkOut ? "Completo" : "En campo"}
                    </span>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm" style={{ color: "var(--ink-400)" }}>
                    Sin registros para los filtros seleccionados
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
              {rangeStart}–{rangeEnd} de {total} registros
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
