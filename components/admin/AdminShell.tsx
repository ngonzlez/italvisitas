"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, ClipboardList, CheckSquare,
  Users, Stethoscope, Building2, BarChart2, Settings, Menu, X, LogOut
} from "lucide-react";
import type { SessionUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useState } from "react";

const NAV = [
  { href: "/admin",              icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/visits",       icon: ClipboardList,   label: "Visitas" },
  { href: "/admin/attendance",   icon: CheckSquare,     label: "Asistencia" },
  { href: "/admin/visitors",     icon: Users,           label: "Visitadores" },
  { href: "/admin/doctors",      icon: Stethoscope,     label: "Médicos" },
  { href: "/admin/places",       icon: Building2,       label: "Lugares" },
  { href: "/admin/reports",      icon: BarChart2,       label: "Reportes" },
  { href: "/admin/settings",     icon: Settings,        label: "Configuración" },
];

export default function AdminShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.replace("/login");
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: "var(--ink-100)" }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--brand-800)" }}>
          <span className="text-white font-extrabold text-sm">iV</span>
        </div>
        <div>
          <p className="text-sm font-bold leading-tight" style={{ color: "var(--ink-900)" }}>Italvisitas</p>
          <p className="text-[10px]" style={{ color: "var(--ink-500)" }}>Panel administrativo</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-[var(--r-md)] text-sm font-medium transition-all",
                active
                  ? "bg-[var(--brand-700)] text-white shadow-[var(--shadow-sm)]"
                  : "text-[var(--ink-600)] hover:bg-[var(--ink-100)] hover:text-[var(--ink-900)]"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t" style={{ borderColor: "var(--ink-100)" }}>
        <div className="flex items-center gap-3 px-3 py-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: "var(--brand-600)" }}
          >
            {user.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: "var(--ink-900)" }}>{user.name}</p>
            <p className="text-[10px] truncate" style={{ color: "var(--ink-500)" }}>{user.email}</p>
          </div>
          <button onClick={logout} className="p-1.5 rounded-[var(--r-sm)] hover:bg-[var(--ink-100)] transition" style={{ color: "var(--ink-500)" }}>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ background: "var(--ink-50)" }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-56 shrink-0 sticky top-0 h-screen border-r"
        style={{ background: "var(--ink-white)", borderColor: "var(--ink-100)" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setOpen(false)} style={{ background: "rgba(12,21,36,0.4)" }}>
          <aside
            className="absolute left-0 top-0 h-full w-64 border-r"
            style={{ background: "var(--ink-white)", borderColor: "var(--ink-100)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div
          className="lg:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-0 z-30"
          style={{ background: "var(--ink-white)", borderColor: "var(--ink-100)" }}
        >
          <button onClick={() => setOpen(true)} className="p-1.5 rounded-[var(--r-sm)] hover:bg-[var(--ink-100)]" style={{ color: "var(--ink-600)" }}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "var(--brand-800)" }}>
            <span className="text-white font-extrabold text-xs">iV</span>
          </div>
          <span className="text-sm font-bold" style={{ color: "var(--ink-900)" }}>Italvisitas</span>
        </div>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
