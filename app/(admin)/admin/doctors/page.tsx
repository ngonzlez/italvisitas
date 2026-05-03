import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { PLACE_TYPE_LABEL } from "@/lib/utils";

export default async function AdminDoctorsPage() {
  const doctors = await prisma.doctor.findMany({
    include: { place: true, _count: { select: { visits: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: "var(--ink-900)" }}>Médicos</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--ink-500)" }}>{doctors.length} médicos</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {doctors.map((d) => (
          <Card key={d.id} className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-semibold text-sm" style={{ color: "var(--ink-900)" }}>{d.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--brand-600)" }}>{d.specialty}</p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: "var(--ink-100)", color: "var(--ink-600)" }}>
                {d._count.visits} visitas
              </span>
            </div>
            <div className="text-xs" style={{ color: "var(--ink-500)" }}>
              <span>{d.place.name}</span>
              <span className="mx-1.5">·</span>
              <span>{PLACE_TYPE_LABEL[d.place.type]}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
