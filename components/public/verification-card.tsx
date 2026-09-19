import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert, MapPin, Building2, Calendar, FileKey, XCircle } from "lucide-react";

interface VerificationCardProps {
  member: {
    first_name: string;
    last_name: string;
    membership_number: string | null;
    chapter_name: string | null;
    region_name: string | null;
    batch: string | null;
    status: string;
  };
}

export function VerificationCard({ member }: VerificationCardProps) {
  const isActive = member.status === 'active';
  const isSuspended = member.status === 'suspended';
  const isPending = member.status === 'pending';

  return (
    <div className="w-full max-w-md mx-auto relative overflow-hidden rounded-2xl border border-onyx-line shadow-2xl bg-onyx-raised">
      {/* Dynamic Header Banner */}
      <div className={`h-32 relative flex items-center justify-center
        ${isActive ? 'bg-gradient-to-br from-green-900 to-green-950 border-b border-green-500/30' : ''}
        ${isSuspended ? 'bg-gradient-to-br from-red-900 to-red-950 border-b border-red-500/30' : ''}
        ${!isActive && !isSuspended ? 'bg-gradient-to-br from-yellow-900 to-yellow-950 border-b border-yellow-500/30' : ''}
      `}>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        {isActive && <ShieldCheck className="w-16 h-16 text-green-500 relative z-10 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />}
        {isSuspended && <XCircle className="w-16 h-16 text-red-500 relative z-10 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />}
        {(!isActive && !isSuspended) && <ShieldAlert className="w-16 h-16 text-yellow-500 relative z-10 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />}
      </div>

      <div className="px-6 pb-8 pt-6 relative">
        <div className="absolute -top-10 right-6 w-16 h-16 overflow-hidden rounded-full shadow-emboss border-4 border-onyx-raised bg-onyx">
          <Image
            src="/zeta-psi-omicron-seal.png"
            alt="Zeta Psi Omicron Seal"
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mb-2">
          <Badge 
            variant="default" 
            className={`
              text-xs tracking-widest uppercase border 
              ${isActive ? 'border-green-500/50 text-green-500 bg-green-500/10' : ''}
              ${isSuspended ? 'border-red-500/50 text-red-500 bg-red-500/10' : ''}
              ${!isActive && !isSuspended ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10' : ''}
            `}
          >
            {isActive ? 'Verified Active' : member.status.toUpperCase()}
          </Badge>
        </div>

        <h1 className="font-display text-2xl text-parchment mt-2">
          {member.first_name} {member.last_name}
        </h1>

        <div className="mt-6 space-y-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-parchment-muted mb-1 flex items-center gap-1.5">
              <FileKey className="w-3 h-3" /> Membership Number
            </span>
            <span className="font-mono text-lg text-gold tracking-wider">
              {member.membership_number || "PENDING"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-onyx-line">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-parchment-muted mb-1 flex items-center gap-1.5">
                <Building2 className="w-3 h-3" /> Chapter
              </span>
              <span className="text-sm font-medium text-parchment">
                {member.chapter_name || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-parchment-muted mb-1 flex items-center gap-1.5">
                <MapPin className="w-3 h-3" /> Region
              </span>
              <span className="text-sm font-medium text-parchment">
                {member.region_name || "N/A"}
              </span>
            </div>
          </div>

          <div className="flex flex-col pt-4 border-t border-onyx-line">
            <span className="text-[10px] uppercase tracking-widest text-parchment-muted mb-1 flex items-center gap-1.5">
              <Calendar className="w-3 h-3" /> Batch Name
            </span>
            <span className="text-sm font-medium text-parchment">
              {member.batch || "N/A"}
            </span>
          </div>
        </div>

      </div>

      <div className="bg-onyx p-4 text-center border-t border-onyx-line">
        <p className="text-[10px] tracking-widest uppercase text-parchment-muted">
          Official National MIS Record
        </p>
      </div>
    </div>
  );
}
