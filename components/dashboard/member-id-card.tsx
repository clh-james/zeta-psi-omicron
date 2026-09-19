"use client";

import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useState, useEffect } from "react";
import * as htmlToImage from "html-to-image";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MemberIDCardProps {
  member: {
    id: string;
    first_name: string;
    last_name: string;
    membership_number: string | null;
    chapter_name: string | null;
    region_name: string | null;
  };
}

export function MemberIDCard({ member }: MemberIDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [verificationUrl, setVerificationUrl] = useState(`https://zepsom.com/verify/${member.id}`);

  useEffect(() => {
    setVerificationUrl(`${window.location.origin}/verify/${member.id}`);
  }, [member.id]);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      // Generate image at 2x scale for better print quality
      const dataUrl = await htmlToImage.toPng(cardRef.current, { 
        pixelRatio: 2,
        backgroundColor: '#1E1E24' // Onyx color to match the border
      });
      
      const link = document.createElement("a");
      link.download = `ZPO_ID_${member.first_name}_${member.last_name}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export ID card", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        ref={cardRef}
        className="relative w-[340px] h-[540px] overflow-hidden rounded-xl border-2 border-gold/40 bg-onyx shadow-2xl shrink-0"
      >
        {/* Background styling elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-onyx-raised to-onyx opacity-50" />
        <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-gold/5 blur-3xl" />

        {/* Card Content */}
        <div className="relative flex h-full flex-col p-6">
          
          {/* Header */}
          <div className="flex flex-col items-center border-b border-gold/20 pb-4 text-center">
            <div className="h-16 w-16 overflow-hidden rounded-full shadow-emboss">
              <Image
                src="/zeta-psi-omicron-seal.png"
                alt="Zeta Psi Omicron Seal"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <h2 className="mt-3 font-display text-lg tracking-wider text-gold">ZETA PSI OMICRON</h2>
            <p className="text-[10px] uppercase tracking-widest text-parchment-muted">Fraternity</p>
          </div>

          {/* Member Details */}
          <div className="flex-1 space-y-4 pt-6 text-center">
            <div>
              <h3 className="font-display text-2xl uppercase text-parchment">
                {member.first_name} {member.last_name}
              </h3>
              <p className="text-xs uppercase tracking-wide text-parchment-muted">
                Member Name
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-parchment-muted">Chapter</p>
                <p className="font-medium text-parchment">{member.chapter_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-parchment-muted">Region</p>
                <p className="font-medium text-parchment">{member.region_name || "N/A"}</p>
              </div>
            </div>

            <div>
              <p className="font-mono text-xl tracking-widest text-gold">
                {member.membership_number || "PENDING"}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-gold/60">
                Membership Number
              </p>
            </div>
          </div>

          {/* QR Code Footer */}
          <div className="flex items-end justify-between pt-4">
            <div className="rounded-lg bg-white p-2">
              <QRCodeSVG value={verificationUrl} size={64} level="H" />
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-parchment-muted">
                Status
              </p>
              <p className="font-bold tracking-widest text-green-500 uppercase">
                ACTIVE
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={handleDownload} 
        disabled={isExporting}
        className="w-full max-w-[340px] bg-gold text-onyx hover:bg-gold-muted print:hidden"
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Download className="h-4 w-4 mr-2" />
        )}
        {isExporting ? "Exporting..." : "Download Digital ID"}
      </Button>
    </div>
  );
}
