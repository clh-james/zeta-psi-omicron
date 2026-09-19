import { createClient } from "@/lib/supabase/server";
import { OrganizationsManager } from "@/components/dashboard/organizations-manager";
import { requireRole } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function ChaptersAndRegionsPage() {
  const supabase = await createClient();
  await requireRole(["super_admin", "national_officer", "regional_officer"]);

  // Fetch Regions with member count
  const { data: regionsData } = await supabase
    .from("regions")
    .select(`id, name, members(count)`)
    .order("name");

  const regions = (regionsData || []).map((r: any) => ({
    id: r.id,
    name: r.name,
    member_count: r.members?.[0]?.count ?? 0,
  }));

  // Fetch Chapters with region name and member count
  const { data: chaptersData } = await supabase
    .from("chapters")
    .select(`id, name, region_id, regions(name), members(count)`)
    .order("name");

  const chapters = (chaptersData || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    region_id: c.region_id,
    region_name: c.regions?.name ?? "Unknown",
    member_count: c.members?.[0]?.count ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl text-gold">Chapters & Regions</h1>
        <p className="text-sm text-parchment-muted">
          Manage the organizational hierarchy of the fraternity.
        </p>
      </div>

      <OrganizationsManager regions={regions} chapters={chapters} />
    </div>
  );
}
