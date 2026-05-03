import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewVisitWizard from "@/components/visitor/NewVisitWizard";

export default async function NewVisitPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [places, doctors] = await Promise.all([
    prisma.place.findMany({ orderBy: { name: "asc" } }),
    prisma.doctor.findMany({ include: { place: true }, orderBy: { name: "asc" } }),
  ]);

  return <NewVisitWizard places={places} doctors={doctors} />;
}
