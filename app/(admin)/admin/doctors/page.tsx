import { prisma } from "@/lib/prisma";
import DoctorsClient from "./DoctorsClient";

export default async function AdminDoctorsPage() {
  const [doctors, places, specialties] = await Promise.all([
    prisma.doctor.findMany({
      include: { specialty: true, places: true, _count: { select: { visits: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.place.findMany({ orderBy: { name: "asc" } }),
    prisma.specialty.findMany({ orderBy: { name: "asc" } }),
  ]);

  return <DoctorsClient doctors={doctors} places={places} specialties={specialties} />;
}
