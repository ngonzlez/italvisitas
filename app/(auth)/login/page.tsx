"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Error al iniciar sesión"); return; }
      router.replace(data.role === "ADMIN" ? "/admin" : "/visits");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--ink-50)" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-[var(--shadow-md)]"
            style={{ background: "var(--brand-800)" }}
          >
            <span className="text-white font-extrabold text-2xl tracking-tight">iV</span>
          </div>
          <h1 className="text-xl font-bold" style={{ color: "var(--ink-900)" }}>Italvisitas</h1>
          <p className="text-sm mt-1" style={{ color: "var(--ink-500)" }}>Control de visitas médicas</p>
        </div>

        {/* Form */}
        <div
          className="rounded-[var(--r-xl)] shadow-[var(--shadow-lg)] p-6 border"
          style={{ background: "var(--ink-white)", borderColor: "var(--ink-100)" }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@italquimica.com.py"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            {error && (
              <p className="text-sm text-center px-3 py-2 rounded-[var(--r-sm)]" style={{ color: "var(--danger-600)", background: "var(--danger-100)" }}>
                {error}
              </p>
            )}
            <Button type="submit" size="lg" loading={loading} className="w-full mt-1">
              Iniciar sesión
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t" style={{ borderColor: "var(--ink-100)" }}>
            <p className="text-xs text-center mb-2" style={{ color: "var(--ink-400)" }}>Credenciales demo</p>
            <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: "var(--ink-500)" }}>
              <div className="rounded-[var(--r-sm)] p-2" style={{ background: "var(--ink-50)" }}>
                <p className="font-semibold" style={{ color: "var(--ink-700)" }}>Admin</p>
                <p>admin@italquimica.com.py</p>
                <p>admin</p>
              </div>
              <div className="rounded-[var(--r-sm)] p-2" style={{ background: "var(--ink-50)" }}>
                <p className="font-semibold" style={{ color: "var(--ink-700)" }}>Visitador</p>
                <p>maria@italquimica.com.py</p>
                <p>visita</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
