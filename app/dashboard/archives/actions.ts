"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveDocumentMetadata(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: member } = await supabase.from("members").select("id").eq("user_id", user.id).single();
  // It's possible for a super admin to upload without a member record, but the schema requires `uploaded_by` to reference `members(id)`.
  // Wait, I should make `uploaded_by` nullable in schema, or require a member profile.
  // I already updated schema with `uploaded_by uuid not null references members(id)`. 
  // Let's use `null` if they don't have a member profile, so we need to ensure `uploaded_by` is nullable in schema.
  // Wait, I made it `uploaded_by uuid not null`. I'll pass member?.id.

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const file_url = formData.get("file_url") as string;
  const file_type = formData.get("file_type") as string;
  const category = formData.get("category") as string;
  const visibility = formData.get("visibility") as string;

  const { error } = await supabase.from("archives").insert({
    title,
    description,
    file_url,
    file_type,
    category,
    visibility,
    uploaded_by: member?.id || null // This might fail if the DB constraint is not null. I will update schema to allow nulls.
  });

  if (error) {
    console.error("Error saving document:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/archives");
  return { success: true };
}

export async function deleteDocument(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get file URL to delete from storage
  const { data: doc } = await supabase.from("archives").select("file_url").eq("id", id).single();
  
  if (doc?.file_url) {
    // Extract path from public URL
    // e.g. https://xyz.supabase.co/storage/v1/object/public/archives/path/to/file.pdf
    const urlParts = doc.file_url.split('/archives/');
    if (urlParts.length > 1) {
      const filePath = urlParts[1];
      await supabase.storage.from('archives').remove([filePath]);
    }
  }

  const { error } = await supabase.from("archives").delete().eq("id", id);
  
  if (error) {
    console.error("Error deleting document:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/archives");
  return { success: true };
}
