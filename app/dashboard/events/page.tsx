import { createClient } from "@/lib/supabase/server";
import { EventsManager } from "@/components/dashboard/events-manager";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get current member
  const { data: member } = await supabase
    .from("members")
    .select(`
      id,
      chapter_id,
      chapter:chapters(region),
      user:users(role)
    `)
    .eq("user_id", user.id)
    .single();

  let role = 'member';
  let memberId = '';

  if (member) {
    const userRecord = Array.isArray(member.user) ? member.user[0] : member.user;
    role = userRecord?.role || 'member';
    memberId = member.id;
  } else {
    // Fallback: Check if they are just an admin without a member profile
    const { data: userProfile } = await supabase.from("users").select("role").eq("id", user.id).single();
    if (userProfile) {
      role = userProfile.role;
    } else {
      return <div className="p-8 text-parchment">Profile not found.</div>;
    }
  }

  // Fetch events based on visibility logic.
  // We'll fetch all events for now, and filter them here based on the member's details.
  // (In a full production setup, RLS policies would handle this automatically if configured with specific target_chapter matching, but we fetch all they have access to read via RLS).
  const { data: events } = await supabase
    .from("events")
    .select(`
      *,
      organizer:members (first_name, last_name),
      event_rsvps (*)
    `)
    .order("event_date", { ascending: true });

  // Filter out past events
  const upcomingEvents = (events || []).filter(e => new Date(e.event_date) >= new Date());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-gold">Events & Calendar</h1>
        <p className="text-sm text-parchment-muted">
          Discover and RSVP to upcoming national, regional, and chapter events.
        </p>
      </div>

      <EventsManager 
        events={upcomingEvents} 
        currentMemberId={memberId} 
        role={role}
      />
    </div>
  );
}
