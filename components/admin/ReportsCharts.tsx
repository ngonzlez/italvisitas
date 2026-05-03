"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Card } from "@/components/ui/card";

interface Props {
  stockData: { name: string; value: number; color: string }[];
  placeData: { name: string; visitas: number }[];
  visitorData: { name: string; visitas: number }[];
  trendData: { month: string; visitas: number }[];
}

export default function ReportsCharts({ stockData, placeData, visitorData, trendData }: Props) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {/* Stock distribution */}
      <Card className="p-4">
        <p className="text-sm font-bold mb-4" style={{ color: "var(--ink-800)" }}>Distribución de stock</p>
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie data={stockData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65}>
                {stockData.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2">
            {stockData.map(s => (
              <div key={s.name} className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
                <span style={{ color: "var(--ink-700)" }}>{s.name}</span>
                <span className="font-bold ml-auto" style={{ color: "var(--ink-900)" }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Visitor performance */}
      <Card className="p-4">
        <p className="text-sm font-bold mb-3" style={{ color: "var(--ink-800)" }}>Visitas por visitador</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={visitorData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <XAxis type="number" tick={{ fontSize: 11, fill: "var(--ink-500)" }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "var(--ink-600)" }} axisLine={false} tickLine={false} width={90} />
            <Tooltip contentStyle={{ background: "var(--ink-white)", border: "1px solid var(--ink-100)", borderRadius: 10, fontSize: 12 }} />
            <Bar dataKey="visitas" fill="var(--brand-600)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Top places */}
      <Card className="p-4">
        <p className="text-sm font-bold mb-3" style={{ color: "var(--ink-800)" }}>Visitas por lugar (top 8)</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={placeData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <XAxis type="number" tick={{ fontSize: 11, fill: "var(--ink-500)" }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "var(--ink-600)" }} axisLine={false} tickLine={false} width={120} />
            <Tooltip contentStyle={{ background: "var(--ink-white)", border: "1px solid var(--ink-100)", borderRadius: 10, fontSize: 12 }} />
            <Bar dataKey="visitas" fill="var(--accent-500)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Monthly trend */}
      <Card className="p-4">
        <p className="text-sm font-bold mb-3" style={{ color: "var(--ink-800)" }}>Tendencia mensual</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--ink-500)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--ink-500)" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ background: "var(--ink-white)", border: "1px solid var(--ink-100)", borderRadius: 10, fontSize: 12 }} />
            <Line type="monotone" dataKey="visitas" stroke="var(--brand-600)" strokeWidth={2} dot={{ r: 4, fill: "var(--brand-600)" }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
