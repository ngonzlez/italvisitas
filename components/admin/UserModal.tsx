"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type UserForModal = {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
};

interface Props {
  user?: UserForModal;
  onClose: () => void;
}

export default function UserModal({ user, onClose }: Props) {
  const router = useRouter();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(user?.role ?? "VISITOR");
  const [initials, setInitials] = useState(user?.initials ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !role || !initials.trim()) {
      setError("Nombre, rol e iniciales son requeridos");
      return;
    }
    if (!user && (!email.trim() || !password)) {
      setError("Email y contraseña requeridos para nuevo usuario");
      return;
    }
    if (password && password.length < 6) {
      setError("Contraseña mínimo 6 caracteres");
      return;
    }
    setLoading(true);
    const body: Record<string, string> = {
      name: name.trim(),
      role,
      initials: initials.trim().toUpperCase().slice(0, 2),
    };
    if (!user) {
      body.email = email.trim();
      body.password = password;
    } else if (password) {
      body.password = password;
    }
    const res = await fetch(user ? `/api/users/${user.id}` : "/api/users", {
      method: user ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Error al guardar");
      return;
    }
    router.refresh();
    onClose();
  }

  async function handleDelete() {
    setLoading(true);
    const res = await fetch(`/api/users/${user!.id}`, { method: "DELETE" });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "No se puede eliminar");
      setConfirmDelete(false);
      return;
    }
    router.refresh();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(12,21,36,0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[var(--r-lg)] shadow-[var(--shadow-lg)] p-6"
        style={{ background: "var(--ink-white)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold" style={{ color: "var(--ink-900)" }}>
            {user ? "Editar usuario" : "Nuevo usuario"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[var(--r-sm)] hover:bg-[var(--ink-100)] transition"
            style={{ color: "var(--ink-500)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Juan Pérez"
          />

          {!user && (
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juan@empresa.com"
            />
          )}

          <Input
            label={user ? "Nueva contraseña (dejar vacío para no cambiar)" : "Contraseña"}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={user ? "••••••" : "Mínimo 6 caracteres"}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-600)]">
                Rol
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-[var(--r-md)] border border-[var(--ink-200)] bg-[var(--ink-white)] text-[var(--ink-900)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent transition"
              >
                <option value="VISITOR">Visitador</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
            <Input
              label="Iniciales (2 letras)"
              value={initials}
              onChange={(e) => setInitials(e.target.value.toUpperCase().slice(0, 2))}
              placeholder="JP"
              maxLength={2}
            />
          </div>

          {error && <p className="text-xs text-[var(--danger-600)]">{error}</p>}

          <div className="flex gap-2 mt-1">
            {user && (
              confirmDelete ? (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  loading={loading}
                  onClick={handleDelete}
                  className="mr-auto"
                >
                  Confirmar eliminar
                </Button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="mr-auto text-xs font-semibold px-3 py-2 rounded-[var(--r-sm)] hover:bg-[var(--ink-100)] transition text-[var(--danger-600)]"
                >
                  Eliminar
                </button>
              )
            )}
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" loading={loading}>
              {user ? "Guardar" : "Crear"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
