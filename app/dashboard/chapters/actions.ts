"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// --- Regions ---

export async function createRegion(name: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("regions").insert({ name });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/chapters");
  return { ok: true };
}

export async function updateRegion(id: string, name: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("regions").update({ name }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/chapters");
  return { ok: true };
}

export async function deleteRegion(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("regions").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/chapters");
  return { ok: true };
}

// --- Chapters ---

export async function createChapter(name: string, region_id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("chapters").insert({ name, region_id });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/chapters");
  return { ok: true };
}

export async function updateChapter(id: string, name: string, region_id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("chapters").update({ name, region_id }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/chapters");
  return { ok: true };
}

export async function deleteChapter(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("chapters").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/chapters");
  return { ok: true };
}
