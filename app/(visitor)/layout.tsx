import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import VisitorShell from "@/components/visitor/VisitorShell";

export default async function VisitorLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "VISITOR") redirect("/admin");
  return <VisitorShell user={session}>{children}</VisitorShell>;
}
