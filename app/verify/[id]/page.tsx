import { createServiceRoleClient } from "@/lib/supabase/server";
import { VerificationCard } from "@/components/public/verification-card";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // We use the service role client here because this is a PUBLIC route
  // The 'members' table has RLS that prevents unauthenticated users from reading it.
  // We bypass RLS to fetch ONLY the non-sensitive fields required for verification.
  const supabase = createServiceRoleClient();

  // Validate that the ID is a valid UUID before querying
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(id)) {
    return <NotFoundState />;
  }

  const { data: member, error } = await supabase
    .from("members")
    .select(`
      first_name, 
      last_name, 
      membership_number, 
      batch, 
      status, 
      chapters ( name ), 
      regions ( name )
    `)
    .eq("id", id)
    .single();

  if (error || !member) {
    return <NotFoundState />;
  }

  const formattedMember = {
    first_name: member.first_name,
    last_name: member.last_name,
    membership_number: member.membership_number,
    batch: member.batch,
    status: member.status,
    chapter_name: (member.chapters as any)?.name ?? null,
    region_name: (member.regions as any)?.name ?? null,
  };

  return (
    <div className="min-h-screen bg-onyx flex flex-col p-4 sm:p-8">
      <div className="flex-1 flex flex-col justify-center items-center max-w-lg w-full mx-auto space-y-8">
        
        {/* Branding */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 relative opacity-50">
              <Image 
                src="/zeta-psi-omicron-seal.png" 
                alt="Seal" 
                fill 
                className="object-contain grayscale"
              />
            </div>
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-parchment-muted font-semibold">
            Official Verification Portal
          </p>
        </div>

        {/* Card */}
        <VerificationCard member={formattedMember} />

        <div className="text-center">
          <Link href="/" className="text-xs text-gold/60 hover:text-gold transition-colors underline underline-offset-4">
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="min-h-screen bg-onyx flex flex-col justify-center items-center p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-red-900/20 border border-red-500/30 flex items-center justify-center mb-6">
        <ShieldAlert className="w-10 h-10 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
      </div>
      <h1 className="font-display text-3xl text-parchment mb-2">Record Not Found</h1>
      <p className="text-parchment-muted max-w-md mx-auto mb-8">
        The ID scanned is not registered in the National Member Information System, or the record has been permanently deleted.
      </p>
      <Link href="/" className="text-sm text-gold hover:text-gold-muted uppercase tracking-widest font-semibold">
        Return Home
      </Link>
    </div>
  );
}
