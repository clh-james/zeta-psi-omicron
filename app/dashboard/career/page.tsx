import { createClient } from "@/lib/supabase/server";
import { CareerManager } from "@/components/dashboard/career-manager";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CareerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get current member ID
  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("user_id", user.id)
    .single();

  // Fetch Jobs
  const { data: jobs } = await supabase
    .from("job_postings")
    .select(`
      *,
      poster:members (first_name, last_name)
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // Fetch Mentors
  const { data: mentors } = await supabase
    .from("mentorship_offers")
    .select(`
      *,
      member:members (first_name, last_name, profession, occupation, email)
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-gold">Career & Mentorship</h1>
        <p className="text-sm text-parchment-muted">
          Connect with brothers, explore job opportunities, and offer guidance.
        </p>
      </div>

      <CareerManager 
        jobs={jobs || []} 
        mentors={mentors || []} 
        currentMemberId={member?.id} 
      />
    </div>
  );
}
