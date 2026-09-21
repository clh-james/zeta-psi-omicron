"use server";

import { createClient } from "@/lib/supabase/server";

export async function sendMessage(content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: member } = await supabase.from("members").select("id").eq("user_id", user.id).single();
  if (!member) throw new Error("Member profile not found");

  if (!content.trim()) throw new Error("Message cannot be empty");

  const { error } = await supabase.from("messages").insert({
    sender_id: member.id,
    content: content.trim(),
  });

  if (error) {
    console.error("Error sending message:", error);
    throw new Error(error.message);
  }

  // We don't need revalidatePath because this is realtime, but we can do it just in case
  // revalidatePath("/dashboard/chat");
  return { success: true };
}
