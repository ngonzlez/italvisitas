import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rondamed — Control de Visitas Médicas",
  description: "Sistema de gestión de visitas médicas para laboratorios y empresas del sector salud",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
