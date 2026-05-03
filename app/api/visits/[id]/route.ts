import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const where = session.role === "VISITOR"
    ? { id: params.id, visitorId: session.id }
    : { id: params.id };

  const visit = await prisma.visit.findFirst({
    where,
    include: { visitor: true, place: true, doctor: true },
  });
  if (!visit) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(visit);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  await prisma.visit.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
