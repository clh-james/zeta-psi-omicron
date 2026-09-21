import { createClient } from "@/lib/supabase/server";
import { DuesManager } from "@/components/dashboard/dues-manager";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DuesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "member";
  const isAdmin = ["super_admin", "national_officer", "regional_officer", "chapter_officer"].includes(role);

  // Fetch dues (we could filter by scope if regional/chapter, but for now we fetch all national dues)
  const { data: dues } = await supabase
    .from("dues")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch payments
  let payments: any[] = [];
  if (isAdmin) {
    const { data: allPayments } = await supabase
      .from("payments")
      .select(`
        *,
        due:dues(title)
      `)
      .order("created_at", { ascending: false });
    payments = allPayments || [];
  } else {
    // For members, we need their member_id
    const { data: memberProfile } = await supabase
      .from("members")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (memberProfile) {
      const { data: myPayments } = await supabase
        .from("payments")
        .select("*")
        .eq("member_id", memberProfile.id);
      payments = myPayments || [];
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-gold">Fraternity Dues & Payments</h1>
        <p className="text-sm text-parchment-muted">
          {isAdmin ? "Manage membership dues and verify payments." : "View your outstanding dues and submit payment proofs."}
        </p>
      </div>

      <DuesManager 
        role={role} 
        dues={dues || []} 
        payments={payments} 
      />
    </div>
  );
}
