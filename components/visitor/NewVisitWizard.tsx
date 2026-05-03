"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, MapPin, CheckCircle, Search, X as XIcon,
  Check, Plus, Building2, Home, UserRound, Pill,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { PLACE_TYPE_LABEL, STOCK_CONFIG, cn } from "@/lib/utils";
import PlaceModal from "@/components/admin/PlaceModal";
import DoctorModal from "@/components/admin/DoctorModal";
type PlaceWithZone = { id: string; type: string; name: string; address: string; zoneId: string; zone: { name: string } };
type DoctorWithPlaces = { id: string; name: string; specialtyId: string; specialty: { name: string }; places: PlaceWithZone[] };
type PlaceType = "FARMACIA" | "HOSPITAL" | "CLINICA" | "MEDICO";

const OBJECTIVES = [
  "Presentación de nueva línea de antibióticos",
  "Seguimiento de pedido anterior",
  "Capacitación sobre vacunas",
  "Reposición de muestras",
  "Recordatorio de portafolio",
  "Lanzamiento línea dermatológica",
  "Consulta sobre condiciones de venta",
];

const PLACE_TYPE_CONFIG: { key: PlaceType; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { key: "FARMACIA", label: "Farmacia", Icon: ({ className }) => <Pill className={className} /> },
  { key: "HOSPITAL", label: "Hospital", Icon: ({ className }) => <Building2 className={className} /> },
  { key: "CLINICA",  label: "Clínica",  Icon: ({ className }) => <Home className={className} /> },
  { key: "MEDICO",   label: "Médico",   Icon: ({ className }) => <UserRound className={className} /> },
];

