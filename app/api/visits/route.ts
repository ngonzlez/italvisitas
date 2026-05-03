import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { StockLevel } from "@/app/generated/prisma/enums";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sp = req.nextUrl.searchParams;
  const where: Record<string, unknown> = {};
  if (session.role === "VISITOR") where.visitorId = session.id;
  if (sp.get("visitorId")) where.visitorId = sp.get("visitorId")!;
  if (sp.get("placeType")) where.place = { type: sp.get("placeType")! };

  const visits = await prisma.visit.findMany({
    where,
    include: { visitor: true, place: true, doctor: true },
    orderBy: { date: "desc" },
    take: 100,
  });
  return NextResponse.json(visits);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "VISITOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { placeId, doctorId, objective, finding, stock, photoUrl, gpsLat, gpsLng } = body;

  if (!placeId || !objective || !finding || !stock) {
    return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
  }

  const visit = await prisma.visit.create({
    data: {
      visitorId: session.id,
      placeId,
      doctorId: doctorId ?? null,
      objective,
      finding,
      stock: stock as StockLevel,
      photoUrl: photoUrl ?? null,
      gpsLat: gpsLat ?? null,
      gpsLng: gpsLng ?? null,
    },
    include: { place: true, doctor: true },
  });
  return NextResponse.json(visit, { status: 201 });
}
