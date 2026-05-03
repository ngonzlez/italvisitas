import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewVisitWizard from "@/components/visitor/NewVisitWizard";

export default async function NewVisitPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [places, doctors, specialties, zones] = await Promise.all([
    prisma.place.findMany({ include: { zone: true }, orderBy: { name: "asc" } }),
    prisma.doctor.findMany({ include: { places: { include: { zone: true } }, specialty: true }, orderBy: { name: "asc" } }),
    prisma.specialty.findMany({ orderBy: { name: "asc" } }),
    prisma.zone.findMany({ orderBy: { name: "asc" } }),
  ]);

  return <NewVisitWizard places={places} doctors={doctors} specialties={specialties} zones={zones} />;
}
