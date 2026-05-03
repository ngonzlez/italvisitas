import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { PlaceTypeBadge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/utils";
import { MapPin } from "lucide-react";

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const place = await prisma.place.findUnique({
    where: { id },
    include: {
      visits: {
        include: { visitor: true, doctor: true },
        orderBy: { date: "desc" },
        take: 100,
      },
      doctors: { select: { id: true, name: true, specialty: true } },
      _count: { select: { visits: true, doctors: true } },
    },
  });

  if (!place) notFound();

  return (
    <div>
      <Link
        href="/admin/places"
        className="inline-flex items-center gap-1.5 text-xs mb-4 hover:underline"
        style={{ color: "var(--ink-500)" }}
      >
        ← Lugares
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold" style={{ color: "var(--ink-900)" }}>{place.name}</h1>
            <PlaceTypeBadge type={place.type as "FARMACIA" | "HOSPITAL" | "CLINICA" | "MEDICO"} />
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--ink-500)" }}>
            <MapPin className="w-3.5 h-3.5" />
            <span>{place.address}</span>
            <span style={{ color: "var(--ink-300)" }}>·</span>
            <span>{place.zone}</span>
          </div>
        </div>
        <span
          className="text-xs font-bold px-3 py-1.5 rounded-full shrink-0"
          style={{ background: "var(--ink-100)", color: "var(--ink-700)" }}
        >
          {place._count.visits} visitas
        </span>
      </div>

      {/* Doctors chips */}
      {place.doctors.length > 0 && (
        <Card className="p-4 mb-4">
          <p className="text-xs font-semibold mb-2.5" style={{ color: "var(--ink-500)" }}>
            MÉDICOS ({place._count.doctors})
          </p>
          <div className="flex flex-wrap gap-2">
            {place.doctors.map(d => (
              <div
                key={d.id}
                className="px-2.5 py-1 rounded-full text-xs font-medium border"
                style={{ borderColor: "var(--brand-200)", background: "var(--brand-50)", color: "var(--brand-700)" }}
              >
                {d.name}
                {d.specialty && <span className="ml-1 opacity-70">· {d.specialty}</span>}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Visits table */}
      <Card className="overflow-hidden">
        <div className="px-4 py-3 border-b" style={{ borderColor: "var(--ink-100)" }}>
          <p className="text-sm font-bold" style={{ color: "var(--ink-800)" }}>Historial de visitas</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="border-b text-xs font-semibold uppercase tracking-wide"
                style={{ borderColor: "var(--ink-100)", color: "var(--ink-500)" }}
              >
                {["Visitador", "Médico", "Fecha", "Hora"].map(h => (
                  <th key={h} className="text-left px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {place.visits.map((v, i) => (
                <tr
                  key={v.id}
                  className="border-b last:border-0 hover:bg-[var(--ink-50)] transition-colors"
                  style={{ borderColor: "var(--ink-100)", background: i % 2 === 0 ? "transparent" : "var(--ink-50)" }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                        style={{ background: "var(--brand-600)" }}
                      >
                        {v.visitor.initials}
                      </div>
                      <span style={{ color: "var(--ink-800)" }}>{v.visitor.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--ink-600)" }}>
                    {v.doctor?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--ink-700)" }}>
                    {formatDate(v.date)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: "var(--ink-500)" }}>
                    {formatTime(v.date)}
                  </td>
                </tr>
              ))}
              {place.visits.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm" style={{ color: "var(--ink-400)" }}>
                    Sin visitas registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
