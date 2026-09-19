import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type Role = "super_admin" | "national_officer" | "regional_officer" | "chapter_officer" | "member";

/**
 * Ensures the currently authenticated user has one of the allowed roles.
 * If not authenticated, redirects to /login.
 * If authenticated but unauthorized, redirects to /dashboard.
 *
 * @param allowedRoles Array of roles permitted to access the resource.
 * @returns The Supabase user and profile objects if authorized.
 */
export async function requireRole(allowedRoles: Role[]) {
  const supabase = await createClient();

  // 1. Get the authenticated session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Fetch the user's role from the profile
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const userRole = profile?.role as Role | undefined;

  // 3. Verify authorization
  if (!userRole || !allowedRoles.includes(userRole)) {
    redirect("/dashboard");
  }

  return { user, profile };
}
