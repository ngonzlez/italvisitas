"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { PLACE_TYPE_LABEL } from "@/lib/utils";

const PLACE_TYPES = Object.entries(PLACE_TYPE_LABEL);

interface Props {
  visitors: { id: string; name: string }[];
  defaultFrom: string;
  defaultTo: string;
}

export default function VisitsFilter({ visitors, defaultFrom, defaultTo }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  function updateSelect(key: string, value: string) {
    const params = new URLSearchParams(sp.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function updateDate(key: string, value: string) {
    const params = new URLSearchParams(sp.toString());
    // always set, even empty — empty string = no date filter signal
    params.set(key, value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearDates() {
    const params = new URLSearchParams(sp.toString());
    params.set("from", "");
    params.delete("to");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  const fromValue = sp.get("from") ?? defaultFrom;
  const toValue   = sp.get("to")   ?? defaultTo;
  const hasDates  = fromValue !== "" || toValue !== "";

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <select
        className="text-sm px-3 py-2 rounded-[var(--r-md)] border bg-[var(--ink-white)] border-[var(--ink-200)] text-[var(--ink-700)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
        value={sp.get("visitorId") ?? ""}
        onChange={(e) => updateSelect("visitorId", e.target.value)}
      >
        <option value="">Todos los visitadores</option>
        {visitors.map((v) => (
          <option key={v.id} value={v.id}>{v.name}</option>
        ))}
      </select>

      <select
        className="text-sm px-3 py-2 rounded-[var(--r-md)] border bg-[var(--ink-white)] border-[var(--ink-200)] text-[var(--ink-700)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
        value={sp.get("placeType") ?? ""}
        onChange={(e) => updateSelect("placeType", e.target.value)}
      >
        <option value="">Todos los tipos</option>
        {PLACE_TYPES.map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>

      <div className="flex items-center gap-1.5">
        <input
          type="date"
          className="text-sm px-3 py-2 rounded-[var(--r-md)] border bg-[var(--ink-white)] border-[var(--ink-200)] text-[var(--ink-700)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
          value={fromValue}
          onChange={(e) => updateDate("from", e.target.value)}
        />
        <span className="text-xs" style={{ color: "var(--ink-400)" }}>–</span>
        <input
          type="date"
          className="text-sm px-3 py-2 rounded-[var(--r-md)] border bg-[var(--ink-white)] border-[var(--ink-200)] text-[var(--ink-700)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
          value={toValue}
          onChange={(e) => updateDate("to", e.target.value)}
        />
        {hasDates && (
          <button
            onClick={clearDates}
            title="Ver todas las fechas"
            className="text-xs px-2.5 py-2 rounded-[var(--r-md)] border border-[var(--ink-200)] hover:bg-[var(--ink-100)] transition"
            style={{ color: "var(--ink-500)" }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
