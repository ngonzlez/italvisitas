import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { formatDate, formatTime, formatDuration } from "@/lib/utils";
import AttendanceToggle from "@/components/visitor/AttendanceToggle";
import { Clock, MapPin } from "lucide-react";

export default async function AttendancePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [todayRecord, history] = await Promise.all([
    prisma.attendance.findFirst({
      where: { visitorId: session.id, checkIn: { gte: today } },
      orderBy: { checkIn: "desc" },
    }),
    prisma.attendance.findMany({
      where: { visitorId: session.id, checkIn: { lt: today } },
      orderBy: { checkIn: "desc" },
      take: 30,
    }),
  ]);

  return (
    <div className="px-4 pt-4 pb-4">
      <h1 className="text-lg font-bold mb-1" style={{ color: "var(--ink-900)" }}>Asistencia</h1>
      <p className="text-xs mb-4" style={{ color: "var(--ink-500)" }}>Registrá tu entrada y salida diaria</p>

      <AttendanceToggle attendance={todayRecord} />

      <h2 className="text-sm font-bold mt-5 mb-3" style={{ color: "var(--ink-700)" }}>Historial</h2>
      {history.length === 0 && (
        <p className="text-sm text-center py-6" style={{ color: "var(--ink-400)" }}>Sin historial previo</p>
      )}
      <div className="flex flex-col gap-2.5">
        {history.map((a) => (
          <Card key={a.id} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--ink-900)" }}>
                  {formatDate(a.checkIn, { weekday: "short", day: "numeric", month: "short" })}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock className="w-3.5 h-3.5" style={{ color: "var(--brand-500)" }} />
                  <span className="text-xs" style={{ color: "var(--ink-600)" }}>
                    {formatTime(a.checkIn)} — {a.checkOut ? formatTime(a.checkOut) : "—"}
                    {a.checkOut && ` (${formatDuration(a.checkIn, a.checkOut)})`}
                  </span>
                </div>
                {a.checkInAddr && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--ink-400)" }} />
                    <span className="text-xs truncate" style={{ color: "var(--ink-500)" }}>{a.checkInAddr}</span>
                  </div>
                )}
              </div>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                style={a.checkOut
                  ? { color: "var(--accent-600)", background: "var(--accent-100)" }
                  : { color: "var(--warn-600)", background: "var(--warn-100)" }
                }
              >
                {a.checkOut ? "Completo" : "Sin salida"}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
