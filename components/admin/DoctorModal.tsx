"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PLACE_TYPE_LABEL } from "@/lib/utils";

type Place = { id: string; name: string; type: string };
type Specialty = { id: string; name: string };
export type DoctorForModal = {
  id: string;
  name: string;
  specialtyId: string;
  places: { id: string }[];
};

interface Props {
  doctor?: DoctorForModal;
  places: Place[];
  specialties: Specialty[];
  onClose: () => void;
}

export default function DoctorModal({ doctor, places, specialties, onClose }: Props) {
  const router = useRouter();
  const [name, setName] = useState(doctor?.name ?? "");
  const [specialtyId, setSpecialtyId] = useState(doctor?.specialtyId ?? "");
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>(
    doctor?.places.map((p) => p.id) ?? []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  function togglePlace(id: string) {
    setSelectedPlaceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !specialtyId || !selectedPlaceIds.length) {
      setError("Todos los campos son requeridos");
      return;
    }
    setLoading(true);
    const res = await fetch(
      doctor ? `/api/doctors/${doctor.id}` : "/api/doctors",
      {
        method: doctor ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), specialtyId, placeIds: selectedPlaceIds }),
      }
    );
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Error al guardar");
      return;
    }
    router.refresh();
    onClose();
  }

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/doctors/${doctor!.id}`, { method: "DELETE" });
    router.refresh();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(12,21,36,0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[var(--r-lg)] shadow-[var(--shadow-lg)] p-6"
        style={{ background: "var(--ink-white)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold" style={{ color: "var(--ink-900)" }}>
            {doctor ? "Editar médico" : "Nuevo médico"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[var(--r-sm)] hover:bg-[var(--ink-100)] transition"
            style={{ color: "var(--ink-500)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dr. Juan Pérez"
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-600)]">
              Especialidad
            </label>
            <select
              value={specialtyId}
              onChange={(e) => setSpecialtyId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-[var(--r-md)] border border-[var(--ink-200)] bg-[var(--ink-white)] text-[var(--ink-900)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent transition"
            >
              <option value="">Seleccionar especialidad...</option>
              {specialties.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-600)]">
              Consultorios / Lugares
            </label>
            <div
              className="rounded-[var(--r-md)] border border-[var(--ink-200)] divide-y divide-[var(--ink-100)] max-h-44 overflow-y-auto"
              style={{ background: "var(--ink-white)" }}
            >
              {places.map((p) => (
                <label
                  key={p.id}
                  className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-[var(--ink-50)] transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedPlaceIds.includes(p.id)}
                    onChange={() => togglePlace(p.id)}
                    className="accent-[var(--brand-600)] w-3.5 h-3.5"
                  />
                  <span className="text-sm" style={{ color: "var(--ink-800)" }}>{p.name}</span>
                  <span className="text-xs ml-auto" style={{ color: "var(--ink-400)" }}>
                    {PLACE_TYPE_LABEL[p.type] ?? p.type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-[var(--danger-600)]">{error}</p>}

          <div className="flex gap-2 mt-1">
            {doctor && (
              confirmDelete ? (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  loading={loading}
                  onClick={handleDelete}
                  className="mr-auto"
                >
                  Confirmar eliminar
                </Button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="mr-auto text-xs font-semibold px-3 py-2 rounded-[var(--r-sm)] hover:bg-[var(--ink-100)] transition text-[var(--danger-600)]"
                >
                  Eliminar
                </button>
              )
            )}
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" loading={loading}>
              {doctor ? "Guardar" : "Crear"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
