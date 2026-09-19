import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Search, Building2, MapPin } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function DirectoryPage({ searchParams }: { searchParams: { q?: string } }) {
  const supabase = await createClient();
  const query = searchParams.q || "";

  // The directory is strictly restricted to authenticated users (RLS handles this)
  let dbQuery = supabase
    .from("members")
    .select("id, first_name, last_name, batch, chapters(name), regions(name)")
    .eq("status", "active") // Only show active members in the public directory
    .order("last_name", { ascending: true });

  if (query) {
    dbQuery = dbQuery.or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%`);
  }

  const { data: members } = await dbQuery.limit(50);

  return (
    <div className="space-y-6">
      <div className="card-surface bg-seal-radial p-8 border border-onyx-line relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <div className="flex items-center gap-2 bg-gold/10 text-gold px-3 py-1 rounded border border-gold/30">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-xs uppercase tracking-widest font-bold">Secure Directory</span>
          </div>
        </div>
        <h1 className="font-display text-3xl text-gold uppercase tracking-widest mb-2">National Directory</h1>
        <p className="text-parchment-muted text-sm max-w-2xl">
          Search for authenticated brothers nationwide. For privacy and security, sensitive contact information is hidden. Only active members are displayed.
        </p>
      </div>

      <Card className="bg-onyx border-onyx-line">
        <CardHeader>
          <form className="relative flex items-center w-full max-w-md">
            <Search className="absolute left-3 h-5 w-5 text-parchment-muted" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by name..."
              className="w-full bg-onyx-raised border border-onyx-line rounded py-2 pl-10 pr-4 text-parchment focus:border-gold outline-none"
            />
            <button type="submit" className="hidden">Search</button>
          </form>
        </CardHeader>
        <CardContent>
          {members && members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member: any) => (
                <div key={member.id} className="bg-onyx-raised border border-onyx-line rounded-lg p-4 hover:border-gold/50 transition-colors flex items-start gap-4">
                  <div className="h-12 w-12 rounded bg-onyx flex items-center justify-center border border-onyx-line/50 shrink-0 shadow-emboss">
                    <span className="font-display text-gold text-lg uppercase">
                      {member.first_name?.[0]}{member.last_name?.[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-parchment truncate text-sm">
                      {member.first_name} {member.last_name}
                    </h3>
                    <p className="text-xs text-gold uppercase tracking-widest font-bold mt-1 mb-2">
                      {member.batch || "Unknown Batch"}
                    </p>
                    <div className="space-y-1">
                      {member.chapters?.name && (
                        <p className="text-xs text-parchment-muted flex items-center gap-1">
                          <Building2 className="h-3 w-3" /> {member.chapters.name}
                        </p>
                      )}
                      {member.regions?.name && (
                        <p className="text-xs text-parchment-muted flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {member.regions.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-parchment-muted">No members found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
