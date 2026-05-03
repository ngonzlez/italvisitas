import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { PlaceTypeBadge } from "@/components/ui/badge";

export default async function AdminPlacesPage() {
  const places = await prisma.place.findMany({
    include: { _count: { select: { visits: true, doctors: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: "var(--ink-900)" }}>Lugares</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--ink-500)" }}>{places.length} lugares registrados</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {places.map((p) => (
          <Card key={p.id} className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="font-semibold text-sm" style={{ color: "var(--ink-900)" }}>{p.name}</p>
              <PlaceTypeBadge type={p.type} />
            </div>
            <p className="text-xs mb-3" style={{ color: "var(--ink-500)" }}>{p.address}</p>
            <div className="flex gap-4 text-center">
              <div>
                <p className="text-base font-extrabold" style={{ color: "var(--brand-700)" }}>{p._count.visits}</p>
                <p className="text-[10px]" style={{ color: "var(--ink-500)" }}>Visitas</p>
              </div>
              <div>
                <p className="text-base font-extrabold" style={{ color: "var(--accent-600)" }}>{p._count.doctors}</p>
                <p className="text-[10px]" style={{ color: "var(--ink-500)" }}>Médicos</p>
              </div>
              <div>
                <p className="text-base font-bold" style={{ color: "var(--ink-600)" }}>{p.zone}</p>
                <p className="text-[10px]" style={{ color: "var(--ink-500)" }}>Zona</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
