"use client";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PLACE_TYPE_LABEL, STOCK_CONFIG } from "@/lib/utils";

export type VisitExportRow = {
  fecha: string;
  hora: string;
  visitador: string;
  lugar: string;
  tipo: string;
  zona: string;
  medico: string;
  stock: string;
  objetivo: string;
  hallazgo: string;
};

export default function VisitsExportButton({ rows }: { rows: VisitExportRow[] }) {
  function handleExport() {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(
        rows.map((r) => ({
          Fecha: r.fecha,
          Hora: r.hora,
          Visitador: r.visitador,
          Lugar: r.lugar,
          Tipo: PLACE_TYPE_LABEL[r.tipo] ?? r.tipo,
          Zona: r.zona,
          Médico: r.medico,
          Stock: STOCK_CONFIG[r.stock]?.label ?? r.stock,
          Objetivo: r.objetivo,
          Hallazgo: r.hallazgo,
        }))
      ),
      "Visitas"
    );
    XLSX.writeFile(wb, `visitas-rondamed.xlsx`);
  }

  return (
    <Button size="sm" variant="secondary" onClick={handleExport}>
      <Download className="w-4 h-4" />
      Descargar Excel
    </Button>
  );
}
