"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createEvent(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: member } = await supabase.from("members").select("id, role:users(role)").eq("user_id", user.id).single();
  if (!member) throw new Error("Member profile not found");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const event_date = formData.get("event_date") as string;
  const location = formData.get("location") as string;
  const type = formData.get("type") as string;
  
  // Note: we could get target_chapter_id and target_region from form if it's a regional/chapter event
  // For simplicity, we assume they pick 'national' for now, or we just insert it.
  
  const { error } = await supabase.from("events").insert({
    title,
    description,
    event_date: new Date(event_date).toISOString(),
    location,
    organizer_id: member.id,
    type,
  });

  if (error) {
    console.error("Error creating event:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/events");
  return { success: true };
}

export async function submitRSVP(eventId: string, status: 'attending' | 'maybe' | 'declined') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: member } = await supabase.from("members").select("id").eq("user_id", user.id).single();
  if (!member) throw new Error("Member profile not found");

  const { error } = await supabase.from("event_rsvps").upsert({
    event_id: eventId,
    member_id: member.id,
    status: status,
    updated_at: new Date().toISOString()
  }, { onConflict: "event_id, member_id" });

  if (error) {
    console.error("Error submitting RSVP:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/events");
  return { success: true };
}
