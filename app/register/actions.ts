"use server";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { biodataSchema } from "@/lib/validations/member";

export async function submitBiodata(formData: FormData) {
  const values = Object.fromEntries(formData.entries());
  
  const parsed = biodataSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false as const, errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Duplicate check: same full name + birth date already in the system.
  // (Bonus feature — a fuller version can fuzzy-match name + mobile + address.)
  const { data: possibleDuplicate } = await supabase
    .from("members")
    .select("id, membership_number")
    .eq("first_name", parsed.data.first_name)
    .eq("last_name", parsed.data.last_name)
    .eq("birth_date", parsed.data.birth_date)
    .maybeSingle();

  if (possibleDuplicate) {
    return {
      ok: false as const,
      errors: { _duplicate: ["A member with this name and birth date already exists."] },
    };
  }

  const { data, error } = await supabase
    .from("members")
    .insert({
      ...parsed.data,
      height_cm: parsed.data.height_cm || null,
      weight_kg: parsed.data.weight_kg || null,
      user_id: user?.id ?? null,
      registration_status: "pending",
      status: "active",
    })
    .select("id")
    .single();

  if (error) {
    return { ok: false as const, errors: { _form: [error.message] } };
  }

  const memberId = data.id;

  // Handle File Uploads securely via Service Role (bypassing RLS since user might not be logged in)
  const serviceClient = createServiceRoleClient();
  const filesToUpload = [
    { key: "profile_picture", file: formData.get("profile_picture") as File | null },
    { key: "government_id", file: formData.get("government_id") as File | null },
    { key: "initiation_certificate", file: formData.get("initiation_certificate") as File | null },
  ];

  for (const { key, file } of filesToUpload) {
    if (file && file.size > 0) {
      const extension = file.name.split('.').pop() || 'bin';
      const filePath = `${memberId}/${key}-${Date.now()}.${extension}`;
      
      const { error: uploadError } = await serviceClient.storage
        .from("documents")
        .upload(filePath, file, { contentType: file.type });
        
      if (!uploadError) {
        await serviceClient.from("documents").insert({
          member_id: memberId,
          type: key as any,
          file_path: filePath,
          file_name: file.name,
          mime_type: file.type,
          size_bytes: file.size,
          uploaded_by: user?.id ?? null
        });
      } else {
        console.error(`Failed to upload ${key}:`, uploadError);
      }
    }
  }

  return { ok: true as const, memberId };
}
