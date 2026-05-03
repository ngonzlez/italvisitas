"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardCharts({ data }: { data: { day: string; visitas: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--ink-500)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "var(--ink-500)" }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{ background: "var(--ink-white)", border: "1px solid var(--ink-100)", borderRadius: 10, fontSize: 12 }}
          cursor={{ fill: "var(--ink-50)" }}
          labelStyle={{ color: "var(--ink-700)", fontWeight: 600 }}
        />
        <Bar dataKey="visitas" fill="var(--brand-600)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
