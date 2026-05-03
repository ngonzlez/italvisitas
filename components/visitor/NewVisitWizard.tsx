"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Camera, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PLACE_TYPE_LABEL, STOCK_CONFIG, cn } from "@/lib/utils";
import type { Place, Doctor } from "@/app/generated/prisma/client";

const OBJECTIVES = [
  "Presentación de nueva línea de antibióticos",
  "Seguimiento de pedido anterior",
  "Capacitación sobre vacunas",
  "Reposición de muestras",
  "Recordatorio de portafolio",
  "Lanzamiento línea dermatológica",
  "Consulta sobre condiciones de venta",
];

type DoctorWithPlace = Doctor & { place: Place };

export default function NewVisitWizard({ places, doctors }: { places: Place[]; doctors: DoctorWithPlace[] }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [placeId, setPlaceId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [objective, setObjective] = useState("");
  const [finding, setFinding] = useState("");
  const [stock, setStock] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  const selectedPlace = places.find(p => p.id === placeId);
  const placeDoctors = doctors.filter(d => d.placeId === placeId);

  async function captureGPS() {
    setGpsLoading(true);
    navigator.geolocation?.getCurrentPosition(
      (pos) => { setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGpsLoading(false); },
      () => setGpsLoading(false),
      { timeout: 5000 }
    );
  }

  async function submit() {
    setLoading(true);
    try {
      const res = await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId, doctorId: doctorId || null, objective, finding, stock, photoUrl: photoUrl || null, gpsLat: gps?.lat, gpsLng: gps?.lng }),
      });
      if (res.ok) router.replace("/visits");
    } finally {
      setLoading(false);
    }
  }

  const steps = ["Lugar", "Detalles", "Evidencia"];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Link href="/visits">
          <ArrowLeft className="w-5 h-5" style={{ color: "var(--brand-700)" }} />
        </Link>
        <div>
          <h1 className="text-base font-bold" style={{ color: "var(--ink-900)" }}>Nueva visita</h1>
          <p className="text-xs" style={{ color: "var(--ink-500)" }}>Paso {step} de 3 — {steps[step - 1]}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5 mb-6">
        {steps.map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all"
            style={{ background: i < step ? "var(--brand-700)" : "var(--ink-200)" }}
          />
        ))}
      </div>

      {/* Step 1 — Place */}
      {step === 1 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold" style={{ color: "var(--ink-700)" }}>Seleccioná el lugar de visita</p>
          {places.map((p) => (
            <button
              key={p.id}
              onClick={() => { setPlaceId(p.id); setDoctorId(""); }}
              className={cn(
                "w-full text-left rounded-[var(--r-xl)] border p-4 transition-all",
                placeId === p.id
                  ? "border-[var(--brand-700)] bg-[var(--brand-50)] shadow-[var(--shadow-sm)]"
                  : "border-[var(--ink-100)] bg-[var(--ink-white)] hover:border-[var(--brand-300)]"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--ink-900)" }}>{p.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--ink-500)" }}>{p.address}</p>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0" style={{ background: "var(--brand-100)", color: "var(--brand-700)" }}>
                  {PLACE_TYPE_LABEL[p.type]}
                </span>
              </div>
            </button>
          ))}

          {placeId && placeDoctors.length > 0 && (
            <div className="mt-1">
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--ink-600)" }}>Médico (opcional)</p>
              {placeDoctors.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDoctorId(doctorId === d.id ? "" : d.id)}
                  className={cn(
                    "w-full text-left rounded-[var(--r-md)] border p-3 mb-2 transition-all text-sm",
                    doctorId === d.id
                      ? "border-[var(--brand-700)] bg-[var(--brand-50)]"
                      : "border-[var(--ink-100)] bg-[var(--ink-white)]"
                  )}
                >
                  <span className="font-medium" style={{ color: "var(--ink-900)" }}>{d.name}</span>
                  <span className="ml-2 text-xs" style={{ color: "var(--ink-500)" }}>{d.specialty}</span>
                </button>
              ))}
            </div>
          )}

          <Button className="w-full mt-2" disabled={!placeId} onClick={() => setStep(2)}>
            Continuar <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Step 2 — Details */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold" style={{ color: "var(--ink-700)" }}>
            Visita a: <span style={{ color: "var(--brand-700)" }}>{selectedPlace?.name}</span>
          </p>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--ink-600)" }}>Objetivo</p>
            <div className="flex flex-col gap-2">
              {OBJECTIVES.map((obj) => (
                <button
                  key={obj}
                  onClick={() => setObjective(obj)}
                  className={cn(
                    "text-left text-sm px-3.5 py-2.5 rounded-[var(--r-md)] border transition-all",
                    objective === obj
                      ? "border-[var(--brand-700)] bg-[var(--brand-50)] text-[var(--brand-800)]"
                      : "border-[var(--ink-100)] bg-[var(--ink-white)] text-[var(--ink-700)]"
                  )}
                >
                  {obj}
                </button>
              ))}
            </div>
          </div>

          <Textarea label="Hallazgo / observaciones" placeholder="¿Qué resultado tuvo la visita?" value={finding} onChange={(e) => setFinding(e.target.value)} rows={3} />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--ink-600)" }}>Estado de stock</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(STOCK_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setStock(key)}
                  className={cn(
                    "px-3 py-2.5 rounded-[var(--r-md)] border text-sm font-semibold transition-all",
                    stock === key ? "border-transparent" : "border-[var(--ink-100)] bg-[var(--ink-white)]"
                  )}
                  style={stock === key ? { color: cfg.color, background: cfg.bg, borderColor: cfg.color } : { color: cfg.color }}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">
              <ArrowLeft className="w-4 h-4" /> Atrás
            </Button>
            <Button disabled={!objective || !finding || !stock} onClick={() => setStep(3)} className="flex-1">
              Continuar <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3 — Evidence */}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold" style={{ color: "var(--ink-700)" }}>Evidencia (opcional)</p>

          <button
            onClick={captureGPS}
            disabled={gpsLoading || !!gps}
            className={cn(
              "flex items-center gap-3 p-4 rounded-[var(--r-xl)] border transition-all",
              gps ? "border-[var(--accent-500)] bg-[var(--accent-100)]" : "border-[var(--ink-200)] bg-[var(--ink-white)] hover:border-[var(--brand-300)]"
            )}
          >
            <MapPin className="w-5 h-5 shrink-0" style={{ color: gps ? "var(--accent-600)" : "var(--ink-400)" }} />
            <div className="text-left">
              <p className="text-sm font-semibold" style={{ color: "var(--ink-900)" }}>
                {gps ? "Ubicación capturada" : gpsLoading ? "Obteniendo ubicación..." : "Capturar ubicación GPS"}
              </p>
              {gps && (
                <p className="text-xs" style={{ color: "var(--accent-600)" }}>
                  {gps.lat.toFixed(4)}, {gps.lng.toFixed(4)}
                </p>
              )}
            </div>
          </button>

          <div className="flex gap-2 mt-2">
            <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">
              <ArrowLeft className="w-4 h-4" /> Atrás
            </Button>
            <Button loading={loading} onClick={submit} className="flex-1">
              <CheckCircle className="w-4 h-4" /> Guardar visita
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
