"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DoctorModal, { type DoctorForModal } from "@/components/admin/DoctorModal";
import { PLACE_TYPE_LABEL } from "@/lib/utils";

type Place = { id: string; name: string; type: string };
type Doctor = DoctorForModal & {
  place: Place;
  _count: { visits: number };
};

interface Props {
  doctors: Doctor[];
  places: Place[];
}

export default function DoctorsClient({ doctors, places }: Props) {
  const [modal, setModal] = useState<"create" | Doctor | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--ink-900)" }}>Médicos</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--ink-500)" }}>{doctors.length} médicos</p>
        </div>
        <Button size="sm" onClick={() => setModal("create")}>
          <Plus className="w-4 h-4" />
          Nuevo médico
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {doctors.map((d) => (
          <Card key={d.id} className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: "var(--ink-900)" }}>{d.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--brand-600)" }}>{d.specialty}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "var(--ink-100)", color: "var(--ink-600)" }}
                >
                  {d._count.visits} visitas
                </span>
                <Link
                  href={`/admin/doctors/${d.id}`}
                  className="p-1.5 rounded-[var(--r-sm)] hover:bg-[var(--ink-100)] transition"
                  style={{ color: "var(--brand-500)" }}
                  title="Ver detalle"
                >
                  <Eye className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => setModal(d)}
                  className="p-1.5 rounded-[var(--r-sm)] hover:bg-[var(--ink-100)] transition"
                  style={{ color: "var(--ink-500)" }}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="text-xs" style={{ color: "var(--ink-500)" }}>
              <span>{d.place.name}</span>
              <span className="mx-1.5">·</span>
              <span>{PLACE_TYPE_LABEL[d.place.type] ?? d.place.type}</span>
            </div>
          </Card>
        ))}
        {doctors.length === 0 && (
          <div className="col-span-full text-center py-12 text-sm" style={{ color: "var(--ink-400)" }}>
            No hay médicos registrados
          </div>
        )}
      </div>

      {modal !== null && (
        <DoctorModal
          doctor={modal === "create" ? undefined : modal}
          places={places}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
