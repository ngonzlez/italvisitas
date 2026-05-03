/**
 * seed-empty.ts — Solo crea usuarios base, sin datos de prueba.
 * Usar en producción o ambiente limpio.
 *
 * npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed-empty.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import { Role } from "../app/generated/prisma/enums";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🗑  Limpiando tablas...");
  await prisma.attendance.deleteMany();
  await prisma.visit.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.place.deleteMany();
  await prisma.user.deleteMany();

  console.log("👤 Creando usuarios...");
  const hash = (p: string) => bcrypt.hashSync(p, 10);

  await prisma.user.createMany({
    data: [
      { name: "Administrador", email: "admin@italquimica.com.py", password: hash("admin"), role: Role.ADMIN,   initials: "AD" },
    ],
  });

  console.log("✅ Seed vacío completo.");
  console.log("   Admin: admin@italquimica.com.py / admin");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => { prisma.$disconnect(); pool.end(); });
