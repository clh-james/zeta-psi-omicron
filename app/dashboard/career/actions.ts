"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createJobPosting(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: member } = await supabase.from("members").select("id").eq("user_id", user.id).single();
  if (!member) throw new Error("Member profile not found");

  const title = formData.get("title") as string;
  const company = formData.get("company") as string;
  const location = formData.get("location") as string;
  const jobType = formData.get("job_type") as string;
  const description = formData.get("description") as string;
  const applyUrl = formData.get("apply_url") as string;

  const { error } = await supabase.from("job_postings").insert({
    poster_id: member.id,
    title,
    company,
    location,
    job_type: jobType,
    description,
    apply_url: applyUrl
  });

  if (error) {
    console.error("Error creating job posting:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/career");
  return { success: true };
}

export async function offerMentorship(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: member } = await supabase.from("members").select("id").eq("user_id", user.id).single();
  if (!member) throw new Error("Member profile not found");

  const expertise = formData.get("expertise") as string;
  const availability = formData.get("availability") as string;
  const bio = formData.get("bio") as string;

  const { error } = await supabase.from("mentorship_offers").upsert({
    member_id: member.id,
    expertise,
    availability,
    bio,
    updated_at: new Date().toISOString()
  }, { onConflict: "member_id" });

  if (error) {
    console.error("Error offering mentorship:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/career");
  return { success: true };
}

export async function deleteJobPosting(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("job_postings").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/career");
}

export async function deleteMentorshipOffer() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: member } = await supabase.from("members").select("id").eq("user_id", user.id).single();
  if (!member) return;

  const { error } = await supabase.from("mentorship_offers").delete().eq("member_id", member.id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/career");
}
