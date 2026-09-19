import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const GATE_COOKIE = "zpo_gate_unlocked";
const PUBLIC_PATHS = ["/", "/gate", "/api/gate"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Public marketing/homepage paths never need the gate.
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // 2. Everything under /login, /register, /dashboard requires the
  //    fraternity password gate to have been unlocked first.
  const gateCookie = request.cookies.get(GATE_COOKIE);
  const requiresGate =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/dashboard");

  if (requiresGate && gateCookie?.value !== "true") {
    const url = request.nextUrl.clone();
    url.pathname = "/gate";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // 3. Refresh the Supabase session and gate the dashboard behind login.
  const { response, user } = await updateSession(request);

  if (pathname.startsWith("/dashboard") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
