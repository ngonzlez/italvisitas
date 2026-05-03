import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StockBadge } from "@/components/ui/badge";
import { formatTimeAgo, formatDate, sameDay, PLACE_TYPE_LABEL } from "@/lib/utils";
import AttendanceToggle from "@/components/visitor/AttendanceToggle";

export default async function VisitorHomePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [visits, attendance, todayCount] = await Promise.all([
    prisma.visit.findMany({
      where: { visitorId: session.id },
      include: { place: { include: { zone: true } }, doctor: true },
      orderBy: { date: "desc" },
      take: 20,
    }),
    prisma.attendance.findFirst({
      where: { visitorId: session.id, checkIn: { gte: today } },
      orderBy: { checkIn: "desc" },
    }),
    prisma.visit.count({
      where: { visitorId: session.id, date: { gte: today } },
    }),
  ]);

  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  const weekCount = visits.filter(v => new Date(v.date) >= weekAgo).length;

  return (
    <div className="px-4 pt-4 pb-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold" style={{ color: "var(--ink-900)" }}>
            Buenos días, {session.name.split(" ")[0]}
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--ink-500)" }}>
            {formatDate(new Date(), { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <Link
          href="/visits/new"
          className="flex items-center gap-1.5 px-3 py-2 rounded-[var(--r-md)] text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:opacity-90"
          style={{ background: "var(--brand-700)" }}
        >
          <Plus className="w-4 h-4" />
          Nueva
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: "Hoy", value: todayCount, sub: "visitas" },
          { label: "Esta semana", value: weekCount, sub: "visitas" },
        ].map(({ label, value, sub }) => (
          <Card key={label} className="p-4 text-center">
            <div className="text-2xl font-extrabold" style={{ color: "var(--brand-700)" }}>{value}</div>
            <div className="text-xs font-semibold mt-0.5" style={{ color: "var(--ink-600)" }}>{label}</div>
            <div className="text-[10px]" style={{ color: "var(--ink-400)" }}>{sub}</div>
          </Card>
        ))}
      </div>

      {/* Attendance toggle */}
      <AttendanceToggle attendance={attendance} />

      {/* Visits list */}
      <h2 className="text-sm font-bold mb-3 mt-4" style={{ color: "var(--ink-700)" }}>Visitas recientes</h2>
      {visits.length === 0 && (
        <p className="text-sm text-center py-8" style={{ color: "var(--ink-400)" }}>Sin visitas registradas</p>
      )}
      <div className="flex flex-col gap-2.5">
        {visits.map((v) => (
          <Link key={v.id} href={`/visits/${v.id}`}>
            <Card className="p-4 hover:shadow-[var(--shadow-md)] transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--ink-900)" }}>
                    {v.place.name}
                  </p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "var(--ink-500)" }}>
                    {PLACE_TYPE_LABEL[v.place.type]} · {v.place.zone.name}
                  </p>
                  {v.doctor && (
                    <p className="text-xs mt-0.5 truncate" style={{ color: "var(--ink-500)" }}>
                      {v.doctor.name}
                    </p>
                  )}
                  <p className="text-xs mt-1.5 line-clamp-1" style={{ color: "var(--ink-600)" }}>
                    {v.objective}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[10px]" style={{ color: "var(--ink-400)" }}>{formatTimeAgo(v.date)}</span>
                  <StockBadge stock={v.stock} />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
