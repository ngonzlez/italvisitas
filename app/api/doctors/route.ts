import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { name, specialtyId, placeIds } = await req.json();
  if (!name || !specialtyId || !placeIds?.length) {
    return NextResponse.json({ error: "Campos requeridos" }, { status: 400 });
  }
  const doctor = await prisma.doctor.create({
    data: {
      name,
      specialtyId,
      places: { connect: (placeIds as string[]).map((id) => ({ id })) },
    },
    include: { specialty: true, places: true },
  });
  return NextResponse.json(doctor, { status: 201 });
}
