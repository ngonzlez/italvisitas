import { config } from "dotenv";
config({ path: ".env.local" });
config(); // fallback .env
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // migrations necesitan conexión directa (puerto 5432), no el pooler
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"]!,
  },
});
