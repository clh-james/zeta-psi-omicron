import { createClient } from "@/lib/supabase/server";
import { AnnouncementsManager } from "@/components/dashboard/announcements-manager";
import { requireRole } from "@/lib/rbac";

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  const { profile } = await requireRole(["super_admin", "national_officer", "regional_officer", "chapter_officer", "member"]);
  const canManage = ["super_admin", "national_officer", "regional_officer", "chapter_officer"].includes(profile?.role || "");

  // Fetch announcements
  const { data: rawAnnouncements } = await supabase
    .from("announcements")
    .select(`
      id, title, body, audience_scope, published_at, is_pinned,
      regions(name), chapters(name), users(username)
    `)
    .order("published_at", { ascending: false });

  const announcements = (rawAnnouncements || []).map((a: any) => ({
    id: a.id,
    title: a.title,
    body: a.body,
    audience_scope: a.audience_scope,
    region_name: a.regions?.name,
    chapter_name: a.chapters?.name,
    published_at: a.published_at,
    is_pinned: a.is_pinned,
    author_name: a.users?.username || "Admin",
  }));

  // Fetch reference data for the form
  const { data: regions } = await supabase.from("regions").select("id, name").order("name");
  const { data: chapters } = await supabase.from("chapters").select("id, name").order("name");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl text-gold">Announcements</h1>
        <p className="text-sm text-parchment-muted">Manage and view fraternity broadcasts.</p>
      </div>
      
      <AnnouncementsManager 
        announcements={announcements} 
        regions={regions || []} 
        chapters={chapters || []} 
        canManage={canManage} 
      />
    </div>
  );
}
