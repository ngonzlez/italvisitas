import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { name, specialty, placeId } = await req.json();
  if (!name || !specialty || !placeId) {
    return NextResponse.json({ error: "Campos requeridos" }, { status: 400 });
  }
  const doctor = await prisma.doctor.create({
    data: { name, specialty, placeId },
    include: { place: true },
  });
  return NextResponse.json(doctor, { status: 201 });
}
