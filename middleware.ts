import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "iv_session";
const PUBLIC = ["/login", "/api/auth"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC.some((p) => pathname.startsWith(p))) return NextResponse.next();
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon")) return NextResponse.next();

  const raw = request.cookies.get(SESSION_COOKIE)?.value;
  if (!raw) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let session: { role: string } | null = null;
  try {
    session = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete(SESSION_COOKIE);
    return res;
  }

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(session?.role === "ADMIN" ? "/admin" : "/visits", request.url)
    );
  }

  if (pathname.startsWith("/admin") && session?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/visits", request.url));
  }

  if ((pathname.startsWith("/visits") || pathname.startsWith("/attendance")) && session?.role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg).*)"],
};
