import { prisma } from "@/lib/prisma";
import SettingsClient from "./SettingsClient";

export default async function AdminSettingsPage() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, initials: true, createdAt: true },
    orderBy: { name: "asc" },
  });

  return <SettingsClient users={users} />;
}
