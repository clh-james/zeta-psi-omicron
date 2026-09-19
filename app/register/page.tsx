import { createServiceRoleClient } from "@/lib/supabase/server";
import { BiodataForm } from "@/components/biodata/biodata-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default async function RegisterPage() {
  const supabase = createServiceRoleClient();

  const [{ data: chapters }, { data: regions }] = await Promise.all([
    supabase.from("chapters").select("id, name").eq("is_active", true).order("name"),
    supabase.from("regions").select("id, name").order("name"),
  ]);

  return (
    <main className="min-h-screen bg-onyx px-4 py-12 relative">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <Link href="/">
          <Button variant="ghost" className="text-parchment-muted hover:text-gold hover:bg-onyx-raised">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </Link>
      </div>
      <BiodataForm chapters={chapters ?? []} regions={regions ?? []} />
    </main>
  );
}
