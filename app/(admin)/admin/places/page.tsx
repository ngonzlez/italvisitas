import { prisma } from "@/lib/prisma";
import PlacesClient from "./PlacesClient";

export default async function AdminPlacesPage() {
  const [places, zones] = await Promise.all([
    prisma.place.findMany({
      include: { zone: true, _count: { select: { visits: true, doctors: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.zone.findMany({ orderBy: { name: "asc" } }),
  ]);

  return <PlacesClient places={places} zones={zones} />;
}
