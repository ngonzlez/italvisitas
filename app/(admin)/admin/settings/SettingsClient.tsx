"use client";
import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserModal, { type UserForModal } from "@/components/admin/UserModal";
import RefTableManager from "@/components/admin/RefTableManager";
import { formatDate } from "@/lib/utils";

type User = UserForModal & { createdAt: string | Date };

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Administrador",
  VISITOR: "Visitador",
};

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  ADMIN:   { bg: "var(--brand-100)", color: "var(--brand-700)" },
  VISITOR: { bg: "var(--ink-100)",   color: "var(--ink-600)" },
};

type RefItem = { id: string; name: string };

interface Props {
  users: User[];
  specialties: RefItem[];
  zones: RefItem[];
}

export default function SettingsClient({ users, specialties, zones }: Props) {
  const [modal, setModal] = useState<"create" | User | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--ink-900)" }}>Configuración</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--ink-500)" }}>
            {users.length} usuario{users.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button size="sm" onClick={() => setModal("create")}>
          <Plus className="w-4 h-4" />
          Nuevo usuario
        </Button>
      </div>

      <div
        className="rounded-[var(--r-lg)] border overflow-hidden"
        style={{ background: "var(--ink-white)", borderColor: "var(--ink-100)" }}
      >
        {users.map((u, i) => (
          <div
            key={u.id}
            className="flex items-center gap-4 px-5 py-4"
            style={{
              borderTop: i > 0 ? "1px solid var(--ink-100)" : undefined,
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ background: "var(--brand-600)" }}
            >
              {u.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: "var(--ink-900)" }}>{u.name}</p>
              <p className="text-xs" style={{ color: "var(--ink-500)" }}>{u.email}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span
                className="hidden sm:inline text-xs"
                style={{ color: "var(--ink-400)" }}
              >
                Desde {formatDate(u.createdAt)}
              </span>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: ROLE_COLORS[u.role]?.bg ?? "var(--ink-100)",
                  color: ROLE_COLORS[u.role]?.color ?? "var(--ink-600)",
                }}
              >
                {ROLE_LABEL[u.role] ?? u.role}
              </span>
              <button
                onClick={() => setModal(u)}
                className="p-1.5 rounded-[var(--r-sm)] hover:bg-[var(--ink-100)] transition"
                style={{ color: "var(--ink-500)" }}
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="text-center py-12 text-sm" style={{ color: "var(--ink-400)" }}>
            No hay usuarios
          </div>
        )}
      </div>

      {modal !== null && (
        <UserModal
          user={modal === "create" ? undefined : modal}
          onClose={() => setModal(null)}
        />
      )}

      <div className="mt-8 grid sm:grid-cols-2 gap-6">
        <RefTableManager title="Especialidades" items={specialties} apiPath="/api/specialties" />
        <RefTableManager title="Zonas" items={zones} apiPath="/api/zones" />
      </div>
    </div>
  );
}
