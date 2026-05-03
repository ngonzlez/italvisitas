import { prisma } from "@/lib/prisma";
import PlacesClient from "./PlacesClient";

export default async function AdminPlacesPage() {
  const places = await prisma.place.findMany({
    include: { _count: { select: { visits: true, doctors: true } } },
    orderBy: { name: "asc" },
  });

  return <PlacesClient places={places} />;
}
