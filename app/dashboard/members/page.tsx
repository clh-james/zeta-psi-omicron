import { createClient } from "@/lib/supabase/server";
import { MemberDirectory, type MemberRow } from "@/components/dashboard/member-directory";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("members")
    .select(
      `id, first_name, last_name, membership_number, batch, status, registration_status,
       chapter_id, chapters ( name ), regions ( name )`
    )
    .order("created_at", { ascending: false });

  const rows: MemberRow[] = (data ?? []).map((m: any) => ({
    id: m.id,
    first_name: m.first_name,
    last_name: m.last_name,
    membership_number: m.membership_number,
    chapter_id: m.chapter_id,
    chapter_name: m.chapters?.name,
    region_name: m.regions?.name,
    batch: m.batch,
    status: m.status,
    registration_status: m.registration_status,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-gold">Member Directory</h1>
          <p className="text-sm text-parchment-muted">Manage all registered brothers and applicants.</p>
        </div>
        <Link href="/register">
          <Button variant="gold" size="sm" className="h-9">
            <Plus className="w-4 h-4 mr-2" /> Add Member
          </Button>
        </Link>
      </div>
      <MemberDirectory members={rows} />
    </div>
  );
}
