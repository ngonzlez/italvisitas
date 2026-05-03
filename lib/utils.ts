import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(dateStr: string | Date): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "ahora mismo";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "ayer";
  if (days < 7) return `hace ${days} días`;
  return date.toLocaleDateString("es-PY", { day: "numeric", month: "short" });
}

export function formatDate(dateStr: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(dateStr).toLocaleDateString("es-PY", opts ?? { day: "numeric", month: "short", year: "numeric" });
}

export function formatTime(dateStr: string | Date): string {
  return new Date(dateStr).toLocaleTimeString("es-PY", { hour: "2-digit", minute: "2-digit" });
}

export function formatDuration(from: string | Date, to: string | Date): string {
  const diff = new Date(to).getTime() - new Date(from).getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function sameDay(a: string | Date, b: string | Date): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate();
}

export const PLACE_TYPE_LABEL: Record<string, string> = {
  FARMACIA: "Farmacia",
  HOSPITAL: "Hospital",
  CLINICA:  "Clínica",
  MEDICO:   "Médico",
};

export const STOCK_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  ALTO:      { label: "Stock alto",  color: "#12935a", bg: "#d6f2e3" },
  MEDIO:     { label: "Stock medio", color: "#c98200", bg: "#fcefd1" },
  BAJO:      { label: "Stock bajo",  color: "#d97706", bg: "#fef3c7" },
  SIN_STOCK: { label: "Sin stock",   color: "#c4342d", bg: "#fbe3e1" },
};
