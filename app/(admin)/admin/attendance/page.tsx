import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { formatDate, formatTime, formatDuration } from "@/lib/utils";
import { MapPin, Clock } from "lucide-react";

export default async function AdminAttendancePage() {
  const records = await prisma.attendance.findMany({
    include: { visitor: true },
    orderBy: { checkIn: "desc" },
    take: 100,
  });

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: "var(--ink-900)" }}>Asistencia</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--ink-500)" }}>{records.length} registros</p>
      </div>

      <Card className="overflow-hidden">
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
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: "var(--brand-600)" }}>
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
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
