"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Plus, ClipboardList, LogOut } from "lucide-react";
import type { SessionUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/visits",     icon: Home,          label: "Inicio" },
  { href: "/visits/new", icon: Plus,           label: "Nueva" },
  { href: "/attendance", icon: ClipboardList,  label: "Asistencia" },
];

export default function VisitorShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.replace("/login");
  }

  return (
    <div className="flex flex-col min-h-screen max-w-[430px] mx-auto" style={{ background: "var(--ink-50)" }}>
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2" style={{ background: "var(--brand-800)" }}>
        <span className="text-xs font-semibold text-white/90">{user.name}</span>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-500)]" />
          <span className="text-xs text-white/70">Visitador</span>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom nav */}
      <nav
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] flex items-center justify-around border-t px-2 pb-safe pt-1.5"
        style={{ background: "var(--ink-white)", borderColor: "var(--ink-100)", boxShadow: "0 -4px 20px rgba(12,21,36,0.06)" }}
      >
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/visits" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-[var(--r-md)] transition-all",
                active ? "text-[var(--brand-700)]" : "text-[var(--ink-400)]"
              )}
            >
              <Icon className={cn("w-5 h-5", active && "stroke-[2.5]")} />
              <span className={cn("text-[10px] font-semibold", active && "text-[var(--brand-700)]")}>{label}</span>
            </Link>
          );
        })}
        <button
          onClick={logout}
          className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-[var(--r-md)] text-[var(--ink-400)] transition-all hover:text-[var(--danger-600)]"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Salir</span>
        </button>
      </nav>
    </div>
  );
}
