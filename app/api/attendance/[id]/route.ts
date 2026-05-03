import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "VISITOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const record = await prisma.attendance.findFirst({
    where: { id: params.id, visitorId: session.id },
  });
  if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (record.checkOut) return NextResponse.json({ error: "Ya registraste salida" }, { status: 409 });

  const { gps } = await req.json();
  const updated = await prisma.attendance.update({
    where: { id: params.id },
    data: {
      checkOut: new Date(),
      checkOutAddr: gps ? `${gps.lat.toFixed(4)}, ${gps.lng.toFixed(4)}` : null,
      checkOutLat: gps?.lat ?? null,
      checkOutLng: gps?.lng ?? null,
    },
  });
  return NextResponse.json(updated);
}
