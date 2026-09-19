import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MembersByRegionChart, StatusBreakdownChart } from "@/components/dashboard/overview-charts";
import { Users, UserCheck, UserX, Clock, TrendingUp, Megaphone, FileText, Settings, BookOpen, Calendar, MapPin, Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// --- Admin Data Fetching ---
async function getAdminStats() {
  const supabase = createServiceRoleClient();

  const results = await Promise.all([
    supabase.from("members").select("*", { count: "exact", head: true }),
    supabase.from("members").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("members").select("*", { count: "exact", head: true }).eq("status", "inactive"),
    supabase.from("members").select("*", { count: "exact", head: true }).eq("registration_status", "pending"),
    supabase.from("members").select("*", { count: "exact", head: true }).gte("created_at", new Date(new Date().setDate(1)).toISOString()),
    supabase.from("members").select("id, first_name, last_name, chapter_id, status, created_at").order("created_at", { ascending: false }).limit(6),
    supabase.from("regions").select("name, members:members(count)"),
    supabase.from("members").select("status"),
    supabase.from("announcements").select("id, title, body, published_at").eq("is_pinned", true).order("published_at", { ascending: false }).limit(3),
  ]);

  results.forEach((res, i) => { if (res.error) console.error(`Query ${i} error:`, res.error); });

  const [
    { count: total }, { count: active }, { count: inactive }, { count: pending }, { count: newThisMonth },
    { data: recent }, { data: regionRows }, { data: statusRows }, { data: pinnedAnnouncements },
  ] = results;

  const regionData = regionRows?.map((r: any) => ({ region: r.name, members: r.members?.[0]?.count ?? 0 })) ?? [];
  const statusCounts: Record<string, number> = {};
  statusRows?.forEach((r: any) => { statusCounts[r.status] = (statusCounts[r.status] ?? 0) + 1; });
  const statusData = Object.entries(statusCounts).map(([status, value]) => ({ status, value }));

  return { total: total ?? 0, active: active ?? 0, inactive: inactive ?? 0, pending: pending ?? 0, newThisMonth: newThisMonth ?? 0, recent: recent ?? [], regionData, statusData, pinnedAnnouncements: pinnedAnnouncements ?? [] };
}

// --- Admin Dashboard Component ---
function AdminDashboard({ stats }: { stats: any }) {
  const kpis = [
    { label: "Total Members", value: stats.total, icon: Users },
    { label: "Active Members", value: stats.active, icon: UserCheck },
    { label: "Inactive Members", value: stats.inactive, icon: UserX },
    { label: "Pending Approval", value: stats.pending, icon: Clock },
    { label: "New This Month", value: stats.newThisMonth, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="card-surface bg-seal-radial p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-parchment-muted">Administrative Portal</p>
        <h1 className="mt-1 font-display text-2xl text-gold">National Overview</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="seal-badge h-10 w-10">
                <Icon className="h-5 w-5 text-gold" />
              </div>
              <p className="font-display text-2xl text-parchment mt-2">{value}</p>
              <p className="text-xs text-parchment-muted">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <MembersByRegionChart data={stats.regionData} />
        <StatusBreakdownChart data={stats.statusData} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recently Added Members</CardTitle>
          <CardDescription>Latest BioData submissions across all chapters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-onyx-line">
            {stats.recent.length === 0 && <p className="py-4 text-sm text-parchment-muted">No members yet.</p>}
            {stats.recent.map((m: any) => (
              <div key={m.id} className="flex items-center justify-between py-3">
                <p className="text-sm text-parchment">{m.first_name} {m.last_name}</p>
                <Badge variant={m.status}>{m.status.replace("_", " ")}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Member Data Fetching ---
async function getMemberData(userId: string) {
  const supabase = await createClient();
  const { data: member } = await supabase.from("members").select("*, chapter:chapters(name)").eq("user_id", userId).single();
  const { data: announcements } = await supabase.from("announcements").select("*").order("published_at", { ascending: false }).limit(3);
  const { data: events } = await supabase.from("events").select("*").gte("starts_at", new Date().toISOString()).order("starts_at", { ascending: true }).limit(3);
  
  // Calculate profile completion
  let completed = 0;
  const fields = ["first_name", "last_name", "birth_date", "mobile_number", "email", "chapter_id", "batch", "emergency_contact_name"];
  fields.forEach(f => { if (member && member[f as keyof typeof member]) completed++; });
  const completionPercent = member ? Math.round((completed / fields.length) * 100) : 0;

  return { member, announcements: announcements ?? [], events: events ?? [], completionPercent };
}

// --- Member Dashboard Component ---
function MemberDashboard({ username, data }: { username: string, data: any }) {
  return (
    <div className="space-y-6">
      <div className="card-surface bg-seal-radial p-8 border border-onyx-line">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-parchment-muted mb-2">Member Portal</p>
            <h1 className="font-display text-3xl sm:text-4xl text-parchment font-bold mb-2">Welcome, Brother {data.member?.first_name || username}!</h1>
            {data.member?.chapter?.name && (
              <p className="text-gold flex items-center gap-2 text-sm font-bold tracking-widest uppercase">
                <Building2 className="h-4 w-4" /> {data.member.chapter.name} Chapter
              </p>
            )}
          </div>
          <div className="w-full md:w-64 bg-onyx p-4 rounded-lg border border-onyx-line">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-parchment-muted uppercase tracking-widest">Profile Completion</span>
              <span className="text-xs text-gold font-bold">{data.completionPercent}%</span>
            </div>
            <div className="w-full bg-onyx-raised h-2 rounded-full overflow-hidden">
              <div className="bg-gold h-full transition-all duration-1000" style={{ width: `${data.completionPercent}%` }}></div>
            </div>
            {data.completionPercent < 100 && (
              <Link href="/dashboard/members" className="block mt-3 text-xs text-center text-gold hover:underline">Complete your biodata &rarr;</Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/dashboard/members" className="card-surface p-6 flex flex-col items-center justify-center text-center hover:border-gold/50 transition-colors group">
          <FileText className="h-8 w-8 text-gold mb-3 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold text-parchment uppercase tracking-wider">My Biodata</span>
        </Link>
        <Link href="/dashboard/directory" className="card-surface p-6 flex flex-col items-center justify-center text-center hover:border-gold/50 transition-colors group">
          <BookOpen className="h-8 w-8 text-gold mb-3 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold text-parchment uppercase tracking-wider">Directory</span>
        </Link>
        <Link href="/dashboard/chapters" className="card-surface p-6 flex flex-col items-center justify-center text-center hover:border-gold/50 transition-colors group">
          <Building2 className="h-8 w-8 text-gold mb-3 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold text-parchment uppercase tracking-wider">Chapters</span>
        </Link>
        <Link href="/dashboard/settings" className="card-surface p-6 flex flex-col items-center justify-center text-center hover:border-gold/50 transition-colors group">
          <Settings className="h-8 w-8 text-gold mb-3 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold text-parchment uppercase tracking-wider">Settings</span>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-onyx-line">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gold"><Megaphone className="h-5 w-5" /> Latest Announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.announcements.length === 0 ? (
              <p className="text-sm text-parchment-muted">No recent announcements.</p>
            ) : (
              data.announcements.map((a: any) => (
                <div key={a.id} className="border-l-2 border-gold/50 pl-4 py-1">
                  <h4 className="text-sm font-bold text-parchment mb-1">{a.title}</h4>
                  <p className="text-xs text-parchment-muted mb-2">{new Date(a.published_at).toLocaleDateString()}</p>
                  <p className="text-sm text-parchment-muted line-clamp-2">{a.body}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-onyx-line">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gold"><Calendar className="h-5 w-5" /> Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.events.length === 0 ? (
              <p className="text-sm text-parchment-muted">No upcoming events scheduled.</p>
            ) : (
              data.events.map((e: any) => (
                <div key={e.id} className="flex gap-4 p-3 bg-onyx rounded border border-onyx-line">
                  <div className="bg-onyx-raised p-2 rounded text-center min-w-[60px] border border-onyx-line/50">
                    <span className="block text-xs text-gold uppercase font-bold">{new Date(e.starts_at).toLocaleString('default', { month: 'short' })}</span>
                    <span className="block text-xl font-display text-parchment">{new Date(e.starts_at).getDate()}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-parchment mb-1">{e.title}</h4>
                    <p className="text-xs text-parchment-muted mb-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.location}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("users").select("username, role").eq("id", user.id).single();
  const role = profile?.role ?? "member";

  if (role === "super_admin" || role === "national_officer" || role === "regional_officer") {
    const stats = await getAdminStats();
    return <AdminDashboard stats={stats} />;
  } else {
    const data = await getMemberData(user.id);
    return <MemberDashboard username={profile?.username || user.email} data={data} />;
  }
}
