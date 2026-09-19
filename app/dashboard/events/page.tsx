import { createClient } from "@/lib/supabase/server";
import { EventsManager } from "@/components/dashboard/events-manager";

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  let canManage = false;
  if (userData?.user) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", userData.user.id)
      .single();
    canManage = ["super_admin", "national_officer", "regional_officer", "chapter_officer"].includes(profile?.role || "");
  }

  // Fetch upcoming events
  const { data: rawEvents } = await supabase
    .from("events")
    .select(`
      id, title, description, location, starts_at, ends_at, audience_scope,
      regions(name), chapters(name), users(username)
    `)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });

  const events = (rawEvents || []).map((e: any) => ({
    id: e.id,
    title: e.title,
    description: e.description,
    location: e.location,
    starts_at: e.starts_at,
    ends_at: e.ends_at,
    audience_scope: e.audience_scope,
    region_name: e.regions?.name,
    chapter_name: e.chapters?.name,
    author_name: e.users?.username || "Admin",
  }));

  // Fetch reference data for the form
  const { data: regions } = await supabase.from("regions").select("id, name").order("name");
  const { data: chapters } = await supabase.from("chapters").select("id, name").order("name");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl text-gold">Events</h1>
        <p className="text-sm text-parchment-muted">Schedule and manage fraternity events.</p>
      </div>
      
      <EventsManager 
        events={events} 
        regions={regions || []} 
        chapters={chapters || []} 
        canManage={canManage} 
      />
    </div>
  );
}
