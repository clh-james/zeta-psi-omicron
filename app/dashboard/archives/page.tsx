import { createClient } from "@/lib/supabase/server";
import { ArchivesManager } from "@/components/dashboard/archives-manager";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ArchivesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get current user role to pass to the client component for UI logic
  const { data: userProfile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = userProfile?.role || 'member';

  // Fetch documents. RLS policies will automatically filter out 'officers_only' docs if the user is a normal member.
  const { data: documents } = await supabase
    .from("archives")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-gold">The Archives</h1>
        <p className="text-sm text-parchment-muted">
          Access official fraternity documents, constitution, bylaws, and meeting minutes.
        </p>
      </div>

      <ArchivesManager 
        documents={documents || []} 
        role={role}
      />
    </div>
  );
}