function initials(name: string) {
  return name.split(" ").filter((w) => !w.endsWith(".")).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function NewVisitWizard({
  places,
  doctors,
  specialties,
  zones,
}: {
  places: PlaceWithZone[];
  doctors: DoctorWithPlaces[];
  specialties: { id: string; name: string }[];
  zones: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [placeType, setPlaceType] = useState<PlaceType>("FARMACIA");
  const [search, setSearch] = useState("");
  const [placeId, setPlaceId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [showNewPlace, setShowNewPlace] = useState(false);
  const [showNewDoctor, setShowNewDoctor] = useState(false);

  // Step 2-3
  const [objective, setObjective] = useState("");
  const [finding, setFinding] = useState("");
  const [stock, setStock] = useState("");
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  const selectedPlace = places.find((p) => p.id === placeId);

  // Places filtered by type + search
  const filteredPlaces = useMemo(() => {
    const byType = places.filter((p) => p.type === placeType);
    if (!search.trim()) return byType;
    const q = search.toLowerCase();
    return byType.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.zone.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
    );
  }, [places, placeType, search]);

  // Doctors filtered by search (when type=MEDICO all doctors; else doctors at selected place)
  const filteredDoctors = useMemo(() => {
    if (placeType !== "MEDICO") {
      return placeId ? doctors.filter((d) => d.places.some((p) => p.id === placeId)) : [];
    }
    if (!search.trim()) return doctors;
    const q = search.toLowerCase();
    return doctors.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.specialty.name.toLowerCase().includes(q) ||
        d.places.some((p) => p.name.toLowerCase().includes(q))
    );
  }, [doctors, placeType, placeId, search]);

  function selectPlaceType(type: PlaceType) {
    setPlaceType(type);
    setPlaceId("");
    setDoctorId("");
    setSearch("");
  }

  function selectPlace(id: string) {
    setPlaceId(id);
    setDoctorId("");
  }

  function selectDoctor(doc: DoctorWithPlaces) {
    if (placeType === "MEDICO") {
      setDoctorId(doc.id);
      setPlaceId(doc.places.length === 1 ? doc.places[0].id : "");
    } else {
      setDoctorId(doctorId === doc.id ? "" : doc.id);
    }
  }

  const canContinue =
    placeType === "MEDICO" ? !!doctorId && !!placeId : !!placeId;

  async function captureGPS() {
    setGpsLoading(true);
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsLoading(false);
      },
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
        body: JSON.stringify({
          placeId,
          doctorId: doctorId || null,
          objective,
          finding,
          stock,
          photoUrl: null,
          gpsLat: gps?.lat,
          gpsLng: gps?.lng,
        }),
      });
      if (res.ok) router.replace("/visits");
    } finally {
      setLoading(false);
    }
  }

  const steps = ["Lugar", "Detalles", "Evidencia"];

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 pt-4 pb-3"
        style={{ background: "var(--ink-50)" }}
      >
        <div className="flex items-center gap-3">
          {step === 1 ? (
            <Link href="/visits">
              <ArrowLeft className="w-5 h-5" style={{ color: "var(--brand-700)" }} />
            </Link>
          ) : (
            <button onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft className="w-5 h-5" style={{ color: "var(--brand-700)" }} />
            </button>
          )}
          <div>
            <h1 className="text-base font-bold" style={{ color: "var(--ink-900)" }}>
              Nueva visita
            </h1>
            <p className="text-xs" style={{ color: "var(--ink-500)" }}>
              Paso {step} de 3
            </p>
          </div>
        </div>
        <Link href="/visits" className="text-sm" style={{ color: "var(--ink-500)" }}>
          Cancelar
        </Link>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5 px-4 mb-4">
        {steps.map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all"
            style={{ background: i < step ? "var(--brand-700)" : "var(--ink-200)" }}
          />
        ))}
      </div>

      {/* ── Step 1 ── */}
      {step === 1 && (
        <div className="px-4 flex flex-col gap-4 pb-6">
          {/* Type grid */}
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--ink-500)" }}
            >
              Tipo de lugar
            </p>
            <div className="grid grid-cols-2 gap-2">
              {PLACE_TYPE_CONFIG.map(({ key, label, Icon }) => {
                const active = placeType === key;
                return (
                  <button
                    key={key}
                    onClick={() => selectPlaceType(key)}
                    className="flex flex-col items-center gap-2 py-4 rounded-[var(--r-xl)] border-2 transition-all"
                    style={{
                      border: `1.5px solid ${active ? "var(--brand-600)" : "var(--ink-200)"}`,
                      background: active ? "var(--brand-50)" : "var(--ink-white)",
                      color: active ? "var(--brand-800)" : "var(--ink-600)",
                    }}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs font-semibold">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search + list */}
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--ink-500)" }}
            >
              Seleccionar {PLACE_TYPE_LABEL[placeType].toLowerCase()}
            </p>

            {/* Pill search input */}
            <div
              className="flex items-center gap-2 rounded-full border px-4 mb-3 transition-all focus-within:ring-2 focus-within:ring-[var(--brand-300)]"
              style={{ background: "var(--ink-white)", borderColor: "var(--ink-200)" }}
            >
              <Search className="w-4 h-4 shrink-0" style={{ color: "var(--ink-400)" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre o zona..."
                className="flex-1 py-3 text-sm bg-transparent outline-none"
                style={{ color: "var(--ink-900)" }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "var(--ink-100)", color: "var(--ink-600)" }}
                >
                  <XIcon className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Doctor list (type=MEDICO) */}
            {placeType === "MEDICO" ? (
              <>
              <div className="flex flex-col gap-1.5">
                {filteredDoctors.map((d) => {
                  const active = doctorId === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => selectDoctor(d)}
                      className="flex items-center gap-3 p-3 rounded-[var(--r-xl)] border text-left transition-all"
                      style={{
                        borderColor: active ? "var(--brand-600)" : "var(--ink-100)",
                        background: active ? "var(--brand-50)" : "var(--ink-white)",
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: "var(--accent-100)", color: "var(--accent-700)" }}
                      >
                        {initials(d.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--ink-900)" }}>
                          {d.name}
                        </p>
                        <p className="text-[11px]" style={{ color: "var(--ink-500)" }}>
                          {d.specialty.name}{d.places.length > 0 && ` · ${d.places.map(p => p.name).join(", ")}`}
                        </p>
                      </div>
                      {active && <Check className="w-4 h-4 shrink-0" style={{ color: "var(--brand-600)" }} />}
                    </button>
                  );
                })}
                {filteredDoctors.length === 0 && (
                  <p className="text-sm text-center py-4" style={{ color: "var(--ink-400)" }}>
                    No se encontraron médicos
                  </p>
                )}
                {/* Registrar nuevo médico */}
                <button
                  onClick={() => setShowNewDoctor(true)}
                  className="flex items-center justify-center gap-2 py-3 rounded-[var(--r-xl)] mt-1 transition-all"
                  style={{
                    border: "1.5px dashed var(--ink-300)",
                    color: "var(--brand-700)",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  <Plus className="w-4 h-4" /> Registrar nuevo médico
                </button>
              </div>
              {(() => {
                const doc = doctorId ? doctors.find((d) => d.id === doctorId) : null;
                if (!doc || doc.places.length <= 1) return null;
                return (
                  <div className="mt-3">
                    <p
                      className="text-[10px] font-bold uppercase tracking-wider mb-2"
                      style={{ color: "var(--ink-500)" }}
                    >
                      ¿En cuál consultorio?
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {doc.places.map((pl) => {
                        const active = placeId === pl.id;
                        return (
                          <button
                            key={pl.id}
                            onClick={() => setPlaceId(pl.id)}
                            className="flex items-center gap-3 p-3 rounded-[var(--r-xl)] border text-left transition-all"
                            style={{
                              borderColor: active ? "var(--brand-600)" : "var(--ink-100)",
                              background: active ? "var(--brand-50)" : "var(--ink-white)",
                            }}
                          >
                            <MapPin
                              className="w-4 h-4 shrink-0"
                              style={{ color: active ? "var(--brand-600)" : "var(--ink-400)" }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate" style={{ color: "var(--ink-900)" }}>
                                {pl.name}
                              </p>
                              <p className="text-[11px]" style={{ color: "var(--ink-500)" }}>
                                {pl.address} · {pl.zone.name}
                              </p>
                            </div>
                            {active && <Check className="w-4 h-4 shrink-0" style={{ color: "var(--brand-600)" }} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
              </>
            ) : (
              /* Place list */
              <div className="flex flex-col gap-1.5">
                {filteredPlaces.map((p) => {
                  const active = placeId === p.id;
                  const TypeIcon = PLACE_TYPE_CONFIG.find((c) => c.key === p.type)?.Icon;
                  return (
                    <button
                      key={p.id}
                      onClick={() => selectPlace(p.id)}
                      className="flex items-center gap-3 p-3 rounded-[var(--r-xl)] border text-left transition-all"
                      style={{
                        borderColor: active ? "var(--brand-600)" : "var(--ink-100)",
                        background: active ? "var(--brand-50)" : "var(--ink-white)",
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-[var(--r-md)] flex items-center justify-center shrink-0"
                        style={{ background: "var(--ink-100)", color: "var(--ink-600)" }}
                      >
                        {TypeIcon && <TypeIcon className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--ink-900)" }}>
                          {p.name}
                        </p>
                        <p className="text-[11px]" style={{ color: "var(--ink-500)" }}>
                          {p.address} · {p.zone.name}
                        </p>
                      </div>
                      {active && <Check className="w-4 h-4 shrink-0" style={{ color: "var(--brand-600)" }} />}
                    </button>
                  );
                })}
                {filteredPlaces.length === 0 && (
                  <p className="text-sm text-center py-4" style={{ color: "var(--ink-400)" }}>
                    No se encontraron resultados
                  </p>
                )}
                {/* Registrar nuevo lugar */}
                <button
                  onClick={() => setShowNewPlace(true)}
                  className="flex items-center justify-center gap-2 py-3 rounded-[var(--r-xl)] mt-1 transition-all"
                  style={{
                    border: "1.5px dashed var(--ink-300)",
                    color: "var(--brand-700)",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  <Plus className="w-4 h-4" /> Registrar nuevo lugar
                </button>
              </div>
            )}
          </div>

          {/* Optional doctor selection (Hospital / Clínica) */}
          {(placeType === "HOSPITAL" || placeType === "CLINICA") &&
            placeId &&
            filteredDoctors.length > 0 && (
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-wider mb-2"
                  style={{ color: "var(--ink-500)" }}
                >
                  Médico (opcional)
                </p>
                <div className="flex flex-col gap-1.5">
                  {filteredDoctors.map((d) => {
                    const active = doctorId === d.id;
                    return (
                      <button
                        key={d.id}
                        onClick={() => selectDoctor(d)}
                        className="flex items-center gap-3 p-3 rounded-[var(--r-xl)] border text-left transition-all"
                        style={{
                          borderColor: active ? "var(--brand-600)" : "var(--ink-100)",
                          background: active ? "var(--brand-50)" : "var(--ink-white)",
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background: "var(--accent-100)", color: "var(--accent-700)" }}
                        >
                          {initials(d.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: "var(--ink-900)" }}>
                            {d.name}
                          </p>
                          <p className="text-[11px]" style={{ color: "var(--ink-500)" }}>
                            {d.specialty.name}
                          </p>
                        </div>
                        {active && <Check className="w-4 h-4 shrink-0" style={{ color: "var(--brand-600)" }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
        </div>
      )}

      {/* ── Step 2 ── */}
      {step === 2 && (
        <div className="px-4 flex flex-col gap-4 pb-6">
          <p className="text-sm font-semibold" style={{ color: "var(--ink-700)" }}>
            Visita a:{" "}
            <span style={{ color: "var(--brand-700)" }}>{selectedPlace?.name}</span>
          </p>

          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide mb-2"
              style={{ color: "var(--ink-600)" }}
            >
              Objetivo
            </p>
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

          <Textarea
            label="Hallazgo / observaciones"
            placeholder="¿Qué resultado tuvo la visita?"
            value={finding}
            onChange={(e) => setFinding(e.target.value)}
            rows={3}
          />

          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide mb-2"
              style={{ color: "var(--ink-600)" }}
            >
              Estado de stock
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(STOCK_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setStock(key)}
                  className={cn(
                    "px-3 py-2.5 rounded-[var(--r-md)] border text-sm font-semibold transition-all",
                    stock === key ? "border-transparent" : "border-[var(--ink-100)] bg-[var(--ink-white)]"
                  )}
                  style={
                    stock === key
                      ? { color: cfg.color, background: cfg.bg, borderColor: cfg.color }
                      : { color: cfg.color }
                  }
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3 ── */}
      {step === 3 && (
        <div className="px-4 flex flex-col gap-4 pb-6">
          <p className="text-sm font-semibold" style={{ color: "var(--ink-700)" }}>
            Evidencia (opcional)
          </p>

          <button
            onClick={captureGPS}
            disabled={gpsLoading || !!gps}
            className={cn(
              "flex items-center gap-3 p-4 rounded-[var(--r-xl)] border transition-all",
              gps
                ? "border-[var(--accent-500)] bg-[var(--accent-100)]"
                : "border-[var(--ink-200)] bg-[var(--ink-white)] hover:border-[var(--brand-300)]"
            )}
          >
            <MapPin
              className="w-5 h-5 shrink-0"
              style={{ color: gps ? "var(--accent-600)" : "var(--ink-400)" }}
            />
            <div className="text-left">
              <p className="text-sm font-semibold" style={{ color: "var(--ink-900)" }}>
                {gps
                  ? "Ubicación capturada"
                  : gpsLoading
                  ? "Obteniendo ubicación..."
                  : "Capturar ubicación GPS"}
              </p>
              {gps && (
                <p className="text-xs" style={{ color: "var(--accent-600)" }}>
                  {gps.lat.toFixed(4)}, {gps.lng.toFixed(4)}
                </p>
              )}
            </div>
          </button>
        </div>
      )}

      {/* ── Sticky bottom button ── */}
      <div
        className="sticky bottom-0 px-4 py-3"
        style={{
          background: "linear-gradient(to top, var(--ink-50) 70%, transparent)",
        }}
      >
        {step === 1 && (
          <Button
            className="w-full"
            disabled={!canContinue}
            onClick={() => setStep(2)}
          >
            Continuar <ArrowRight className="w-4 h-4" />
          </Button>
        )}
        {step === 2 && (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">
              <ArrowLeft className="w-4 h-4" /> Atrás
            </Button>
            <Button
              disabled={!objective || !finding || !stock}
              onClick={() => setStep(3)}
              className="flex-1"
            >
              Continuar <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
        {step === 3 && (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">
              <ArrowLeft className="w-4 h-4" /> Atrás
            </Button>
            <Button loading={loading} onClick={submit} className="flex-1">
              <CheckCircle className="w-4 h-4" /> Guardar
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showNewPlace && (
        <PlaceModal
          zones={zones}
          onClose={() => {
            setShowNewPlace(false);
            router.refresh();
          }}
        />
      )}
      {showNewDoctor && (
        <DoctorModal
          places={places}
          specialties={specialties}
          onClose={() => {
            setShowNewDoctor(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
