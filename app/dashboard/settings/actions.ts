"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateFraternityPassword(newPassword: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return { ok: false, error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (profile?.role !== "super_admin") {
    return { ok: false, error: "Unauthorized: Only Super Admins can perform this action." };
  }

  const { error } = await supabase.rpc('update_fraternity_password', {
    p_new_password: newPassword
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/settings");
  return { ok: true };
}
