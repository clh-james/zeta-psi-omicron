"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendAnnouncementBlastEmail } from "@/lib/email";

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

  // Fetch target emails
  let emailQuery = supabase.from("members").select("email").eq("status", "active").not("email", "is", null);
  
  if (data.audience_scope === "regional" && data.region_id) {
    emailQuery = emailQuery.eq("region_id", data.region_id);
  } else if (data.audience_scope === "chapter" && data.chapter_id) {
    emailQuery = emailQuery.eq("chapter_id", data.chapter_id);
  }

  const { data: members } = await emailQuery;
  
  if (members && members.length > 0) {
    const emails = members.map((m: any) => m.email).filter(Boolean);
    await sendAnnouncementBlastEmail(emails, data.title, data.body);
  }

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
