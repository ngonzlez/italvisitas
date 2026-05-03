import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const zones = await prisma.zone.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(zones);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
  try {
    const zone = await prisma.zone.create({ data: { name: name.trim() } });
    return NextResponse.json(zone, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Ya existe esa zona" }, { status: 409 });
  }
}
