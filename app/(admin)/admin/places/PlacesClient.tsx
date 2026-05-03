"use client";
import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceTypeBadge } from "@/components/ui/badge";
import PlaceModal, { type PlaceForModal } from "@/components/admin/PlaceModal";

type Place = PlaceForModal & {
  _count: { visits: number; doctors: number };
};

interface Props {
  places: Place[];
}

export default function PlacesClient({ places }: Props) {
  const [modal, setModal] = useState<"create" | Place | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--ink-900)" }}>Lugares</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--ink-500)" }}>{places.length} lugares registrados</p>
        </div>
        <Button size="sm" onClick={() => setModal("create")}>
          <Plus className="w-4 h-4" />
          Nuevo lugar
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {places.map((p) => (
          <Card key={p.id} className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="font-semibold text-sm" style={{ color: "var(--ink-900)" }}>{p.name}</p>
              <div className="flex items-center gap-1 shrink-0">
                <PlaceTypeBadge type={p.type as "FARMACIA" | "HOSPITAL" | "CLINICA" | "MEDICO"} />
                <button
                  onClick={() => setModal(p)}
                  className="p-1.5 rounded-[var(--r-sm)] hover:bg-[var(--ink-100)] transition"
                  style={{ color: "var(--ink-500)" }}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-xs mb-3 truncate" style={{ color: "var(--ink-500)" }}>{p.address}</p>
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
        {places.length === 0 && (
          <div className="col-span-full text-center py-12 text-sm" style={{ color: "var(--ink-400)" }}>
            No hay lugares registrados
          </div>
        )}
      </div>

      {modal !== null && (
        <PlaceModal
          place={modal === "create" ? undefined : modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
