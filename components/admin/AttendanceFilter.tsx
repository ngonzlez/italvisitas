"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface Props {
  defaultFrom: string;
  defaultTo: string;
}

export default function AttendanceFilter({ defaultFrom, defaultTo }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  function updateDate(key: string, value: string) {
    const params = new URLSearchParams(sp.toString());
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
