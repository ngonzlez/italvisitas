import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Role } from "@/app/generated/prisma/enums";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, initials: true, createdAt: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { name, email, password, role, initials } = await req.json();
  if (!name || !email || !password || !role || !initials) {
    return NextResponse.json({ error: "Campos requeridos" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Contraseña mínimo 6 caracteres" }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email ya registrado" }, { status: 409 });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: role as Role,
      initials: initials.toUpperCase().slice(0, 2),
    },
    select: { id: true, name: true, email: true, role: true, initials: true, createdAt: true },
  });
  return NextResponse.json(user, { status: 201 });
}
