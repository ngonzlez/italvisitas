import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const where = session.role === "VISITOR" ? { visitorId: session.id } : {};
  const records = await prisma.attendance.findMany({
    where,
    include: { visitor: true },
    orderBy: { checkIn: "desc" },
    take: 100,
  });
  return NextResponse.json(records);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "VISITOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const existing = await prisma.attendance.findFirst({
    where: { visitorId: session.id, checkIn: { gte: today } },
  });
  if (existing) {
    return NextResponse.json({ error: "Ya registraste entrada hoy" }, { status: 409 });
  }

  const { gps } = await req.json();
  const record = await prisma.attendance.create({
    data: {
      visitorId: session.id,
      checkIn: new Date(),
      checkInAddr: gps ? `${gps.lat.toFixed(4)}, ${gps.lng.toFixed(4)}` : null,
      checkInLat: gps?.lat ?? null,
      checkInLng: gps?.lng ?? null,
    },
  });
  return NextResponse.json(record, { status: 201 });
}
