import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";

export default async function AdminVisitorsPage() {
  const visitors = await prisma.user.findMany({
    where: { role: "VISITOR" },
    include: { _count: { select: { visits: true, attendance: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: "var(--ink-900)" }}>Visitadores</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--ink-500)" }}>{visitors.length} visitadores</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visitors.map((v) => (
          <Card key={v.id} className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ background: "var(--brand-600)" }}>
                {v.initials}
              </div>
              <div>
                <p className="font-semibold" style={{ color: "var(--ink-900)" }}>{v.name}</p>
                <p className="text-xs" style={{ color: "var(--ink-500)" }}>{v.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-[var(--r-md)] p-2" style={{ background: "var(--ink-50)" }}>
                <p className="text-xl font-extrabold" style={{ color: "var(--brand-700)" }}>{v._count.visits}</p>
                <p className="text-[10px] font-semibold" style={{ color: "var(--ink-500)" }}>Visitas</p>
              </div>
              <div className="rounded-[var(--r-md)] p-2" style={{ background: "var(--ink-50)" }}>
                <p className="text-xl font-extrabold" style={{ color: "var(--accent-600)" }}>{v._count.attendance}</p>
                <p className="text-[10px] font-semibold" style={{ color: "var(--ink-500)" }}>Días activos</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
