"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PLACE_TYPE_LABEL } from "@/lib/utils";

type Zone = { id: string; name: string };

export type PlaceForModal = {
  id: string;
  name: string;
  address: string;
  zoneId: string;
  type: string;
};

interface Props {
  place?: PlaceForModal;
  zones: Zone[];
  onClose: () => void;
}

const PLACE_TYPES = ["FARMACIA", "HOSPITAL", "CLINICA", "MEDICO"] as const;

export default function PlaceModal({ place, zones, onClose }: Props) {
  const router = useRouter();
  const [name, setName] = useState(place?.name ?? "");
  const [address, setAddress] = useState(place?.address ?? "");
  const [zoneId, setZoneId] = useState(place?.zoneId ?? "");
  const [type, setType] = useState(place?.type ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !address.trim() || !zoneId || !type) {
      setError("Todos los campos son requeridos");
      return;
    }
    setLoading(true);
    const res = await fetch(
      place ? `/api/places/${place.id}` : "/api/places",
      {
        method: place ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), address: address.trim(), zoneId, type }),
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
    const res = await fetch(`/api/places/${place!.id}`, { method: "DELETE" });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "No se puede eliminar este lugar");
      setConfirmDelete(false);
      return;
    }
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
            {place ? "Editar lugar" : "Nuevo lugar"}
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
            placeholder="Farmacia Central"
          />
          <Input
            label="Dirección"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Av. Mcal. López 1234"
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-600)]">
                Zona
              </label>
              <select
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-[var(--r-md)] border border-[var(--ink-200)] bg-[var(--ink-white)] text-[var(--ink-900)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent transition"
              >
                <option value="">Seleccionar zona...</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>{z.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-600)]">
                Tipo
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-[var(--r-md)] border border-[var(--ink-200)] bg-[var(--ink-white)] text-[var(--ink-900)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent transition"
              >
                <option value="">Seleccionar...</option>
                {PLACE_TYPES.map((t) => (
                  <option key={t} value={t}>{PLACE_TYPE_LABEL[t]}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="text-xs text-[var(--danger-600)]">{error}</p>}

          <div className="flex gap-2 mt-1">
            {place && (
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
              {place ? "Guardar" : "Crear"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
