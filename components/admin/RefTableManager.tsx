"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

interface Item { id: string; name: string }

interface Props {
  title: string;
  items: Item[];
  apiPath: string; // e.g. "/api/specialties"
}

export default function RefTableManager({ title, items, apiPath }: Props) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleAdd() {
    if (!newName.trim()) return;
    setAdding(true);
    setError("");
    const res = await fetch(apiPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    setAdding(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Error al agregar");
      return;
    }
    setNewName("");
    router.refresh();
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch(`${apiPath}/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "No se puede eliminar");
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <p className="text-sm font-bold mb-3" style={{ color: "var(--ink-800)" }}>{title}</p>
      <div
        className="rounded-[var(--r-lg)] border overflow-hidden"
        style={{ background: "var(--ink-white)", borderColor: "var(--ink-100)" }}
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            className="flex items-center justify-between px-4 py-3"
            style={{ borderTop: i > 0 ? "1px solid var(--ink-100)" : undefined }}
          >
            <span className="text-sm" style={{ color: "var(--ink-800)" }}>{item.name}</span>
            <button
              onClick={() => handleDelete(item.id)}
              disabled={deletingId === item.id}
              className="p-1.5 rounded-[var(--r-sm)] hover:bg-[var(--ink-100)] transition disabled:opacity-40"
              style={{ color: "var(--danger-500)" }}
              title="Eliminar"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="px-4 py-3 text-sm" style={{ color: "var(--ink-400)" }}>Sin registros</p>
        )}
        {/* Add row */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ borderTop: "1px solid var(--ink-100)" }}
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder={`Nueva ${title.toLowerCase()}...`}
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-[var(--ink-300)]"
            style={{ color: "var(--ink-900)" }}
          />
          <button
            onClick={handleAdd}
            disabled={adding || !newName.trim()}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-[var(--r-sm)] transition disabled:opacity-40"
            style={{ background: "var(--brand-600)", color: "#fff" }}
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar
          </button>
        </div>
      </div>
      {error && <p className="text-xs mt-1.5" style={{ color: "var(--danger-600)" }}>{error}</p>}
    </div>
  );
}
