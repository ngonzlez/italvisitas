import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, User, Building2, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StockBadge, PlaceTypeBadge } from "@/components/ui/badge";
import { formatDate, formatTime, PLACE_TYPE_LABEL } from "@/lib/utils";

export default async function VisitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const visit = await prisma.visit.findFirst({
    where: { id, visitorId: session.id },
    include: { place: { include: { zone: true } }, doctor: { include: { specialty: true } } },
  });
  if (!visit) notFound();

  const fields = [
    { label: "Objetivo", value: visit.objective },
    { label: "Hallazgo", value: visit.finding },
  ];

  return (
    <div className="px-4 pt-4 pb-4">
      <Link href="/visits" className="flex items-center gap-1.5 text-sm mb-4" style={{ color: "var(--brand-700)" }}>
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>

      <div className="flex items-start justify-between mb-4 gap-3">
        <div>
          <h1 className="text-lg font-bold" style={{ color: "var(--ink-900)" }}>{visit.place.name}</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--ink-500)" }}>
            {PLACE_TYPE_LABEL[visit.place.type]} · {visit.place.zone.name}
          </p>
        </div>
        <StockBadge stock={visit.stock} />
      </div>

      <div className="flex flex-col gap-3">
        <Card className="p-4 flex flex-col gap-2.5">
          {[
            { icon: Calendar, text: `${formatDate(visit.date)} · ${formatTime(visit.date)}` },
            { icon: Building2, text: visit.place.address },
            ...(visit.doctor ? [{ icon: User, text: `${visit.doctor.name} — ${visit.doctor.specialty.name}` }] : []),
            ...(visit.gpsLat ? [{ icon: MapPin, text: `${visit.gpsLat.toFixed(4)}, ${visit.gpsLng?.toFixed(4)}` }] : []),
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-2">
              <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--brand-500)" }} />
              <span className="text-sm" style={{ color: "var(--ink-700)" }}>{text}</span>
            </div>
          ))}
        </Card>

        {fields.map(({ label, value }) => (
          <Card key={label} className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--ink-500)" }}>{label}</p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--ink-900)" }}>{value}</p>
          </Card>
        ))}

        {visit.photoUrl && (
          <Card className="overflow-hidden">
            <img src={visit.photoUrl} alt="Foto visita" className="w-full object-cover max-h-64" />
          </Card>
        )}
      </div>
    </div>
  );
}
