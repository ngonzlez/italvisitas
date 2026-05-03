import { cn } from "@/lib/utils";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn("bg-[var(--ink-white)] border border-[var(--ink-100)] rounded-[var(--r-xl)] shadow-[var(--shadow-sm)]", className)}
    >
      {children}
    </div>
  );
}
