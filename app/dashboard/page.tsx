import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MembersByRegionChart, StatusBreakdownChart } from "@/components/dashboard/overview-charts";
import { Users, UserCheck, UserX, Clock, TrendingUp, Megaphone } from "lucide-react";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

async function getStats() {
  const supabase = createServiceRoleClient();

  const results = await Promise.all([
    supabase.from("members").select("*", { count: "exact", head: true }),
    supabase.from("members").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("members").select("*", { count: "exact", head: true }).eq("status", "inactive"),
    supabase
      .from("members")
      .select("*", { count: "exact", head: true })
      .eq("registration_status", "pending"),
    supabase
      .from("members")
      .select("*", { count: "exact", head: true })
      .gte("created_at", new Date(new Date().setDate(1)).toISOString()),
    supabase
      .from("members")
      .select("id, first_name, last_name, chapter_id, status, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase.from("regions").select("name, members:members(count)"),
    supabase.from("members").select("status"),
    supabase
      .from("announcements")
      .select("id, title, body, published_at")
      .eq("is_pinned", true)
      .order("published_at", { ascending: false })
      .limit(3),
  ]);

  results.forEach((res, i) => {
    if (res.error) console.error(`Query ${i} error:`, res.error);
  });

  const [
    { count: total },
    { count: active },
    { count: inactive },
    { count: pending },
    { count: newThisMonth },
    { data: recent },
    { data: regionRows },
    { data: statusRows },
    { data: pinnedAnnouncements },
  ] = results;

  const regionData =
    regionRows?.map((r: any) => ({
      region: r.name,
      members: r.members?.[0]?.count ?? 0,
    })) ?? [];

  const statusCounts: Record<string, number> = {};
  statusRows?.forEach((r: any) => {
    statusCounts[r.status] = (statusCounts[r.status] ?? 0) + 1;
  });
  const statusData = Object.entries(statusCounts).map(([status, value]) => ({ status, value }));

  return {
    total: total ?? 0,
    active: active ?? 0,
    inactive: inactive ?? 0,
    pending: pending ?? 0,
    newThisMonth: newThisMonth ?? 0,
    recent: recent ?? [],
    regionData,
    statusData,
    pinnedAnnouncements: pinnedAnnouncements ?? [],
  };
}

export default async function DashboardOverview() {
  const stats = await getStats();

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
        <p className="text-xs uppercase tracking-[0.3em] text-parchment-muted">
          One Brotherhood. One Database. One Nation.
        </p>
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

      {stats.pinnedAnnouncements.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-gold" />
            <h2 className="font-display text-xl text-gold">Important Announcements</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stats.pinnedAnnouncements.map((announcement: any) => (
              <Card key={announcement.id} className="border-gold/30 bg-gold/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gold/10 rounded-bl-full" />
                <CardHeader className="pb-2 relative z-10">
                  <Badge variant="secondary" className="w-max border-gold/50 text-gold mb-2 bg-transparent">📌 Pinned</Badge>
                  <CardTitle className="text-lg text-parchment leading-tight">{announcement.title}</CardTitle>
                  <CardDescription className="text-xs text-parchment-muted">
                    {new Date(announcement.published_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-sm text-parchment/80 line-clamp-3">{announcement.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

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
            {stats.recent.length === 0 && (
              <p className="py-4 text-sm text-parchment-muted">No members yet.</p>
            )}
            {stats.recent.map((m: any) => (
              <div key={m.id} className="flex items-center justify-between py-3">
                <p className="text-sm text-parchment">
                  {m.first_name} {m.last_name}
                </p>
                <Badge variant={m.status}>{m.status.replace("_", " ")}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
