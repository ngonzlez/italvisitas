import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { PlaceTypeBadge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/utils";
import { MapPin, Stethoscope } from "lucide-react";

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: {
      specialty: true,
      places: true,
      visits: {
        include: { visitor: true, place: true },
        orderBy: { date: "desc" },
        take: 100,
      },
      _count: { select: { visits: true } },
    },
  });

  if (!doctor) notFound();

  return (
    <div>
      <Link
        href="/admin/doctors"
        className="inline-flex items-center gap-1.5 text-xs mb-4 hover:underline"
        style={{ color: "var(--ink-500)" }}
      >
        ← Médicos
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "var(--brand-100)" }}
            >
              <Stethoscope className="w-4 h-4" style={{ color: "var(--brand-600)" }} />
            </div>
            <h1 className="text-xl font-bold" style={{ color: "var(--ink-900)" }}>{doctor.name}</h1>
          </div>
          <p className="text-sm ml-11" style={{ color: "var(--brand-600)" }}>{doctor.specialty.name}</p>
        </div>
        <span
          className="text-xs font-bold px-3 py-1.5 rounded-full shrink-0"
          style={{ background: "var(--ink-100)", color: "var(--ink-700)" }}
        >
          {doctor._count.visits} visitas
        </span>
      </div>

      {/* Places */}
      {doctor.places.length > 0 && (
        <Card className="p-4 mb-4">
          <p className="text-xs font-semibold mb-2.5" style={{ color: "var(--ink-500)" }}>
            CONSULTORIOS ({doctor.places.length})
          </p>
          <div className="flex flex-col gap-2">
            {doctor.places.map((pl) => (
              <div key={pl.id} className="flex items-center gap-2 text-sm">
                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--ink-400)" }} />
                <span className="font-medium" style={{ color: "var(--ink-800)" }}>{pl.name}</span>
                <span style={{ color: "var(--ink-300)" }}>·</span>
                <PlaceTypeBadge type={pl.type as "FARMACIA" | "HOSPITAL" | "CLINICA" | "MEDICO"} />
                <span className="text-xs" style={{ color: "var(--ink-400)" }}>{pl.address}</span>
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
                {["Visitador", "Lugar", "Fecha", "Hora"].map(h => (
                  <th key={h} className="text-left px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {doctor.visits.map((v, i) => (
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
                    {v.place.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--ink-700)" }}>
                    {formatDate(v.date)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: "var(--ink-500)" }}>
                    {formatTime(v.date)}
                  </td>
                </tr>
              ))}
              {doctor.visits.length === 0 && (
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
