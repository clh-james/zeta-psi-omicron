"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAnnouncement(data: {
  title: string;
  body: string;
  audience_scope: string;
  region_id?: string | null;
  chapter_id?: string | null;
  is_pinned?: boolean;
}) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return { ok: false, error: "Unauthorized" };

  const { error } = await supabase.from("announcements").insert({
    title: data.title,
    body: data.body,
    audience_scope: data.audience_scope,
    region_id: data.region_id || null,
    chapter_id: data.chapter_id || null,
    is_pinned: data.is_pinned || false,
    created_by: userData.user.id,
    published_at: new Date().toISOString(),
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/announcements");
  return { ok: true };
}

export async function deleteAnnouncement(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/announcements");
  return { ok: true };
}
