"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createEvent(data: {
  title: string;
  description: string;
  location: string;
  starts_at: string;
  ends_at: string;
  audience_scope: string;
  region_id?: string | null;
  chapter_id?: string | null;
}) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return { ok: false, error: "Unauthorized" };

  const { error } = await supabase.from("events").insert({
    title: data.title,
    description: data.description,
    location: data.location,
    starts_at: data.starts_at,
    ends_at: data.ends_at || null,
    audience_scope: data.audience_scope,
    region_id: data.region_id || null,
    chapter_id: data.chapter_id || null,
    created_by: userData.user.id,
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/events");
  return { ok: true };
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/events");
  return { ok: true };
}

export async function markAttendance(eventId: string, memberId: string, status: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return { ok: false, error: "Unauthorized" };

  const { error } = await supabase
    .from("event_attendance")
    .upsert(
      {
        event_id: eventId,
        member_id: memberId,
        status: status,
        recorded_by: userData.user.id,
        created_at: new Date().toISOString(),
      },
      { onConflict: 'event_id,member_id' }
    );
  
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/dashboard/events/${eventId}/attendance`);
  return { ok: true };
}

export async function rsvpEvent(eventId: string, status: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return { ok: false, error: "Unauthorized" };

  // Fetch the current user's member ID
  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("user_id", userData.user.id)
    .single();

  if (!member) return { ok: false, error: "Member profile not found." };

  const { error } = await supabase
    .from("event_attendance")
    .upsert(
      {
        event_id: eventId,
        member_id: member.id,
        status: status, // 'present' for attending, 'absent' for not attending
        recorded_by: userData.user.id,
        created_at: new Date().toISOString(),
      },
      { onConflict: 'event_id,member_id' }
    );

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/events");
  return { ok: true };
}
