"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PLACE_TYPE_LABEL } from "@/lib/utils";

type Place = { id: string; name: string; type: string };
export type DoctorForModal = { id: string; name: string; specialty: string; placeId: string };

interface Props {
  doctor?: DoctorForModal;
  places: Place[];
  onClose: () => void;
}

export default function DoctorModal({ doctor, places, onClose }: Props) {
  const router = useRouter();
  const [name, setName] = useState(doctor?.name ?? "");
  const [specialty, setSpecialty] = useState(doctor?.specialty ?? "");
  const [placeId, setPlaceId] = useState(doctor?.placeId ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !specialty.trim() || !placeId) {
      setError("Todos los campos son requeridos");
      return;
    }
    setLoading(true);
    const res = await fetch(
      doctor ? `/api/doctors/${doctor.id}` : "/api/doctors",
      {
        method: doctor ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), specialty: specialty.trim(), placeId }),
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
          <Input
            label="Especialidad"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder="Cardiología"
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-600)]">
              Lugar
            </label>
            <select
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-[var(--r-md)] border border-[var(--ink-200)] bg-[var(--ink-white)] text-[var(--ink-900)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent transition"
            >
              <option value="">Seleccionar lugar...</option>
              {places.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {PLACE_TYPE_LABEL[p.type] ?? p.type}
                </option>
              ))}
            </select>
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
