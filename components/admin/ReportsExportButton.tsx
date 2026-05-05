"use client";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PLACE_TYPE_LABEL } from "@/lib/utils";

interface ExportData {
  stockData: { name: string; value: number }[];
  trendData: { month: string; visitas: number }[];
  doctorsList: { name: string; specialty: string; place: string; visitas: number }[];
  placesList: { name: string; type: string; zone: string; visitas: number }[];
  visitorsList: { name: string; visitas: number }[];
}

export default function ReportsExportButton({ data }: { data: ExportData }) {
  function handleExport() {
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(data.stockData.map(s => ({ Stock: s.name, Cantidad: s.value }))),
      "Stock"
    );

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(
        data.placesList.map(p => ({
          Lugar: p.name,
          Tipo: PLACE_TYPE_LABEL[p.type] ?? p.type,
          Zona: p.zone,
          Visitas: p.visitas,
        }))
      ),
      "Lugares"
    );

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(
        data.doctorsList.map(d => ({
          Médico: d.name,
          Especialidad: d.specialty,
          Lugar: d.place,
          Visitas: d.visitas,
        }))
      ),
      "Médicos"
    );

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(
        data.visitorsList.map(v => ({ Visitador: v.name, Visitas: v.visitas }))
      ),
      "Visitadores"
    );

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(
        data.trendData.map(t => ({ Mes: t.month, Visitas: t.visitas }))
      ),
      "Tendencia"
    );

    XLSX.writeFile(wb, `reportes-rondamed.xlsx`);
  }

  return (
    <Button size="sm" variant="secondary" onClick={handleExport}>
      <Download className="w-4 h-4" />
      Descargar Excel
    </Button>
  );
}
