import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { Role } from "@/app/generated/prisma/enums";

const SESSION_COOKIE = "iv_session";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  initials: string;
};

export async function signIn(email: string, password: string): Promise<SessionUser | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role, initials: user.initials };
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(SESSION_COOKIE)?.value;
    if (!raw) return null;
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8")) as SessionUser;
  } catch {
    return null;
  }
}

export function encodeSession(user: SessionUser): string {
  return Buffer.from(JSON.stringify(user)).toString("base64");
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
