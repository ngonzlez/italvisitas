"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Clock, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import type { Attendance } from "@/app/generated/prisma/client";

export default function AttendanceToggle({ attendance }: { attendance: Attendance | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const checkedIn = attendance && !attendance.checkOut;

  async function getGPS(): Promise<{ lat: number; lng: number; addr: string } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) { resolve(null); return; }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, addr: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` }),
        () => resolve(null),
        { timeout: 5000 }
      );
    });
  }

  async function handleCheckIn() {
    setLoading(true);
    try {
      const gps = await getGPS();
      await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gps }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckOut() {
    if (!attendance) return;
    setLoading(true);
    try {
      const gps = await getGPS();
      await fetch(`/api/attendance/${attendance.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gps }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: checkedIn ? "var(--accent-100)" : "var(--ink-100)" }}
          >
            {checkedIn ? (
              <CheckCircle className="w-5 h-5" style={{ color: "var(--accent-600)" }} />
            ) : (
              <Clock className="w-5 h-5" style={{ color: "var(--ink-500)" }} />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--ink-900)" }}>
              {checkedIn ? "En campo" : attendance?.checkOut ? "Día cerrado" : "Sin registrar"}
            </p>
            {attendance?.checkIn && (
              <p className="text-xs mt-0.5" style={{ color: "var(--ink-500)" }} suppressHydrationWarning>
                Entrada: {formatTime(attendance.checkIn)}
                {attendance.checkOut && ` · Salida: ${formatTime(attendance.checkOut)}`}
              </p>
            )}
          </div>
        </div>
        {!attendance?.checkOut && (
          <Button
            size="sm"
            variant={checkedIn ? "secondary" : "primary"}
            loading={loading}
            onClick={checkedIn ? handleCheckOut : handleCheckIn}
          >
            {checkedIn ? "Registrar salida" : "Registrar entrada"}
          </Button>
        )}
      </div>
    </Card>
  );
}
