import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

const GATE_COOKIE = "zpo_gate_unlocked";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  // Compares against the bcrypt hash stored in `settings.fraternity_password_hash`,
  // never a plaintext value. See supabase/schema.sql for how it's seeded/rotated.
  const { data, error } = await supabase.rpc("verify_fraternity_password", {
    p_password: password,
  });

  if (error || !data) {
    return NextResponse.json({ error: "Access Denied" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(GATE_COOKIE, "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8-hour gate session
    path: "/",
  });
  return response;
}
