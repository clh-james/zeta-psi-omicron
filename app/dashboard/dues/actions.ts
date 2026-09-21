"use server";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createDue(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const dueDate = formData.get("due_date") as string;
  const audienceScope = formData.get("audience_scope") as string || "national";

  const { error } = await supabase.from("dues").insert({
    title,
    description,
    amount,
    due_date: dueDate,
    audience_scope: audienceScope,
    created_by: user.id
  });

  if (error) {
    console.error("Error creating due:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/dues");
  return { success: true };
}

export async function verifyPayment(paymentId: string, status: "verified" | "rejected", notes?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("payments").update({
    status,
    notes,
    verified_by: user.id,
    verified_at: new Date().toISOString()
  }).eq("id", paymentId);

  if (error) {
    console.error("Error verifying payment:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/dues");
  return { success: true };
}

export async function submitPaymentProof(dueId: string, referenceNumber: string, proofUrl: string, amount: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get member ID for the current user
  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!member) throw new Error("Member profile not found");

  const { error } = await supabase.from("payments").insert({
    due_id: dueId,
    member_id: member.id,
    amount: amount,
    status: "pending",
    proof_file_url: proofUrl,
    reference_number: referenceNumber
  });

  if (error) {
    console.error("Error submitting payment proof:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/dues");
  return { success: true };
}
