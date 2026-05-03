import { prisma } from "@/lib/prisma";
import SettingsClient from "./SettingsClient";

export default async function AdminSettingsPage() {
  const [users, specialties, zones] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, initials: true, createdAt: true },
      orderBy: { name: "asc" },
    }),
    prisma.specialty.findMany({ orderBy: { name: "asc" } }),
    prisma.zone.findMany({ orderBy: { name: "asc" } }),
  ]);

  return <SettingsClient users={users} specialties={specialties} zones={zones} />;
}
