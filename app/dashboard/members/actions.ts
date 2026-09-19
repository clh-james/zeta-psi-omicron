"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendMembershipApprovedEmail, sendMembershipRejectedEmail } from "@/lib/email";

export async function approveMember(memberId: string, chapterId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: membershipNumber } = await supabase.rpc("generate_membership_number", {
    p_chapter_id: chapterId,
  });

  const { error } = await supabase
    .from("members")
    .update({
      registration_status: "approved",
      membership_number: membershipNumber,
      approved_by: user?.id,
      approved_at: new Date().toISOString(),
    })
    .eq("id", memberId);

  await supabase.from("activity_logs").insert({
    user_id: user?.id,
    action: "member.approve",
    target_table: "members",
    target_id: memberId,
  });

  const { data: member } = await supabase
    .from("members")
    .select("user_id, first_name, last_name, email")
    .eq("id", memberId)
    .single();

  if (member?.user_id) {
    await supabase.from("notifications").insert({
      user_id: member.user_id,
      type: "approval",
      title: "Membership Approved",
      body: "Congratulations! Your membership registration has been approved by the National Council. You now have full access to the National MIS.",
    });

    if (member.email) {
      await sendMembershipApprovedEmail(
        member.email, 
        `${member.first_name} ${member.last_name}`, 
        membershipNumber || ""
      );
    }
  }

  revalidatePath("/dashboard/members");
  return { ok: !error, error: error?.message };
}

export async function rejectMember(memberId: string, reason: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: member } = await supabase
    .from("members")
    .select("user_id, first_name, last_name, email")
    .eq("id", memberId)
    .single();

  const { error } = await supabase
    .from("members")
    .update({ registration_status: "rejected", rejected_reason: reason })
    .eq("id", memberId);

  await supabase.from("activity_logs").insert({
    user_id: user?.id,
    action: "member.reject",
    target_table: "members",
    target_id: memberId,
    metadata: { reason },
  });

  if (member?.user_id) {
    await supabase.from("notifications").insert({
      user_id: member.user_id,
      type: "rejection",
      title: "Registration Update",
      body: `Your membership registration was rejected. Reason: ${reason}. Please contact your chapter officer for more details.`,
    });

    if (member.email) {
      await sendMembershipRejectedEmail(
        member.email,
        `${member.first_name} ${member.last_name}`,
        reason
      );
    }
  }

  revalidatePath("/dashboard/members");
  return { ok: !error, error: error?.message };
}

export async function suspendMember(memberId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("members")
    .update({ status: "suspended" })
    .eq("id", memberId);
  revalidatePath("/dashboard/members");
  return { ok: !error, error: error?.message };
}

export async function restoreMember(memberId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("members")
    .update({ status: "active" })
    .eq("id", memberId);
  revalidatePath("/dashboard/members");
  return { ok: !error, error: error?.message };
}
