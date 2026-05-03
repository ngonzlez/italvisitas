"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { PLACE_TYPE_LABEL } from "@/lib/utils";

const PLACE_TYPES = Object.entries(PLACE_TYPE_LABEL);

export default function VisitsFilter({ visitors }: { visitors: { id: string; name: string }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(sp.toString());
    if (value) params.set(key, value); else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <select
        className="text-sm px-3 py-2 rounded-[var(--r-md)] border bg-[var(--ink-white)] border-[var(--ink-200)] text-[var(--ink-700)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
        value={sp.get("visitorId") ?? ""}
        onChange={(e) => update("visitorId", e.target.value)}
      >
        <option value="">Todos los visitadores</option>
        {visitors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
      </select>

      <select
        className="text-sm px-3 py-2 rounded-[var(--r-md)] border bg-[var(--ink-white)] border-[var(--ink-200)] text-[var(--ink-700)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
        value={sp.get("placeType") ?? ""}
        onChange={(e) => update("placeType", e.target.value)}
      >
        <option value="">Todos los tipos</option>
        {PLACE_TYPES.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
      </select>

      <input
        type="date"
        className="text-sm px-3 py-2 rounded-[var(--r-md)] border bg-[var(--ink-white)] border-[var(--ink-200)] text-[var(--ink-700)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
        value={sp.get("from") ?? ""}
        onChange={(e) => update("from", e.target.value)}
        placeholder="Desde"
      />
      <input
        type="date"
        className="text-sm px-3 py-2 rounded-[var(--r-md)] border bg-[var(--ink-white)] border-[var(--ink-200)] text-[var(--ink-700)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
        value={sp.get("to") ?? ""}
        onChange={(e) => update("to", e.target.value)}
        placeholder="Hasta"
      />
    </div>
  );
}
