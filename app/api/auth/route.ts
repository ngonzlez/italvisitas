import { NextRequest, NextResponse } from "next/server";
import { signIn, encodeSession, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Credenciales requeridas" }, { status: 400 });
  }
  const user = await signIn(email, password);
  if (!user) {
    return NextResponse.json({ error: "Email o contraseña incorrectos" }, { status: 401 });
  }
  const res = NextResponse.json({ role: user.role });
  res.cookies.set(SESSION_COOKIE_NAME, encodeSession(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE_NAME);
  return res;
}
