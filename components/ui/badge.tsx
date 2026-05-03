import { cn } from "@/lib/utils";
import { STOCK_CONFIG, PLACE_TYPE_LABEL } from "@/lib/utils";

export function StockBadge({ stock }: { stock: string }) {
  const cfg = STOCK_CONFIG[stock] ?? STOCK_CONFIG.MEDIO;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {cfg.label}
    </span>
  );
}

export function PlaceTypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--brand-100)] text-[var(--brand-700)]">
      {PLACE_TYPE_LABEL[type] ?? type}
    </span>
  );
}

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--ink-100)] text-[var(--ink-600)]", className)}>
      {children}
    </span>
  );
}
