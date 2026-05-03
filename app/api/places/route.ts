import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { PlaceType } from "@/app/generated/prisma/enums";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { name, address, zone, type } = await req.json();
  if (!name || !address || !zone || !type) {
    return NextResponse.json({ error: "Campos requeridos" }, { status: 400 });
  }
  const place = await prisma.place.create({
    data: { name, address, zone, type: type as PlaceType },
  });
  return NextResponse.json(place, { status: 201 });
}
