import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import { PlaceType, StockLevel, Role } from "../app/generated/prisma/enums";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.attendance.deleteMany();
  await prisma.visit.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.place.deleteMany();
  await prisma.user.deleteMany();

  const hashPw = (p: string) => bcrypt.hashSync(p, 10);

  const [admin, maria, carlos, lucia] = await prisma.$transaction([
    prisma.user.create({ data: { id: "u1", name: "Dr. Pascual", email: "admin@italquimica.com.py", password: hashPw("admin"), role: Role.ADMIN,    initials: "PS" } }),
    prisma.user.create({ data: { id: "u2", name: "María Benítez",  email: "maria@italquimica.com.py",  password: hashPw("visita"), role: Role.VISITOR, initials: "MB" } }),
    prisma.user.create({ data: { id: "u3", name: "Carlos Ramírez", email: "carlos@italquimica.com.py", password: hashPw("visita"), role: Role.VISITOR, initials: "CR" } }),
    prisma.user.create({ data: { id: "u4", name: "Lucía Ayala",    email: "lucia@italquimica.com.py",  password: hashPw("visita"), role: Role.VISITOR, initials: "LA" } }),
  ]);

  const places = await prisma.$transaction([
    prisma.place.create({ data: { id: "p1", type: PlaceType.FARMACIA, name: "Farmacia Catedral",         address: "Palma 532, Asunción",            zone: "Centro" } }),
    prisma.place.create({ data: { id: "p2", type: PlaceType.FARMACIA, name: "Farmacenter Villa Morra",   address: "Mcal. López 3850",               zone: "Villa Morra" } }),
    prisma.place.create({ data: { id: "p3", type: PlaceType.FARMACIA, name: "Punto Farma San Lorenzo",   address: "Ruta Mcal. Estigarribia 1200",   zone: "San Lorenzo" } }),
    prisma.place.create({ data: { id: "p4", type: PlaceType.FARMACIA, name: "Farmacia Scavone Recoleta", address: "Av. España 1580",                zone: "Recoleta" } }),
    prisma.place.create({ data: { id: "p5", type: PlaceType.HOSPITAL, name: "Hospital Bautista",         address: "Av. Argentina 1300",             zone: "Trinidad" } }),
    prisma.place.create({ data: { id: "p6", type: PlaceType.CLINICA,  name: "Clínica Migone",            address: "Eligio Ayala 1293",              zone: "Centro" } }),
    prisma.place.create({ data: { id: "p7", type: PlaceType.CLINICA,  name: "Sanatorio La Costa",        address: "Cnel. Cabrera 820",              zone: "Lambaré" } }),
    prisma.place.create({ data: { id: "p8", type: PlaceType.FARMACIA, name: "Farmacia del Sol Luque",    address: "Gral. Aquino 410",               zone: "Luque" } }),
  ]);

  await prisma.$transaction([
    prisma.doctor.create({ data: { id: "d1", name: "Dra. Andrea Núñez",   specialty: "Pediatría",      placeId: "p5" } }),
    prisma.doctor.create({ data: { id: "d2", name: "Dr. Jorge Villalba",  specialty: "Clínica Médica", placeId: "p6" } }),
    prisma.doctor.create({ data: { id: "d3", name: "Dra. Mónica Riveros", specialty: "Ginecología",    placeId: "p5" } }),
    prisma.doctor.create({ data: { id: "d4", name: "Dr. Fernando Ojeda",  specialty: "Cardiología",    placeId: "p7" } }),
    prisma.doctor.create({ data: { id: "d5", name: "Dra. Silvia Cáceres", specialty: "Dermatología",   placeId: "p6" } }),
    prisma.doctor.create({ data: { id: "d6", name: "Dr. Luis Figueredo",  specialty: "Traumatología",  placeId: "p5" } }),
  ]);

  const objectives = [
    "Presentación de nueva línea de antibióticos",
    "Seguimiento de pedido anterior",
    "Capacitación sobre vacunas",
    "Reposición de muestras",
    "Recordatorio de portafolio",
    "Lanzamiento línea dermatológica",
    "Consulta sobre condiciones de venta",
  ];
  const findings = [
    "Interés alto, solicita visita de seguimiento",
    "Ya trabaja con nuestra línea, pide catálogo actualizado",
    "Consulta precios, enviar cotización",
    "Stock bajo, programar reposición esta semana",
    "Derivó a encargado de compras, agendar nuevo contacto",
    "Muy receptivo, posible pedido grande",
    "Sin interés por el momento",
  ];
  const stocks: StockLevel[] = [StockLevel.ALTO, StockLevel.MEDIO, StockLevel.BAJO, StockLevel.SIN_STOCK];
  const visitors = [maria, carlos, lucia];
  const doctorsByPlace: Record<string, string[]> = {
    p5: ["d1", "d3", "d6"],
    p6: ["d2", "d5"],
    p7: ["d4"],
  };

  const rand = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
  const now = new Date("2026-04-22T10:30:00");

  for (let i = 0; i < 48; i++) {
    const daysBack = Math.floor(Math.random() * 30);
    const d = new Date(now);
    d.setDate(d.getDate() - daysBack);
    d.setHours(8 + Math.floor(Math.random() * 9), Math.floor(Math.random() * 60));
    const place = rand(places);
    const placeDoctors = doctorsByPlace[place.id] || [];
    const doctorId =
      place.type !== PlaceType.FARMACIA && placeDoctors.length && Math.random() > 0.3
        ? rand(placeDoctors)
        : null;

    await prisma.visit.create({
      data: {
        visitorId: rand(visitors).id,
        placeId: place.id,
        doctorId,
        objective: rand(objectives),
        finding: rand(findings),
        stock: rand(stocks),
        gpsLat: -25.3 + (Math.random() - 0.5) * 0.2,
        gpsLng: -57.5 + (Math.random() - 0.5) * 0.2,
        date: d,
      },
    });
  }

  const zones = [
    { name: "Centro Asunción",  addr: "Palma 532, Asunción",          lat: -25.2862, lng: -57.647  },
    { name: "Villa Morra",       addr: "Mcal. López 3850, Asunción",   lat: -25.2926, lng: -57.5764 },
    { name: "San Lorenzo",       addr: "Ruta Mcal. Estigarribia 1200", lat: -25.3403, lng: -57.5089 },
    { name: "Recoleta",           addr: "Av. España 1580, Asunción",    lat: -25.2944, lng: -57.5921 },
    { name: "Lambaré",            addr: "Cnel. Cabrera 820, Lambaré",   lat: -25.345,  lng: -57.63   },
    { name: "Luque",              addr: "Gral. Aquino 410, Luque",      lat: -25.27,   lng: -57.487  },
  ];

  const seedNow = new Date("2026-05-03T11:00:00");
  for (let dBack = 0; dBack < 14; dBack++) {
    const day = new Date(seedNow);
    day.setDate(day.getDate() - dBack);
    if (day.getDay() === 0) continue;
    for (let idx = 0; idx < visitors.length; idx++) {
      if (Math.random() < 0.15) continue;
      const inH = 7 + Math.floor(Math.random() * 2);
      const inM = Math.floor(Math.random() * 50);
      const checkIn = new Date(day);
      checkIn.setHours(inH, inM, 0);
      const inZone = zones[(dBack + idx) % zones.length];

      const isToday = dBack === 0;
      let checkOut: Date | null = null;
      let outZone = null;
      if (!isToday || Math.random() > 0.4) {
        const outH = 16 + Math.floor(Math.random() * 3);
        const outM = Math.floor(Math.random() * 60);
        checkOut = new Date(day);
        checkOut.setHours(outH, outM, 0);
        outZone = zones[(dBack + idx + 2) % zones.length];
      }

      await prisma.attendance.create({
        data: {
          visitorId: visitors[idx].id,
          checkIn,
          checkInAddr: `${inZone.name} — ${inZone.addr}`,
          checkInLat: inZone.lat + (Math.random() - 0.5) * 0.01,
          checkInLng: inZone.lng + (Math.random() - 0.5) * 0.01,
          checkOut,
          checkOutAddr: outZone ? `${outZone.name} — ${outZone.addr}` : null,
          checkOutLat: outZone ? outZone.lat + (Math.random() - 0.5) * 0.01 : null,
          checkOutLng: outZone ? outZone.lng + (Math.random() - 0.5) * 0.01 : null,
        },
      });
    }
  }

  console.log("✓ Seed complete");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => { prisma.$disconnect(); pool.end(); });
