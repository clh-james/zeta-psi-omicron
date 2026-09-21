import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { IdCardView } from "@/components/dashboard/id-card-view";

export const dynamic = "force-dynamic";

export default async function IdCardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get current member
  const { data: member } = await supabase
    .from("members")
    .select(`
      *,
      chapter:chapters(name)
    `)
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return (
      <div className="p-8 text-center text-parchment-muted">
        <h2 className="text-xl font-display text-gold mb-2">Profile Not Found</h2>
        <p>You must have an official Member profile linked to this account to view a Digital ID.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl text-gold">Digital Member ID</h1>
        <p className="text-sm text-parchment-muted">
          Your official digital identification card. Active members can download this for offline verification.
        </p>
      </div>

      <IdCardView member={member} />
    </div>
  );
}
