import { createServiceRoleClient } from "@/lib/supabase/server";
import { ReportsCharts } from "@/components/dashboard/reports-charts";
import { Users } from "lucide-react";
import { requireRole } from "@/lib/rbac";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function ReportsPage() {
  await requireRole(["super_admin", "national_officer", "regional_officer", "chapter_officer"]);
  const supabase = createServiceRoleClient();

  // Fetch all members with their region name
  const { data: members } = await supabase
    .from("members")
    .select("status, regions(name)");

  const membersList = members ?? [];

  // Calculate total
  const totalMembers = membersList.length;

  // Aggregate by Status
  const statusCounts = membersList.reduce((acc, m) => {
    const s = m.status === "active" ? "Active" : m.status === "suspended" ? "Suspended" : "Pending";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = [
    { name: "Active", value: statusCounts["Active"] || 0 },
    { name: "Pending", value: statusCounts["Pending"] || 0 },
    { name: "Suspended", value: statusCounts["Suspended"] || 0 },
  ];

  // Aggregate by Region
  const regionCounts = membersList.reduce((acc, m) => {
    const regions = m.regions as any;
    const rName = (Array.isArray(regions) ? regions[0]?.name : regions?.name) ?? "Unknown";
    acc[rName] = (acc[rName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const regionData = Object.entries(regionCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl text-gold">Reports & Analytics</h1>
        <p className="text-sm text-parchment-muted">
          Visualize fraternity membership statistics across chapters and regions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-surface p-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-wider text-parchment-muted">Total Members</p>
            <p className="text-2xl font-bold text-parchment">{totalMembers}</p>
          </div>
        </div>
      </div>

      <ReportsCharts statusData={statusData} regionData={regionData} />
    </div>
  );
}
