import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { id } = await params;
  const { name, specialtyId, placeIds } = await req.json();
  const doctor = await prisma.doctor.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(specialtyId && { specialtyId }),
      ...(placeIds && { places: { set: (placeIds as string[]).map((pid) => ({ id: pid })) } }),
    },
    include: { specialty: true, places: true },
  });
  return NextResponse.json(doctor);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { id } = await params;
  await prisma.doctor.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
