import { prisma } from "@/lib/prisma";
import DoctorsClient from "./DoctorsClient";

export default async function AdminDoctorsPage() {
  const [doctors, places] = await Promise.all([
    prisma.doctor.findMany({
      include: { place: true, _count: { select: { visits: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.place.findMany({ orderBy: { name: "asc" } }),
  ]);

  return <DoctorsClient doctors={doctors} places={places} />;
}
