"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRef, useState } from "react";

export function IdCardView({ member }: { member: any }) {
  const [isFlipped, setIsFlipped] = useState(false);

  if (member.status !== "active") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-display text-gold mb-2">ID Card Locked</h2>
        <p className="text-parchment-muted max-w-md">
          Your digital ID card is currently unavailable. This feature is restricted to members in good standing (Active status). Please contact your chapter officer to resolve your status.
        </p>
      </div>
    );
  }

  // Generate ID string
  const memberIdString = member.membership_number || `ZPO-${member.year_initiated || new Date().getFullYear()}-${member.id.substring(0, 4).toUpperCase()}`;
  const qrData = `https://zetapsiomicron.org/verify/${member.id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}&color=d4af37&bgcolor=0A0A0A`;
  const barcodeUrl = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(memberIdString)}&scale=3&height=10&includetext=false&backgroundcolor=0A0A0A&barcolor=d4af37`;

  const handleDownload = () => {
    alert("In a full production environment, this would download an image of your ID card to your device.");
  };

  return (
    <div className="flex flex-col items-center space-y-8 py-8">
      
      {/* Perspective wrapper for 3D flip effect */}
      <div className="relative w-full max-w-[600px] aspect-[1.58/1] perspective-1000">
        
        {/* Flipping Container */}
        <div 
          className={`w-full h-full relative transition-transform duration-700 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          
          {/* ================= FRONT OF CARD ================= */}
          <div className="absolute inset-0 backface-hidden rounded-[14px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#0A0A0A] flex flex-col p-1.5 font-serif border-[1.5px] border-[#000]">
            {/* Outer gold border */}
            <div className="flex-1 border border-[#D4AF37]/90 rounded-[10px] flex flex-col overflow-hidden relative">
              
              {/* Background watermark in black area */}
              <div className="absolute top-[85px] bottom-0 left-0 right-0 bg-[#0A0A0A] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none">
                  <Image src="/zeta-psi-omicron-seal.png" alt="Watermark" width={380} height={380} className="grayscale" />
                </div>
              </div>

              {/* Holographic Strip */}
              <div className="absolute left-[30px] top-[85px] bottom-0 w-8 overflow-hidden opacity-40 z-0 bg-gradient-to-b from-[#D4AF37]/10 via-[#4A0810]/20 to-transparent">
                <div className="flex flex-col text-[6px] text-[#D4AF37] opacity-60 font-mono tracking-widest absolute inset-0 py-2 break-all" style={{ writingMode: 'vertical-rl' }}>
                  {Array(10).fill("ZETA PSI OMICRON ΖΨΩ ").map((text, i) => (
                    <span key={i} className={i % 2 === 0 ? "text-[#4A0810]" : "text-green-600/50"}>{text}</span>
                  ))}
                </div>
              </div>

              {/* Top Maroon Header */}
              <div className="h-[85px] bg-[#4A0810] flex items-center justify-between px-6 z-10 relative">
                {/* Left Seal */}
                <div className="w-[64px] h-[64px] flex-shrink-0 bg-[#0F0F0F] rounded-full border-[1.5px] border-[#D4AF37] shadow-[0_0_10px_rgba(0,0,0,0.5)] mr-2 relative flex items-center justify-center">
                  <Image src="/zeta-psi-omicron-seal.png" alt="Seal" width={46} height={46} className="object-contain" />
                </div>
                
                {/* Center Title */}
                <div className="flex-1 text-center mt-1">
                  <h1 className="font-serif text-[#D4AF37] text-[32px] leading-none tracking-[0.18em] drop-shadow-md" style={{ transform: 'scaleY(0.95)' }}>ZETA PSI OMICRON</h1>
                  <h2 className="text-[#F1E3D3] text-[10px] leading-tight tracking-[0.45em] mt-2 font-sans font-medium opacity-90">NATIONAL FRATERNITY</h2>
                  <div className="flex items-center justify-center gap-3 mt-2.5 text-[6.5px] text-[#D4AF37] tracking-[0.3em] uppercase font-sans font-semibold">
                    <span>Service</span>
                    <span className="text-[#D4AF37] text-[7px] leading-none">♦</span>
                    <span>Brotherhood</span>
                    <span className="text-[#D4AF37] text-[7px] leading-none">♦</span>
                    <span>Excellence</span>
                  </div>
                </div>
                
                {/* Right Laurel Logo */}
                <div className="w-[64px] h-[64px] flex-shrink-0 flex items-center justify-center ml-2 relative">
                  {/* Laurel Wreath SVG or representation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-[50px] h-[50px] text-[#D4AF37] fill-current drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]">
                      <path d="M15,50 C15,30 30,15 50,15 C55,15 59,16 63,18 L60,22 C57,20 54,20 50,20 C33,20 20,33 20,50 C20,67 33,80 50,80 C54,80 57,79 60,78 L63,82 C59,84 55,85 50,85 C30,85 15,70 15,50 Z" />
                      <path d="M85,50 C85,30 70,15 50,15 C45,15 41,16 37,18 L40,22 C43,20 46,20 50,20 C67,20 80,33 80,50 C80,67 67,80 50,80 C46,80 43,79 40,78 L37,82 C41,84 45,85 50,85 C70,85 85,70 85,50 Z" />
                      {/* Add some simple leaves */}
                      <circle cx="20" cy="40" r="3" />
                      <circle cx="25" cy="30" r="3" />
                      <circle cx="35" cy="22" r="3" />
                      <circle cx="80" cy="40" r="3" />
                      <circle cx="75" cy="30" r="3" />
                      <circle cx="65" cy="22" r="3" />
                      
                      <circle cx="20" cy="60" r="3" />
                      <circle cx="25" cy="70" r="3" />
                      <circle cx="35" cy="78" r="3" />
                      <circle cx="80" cy="60" r="3" />
                      <circle cx="75" cy="70" r="3" />
                      <circle cx="65" cy="78" r="3" />
                    </svg>
                  </div>
                  <div className="text-[#D4AF37] text-[13px] font-serif font-bold tracking-widest pl-1 z-10 drop-shadow-[0_0_3px_rgba(0,0,0,0.8)]">
                    ΖΨΩ
                  </div>
                </div>
                
                {/* Bottom Gold Line */}
                <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#D4AF37]/90 shadow-[0_1px_2px_rgba(0,0,0,0.5)]"></div>
              </div>

              {/* Main Black Body */}
              <div className="flex-1 bg-transparent p-5 px-6 flex flex-col z-10 relative">
                
                {/* Top Section: Photo, Info, QR */}
                <div className="flex items-start gap-6">
                  
                  {/* Photo Area */}
                  <div className="flex flex-col items-center">
                    <div className="w-[100px] h-[130px] bg-[#222] border-[1.5px] border-[#D4AF37]/90 rounded-[4px] flex-shrink-0 relative shadow-[0_4px_10px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
                      <div className="flex-1 flex flex-col items-center justify-end">
                        {/* Silhouette Placeholder */}
                        <svg viewBox="0 0 24 24" fill="#0A0A0A" className="w-[120%] h-[120%] -mb-4">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Middle Details Area */}
                  <div className="flex-1 pt-1 flex flex-col justify-start">
                    <h2 className="text-[26px] font-serif text-[#D4AF37] leading-none tracking-wide drop-shadow-sm uppercase">
                      {member.first_name} {member.last_name}
                    </h2>
                    <h3 className="text-[#D4AF37] text-[11px] tracking-[0.2em] uppercase mb-3 mt-1.5 opacity-90 font-sans">
                      Member
                    </h3>

                    <div className="w-full h-[0.5px] bg-[#D4AF37]/40 mb-3.5"></div>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 font-sans mb-3">
                      <div>
                        <span className="text-[#D4AF37] block uppercase text-[6.5px] tracking-widest mb-0.5 font-semibold">Member ID</span>
                        <span className="text-[#F1E3D3] font-mono text-[11px] tracking-wider">{memberIdString}</span>
                      </div>
                      <div>
                        <span className="text-[#D4AF37] block uppercase text-[6.5px] tracking-widest mb-0.5 font-semibold">Batch</span>
                        <span className="text-[#F1E3D3] text-[11px] uppercase">{member.batch || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-[#D4AF37] block uppercase text-[6.5px] tracking-widest mb-0.5 font-semibold">Initiation Year</span>
                        <span className="text-[#F1E3D3] text-[11px]">{member.year_initiated || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-[#D4AF37] block uppercase text-[6.5px] tracking-widest mb-0.5 font-semibold">Status</span>
                        <span className="text-[#F1E3D3] uppercase text-[11px]">{member.status}</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-[#F1E3D3]/80 font-sans mt-1">
                      Valid Through: [Date]
                    </div>
                  </div>

                  {/* QR Area */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-start w-[85px] mt-1">
                    <div className="p-1 border-[1.5px] border-[#D4AF37] rounded-[4px] bg-[#0A0A0A] shadow-md">
                      <img src={qrUrl} alt="QR Code" className="w-[75px] h-[75px]" />
                    </div>
                    <span className="text-[6px] text-[#D4AF37] mt-2 tracking-widest uppercase text-center leading-tight opacity-90 font-sans">
                      Scan to Verify
                    </span>
                  </div>
                </div>

                {/* Bottom Section: Footer Text & Signature */}
                <div className="mt-auto flex justify-between items-end pb-1 relative z-20">
                  {/* Empty left block for balance */}
                  <div className="w-[100px]"></div>

                  {/* Center Footer Text */}
                  <div className="text-center text-[#D4AF37] flex flex-col items-center">
                    <div className="text-[11px] tracking-widest mb-1.5 font-serif font-medium">EST. 1965</div>
                    <div className="text-[7.5px] tracking-[0.4em] uppercase font-sans font-light">MEMBERSHIP CREDENTIAL</div>
                  </div>

                  {/* Right Signature */}
                  <div className="flex flex-col items-center w-[130px]">
                    <div className="font-['Brush_Script_MT',cursive] text-white text-[28px] leading-none mb-1 -rotate-3 opacity-90">M. President</div>
                    <div className="w-full h-[0.5px] bg-white/50"></div>
                    <div className="text-[6.5px] text-white/80 tracking-widest mt-1 font-sans">National President Signature</div>
                  </div>
                </div>

              </div>

            </div>
          </div>


          {/* ================= BACK OF CARD ================= */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-[14px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#4A0810] flex flex-col p-1.5 font-serif">
            {/* Outer gold border */}
            <div className="flex-1 border border-[#D4AF37]/90 rounded-[10px] flex flex-col overflow-hidden relative">
              
              {/* Background watermark in black area */}
              <div className="absolute top-[75px] bottom-0 left-0 right-0 bg-[#0F0F0F] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                  <Image src="/zeta-psi-omicron-seal.png" alt="Watermark" width={320} height={320} className="grayscale" />
                </div>
              </div>

              {/* Top Maroon Header */}
              <div className="h-[75px] bg-[#4A0810] flex items-center justify-between px-5 z-10 relative">
                {/* Left Seal */}
                <div className="w-[52px] h-[52px] flex-shrink-0 bg-[#0F0F0F] rounded-full p-0.5 border border-[#D4AF37] shadow-inner mr-4">
                  <Image src="/zeta-psi-omicron-seal.png" alt="Seal" width={48} height={48} className="object-contain" />
                </div>
                
                {/* Center Title */}
                <div className="flex-1 text-center">
                  <h1 className="font-serif font-medium text-[#D4AF37] text-[28px] leading-none tracking-[0.12em] drop-shadow-md">ZETA PSI OMICRON</h1>
                  <h2 className="text-[#F1E3D3] text-[10px] leading-tight tracking-[0.35em] mt-1 font-sans font-light">NATIONAL FRATERNITY</h2>
                  <div className="flex items-center justify-center gap-2 mt-1.5 text-[6.5px] text-[#D4AF37] tracking-widest uppercase font-sans">
                    <span>Service</span>
                    <span className="text-[3px]">⚫</span>
                    <span>Brotherhood</span>
                    <span className="text-[3px]">⚫</span>
                    <span>Excellence</span>
                  </div>
                </div>
                
                {/* Right Laurel Logo */}
                <div className="w-[52px] h-[52px] flex-shrink-0 flex items-center justify-center ml-4">
                  <div className="text-[#D4AF37] border border-[#D4AF37] rounded-full p-1 text-[11px] italic relative w-9 h-9 flex items-center justify-center">
                    <span>ΖΨΩ</span>
                  </div>
                </div>
                
                {/* Bottom Gold Line */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#D4AF37]/50 via-[#D4AF37] to-[#D4AF37]/50"></div>
              </div>

              {/* Back Body */}
              <div className="flex-1 p-6 flex gap-6 z-10 relative">
                
                {/* Left Column (Text) */}
                <div className="flex-1 flex flex-col justify-center space-y-6">
                  
                  <div className="relative pl-3 border-l-[1.5px] border-[#D4AF37]">
                    <h3 className="text-[#D4AF37] text-[8px] font-bold tracking-[0.15em] uppercase mb-1.5 font-sans">Member's Oath</h3>
                    <p className="text-[#F1E3D3]/90 text-[10px] leading-snug italic font-serif opacity-80">
                      "I solemnly swear to uphold the principles and ideals of Zeta Psi Omicron, to live a life of service, brotherhood and excellence, and to contribute to the betterment of my fellow men and the nation."
                    </p>
                  </div>

                  <div className="relative pl-3 border-l-[1.5px] border-[#D4AF37]">
                    <h3 className="text-[#D4AF37] text-[8px] font-bold tracking-[0.15em] uppercase mb-1.5 font-sans">Important</h3>
                    <ul className="text-[#F1E3D3]/90 text-[8.5px] leading-relaxed list-disc pl-3 space-y-0.5 font-sans font-light opacity-80">
                      <li>This ID is non-transferable.</li>
                      <li>Use of this ID is subject to the rules and regulations of Zeta Psi Omicron.</li>
                      <li>Report loss or damage immediately to the Grand Council.</li>
                    </ul>
                  </div>
                </div>

                {/* Middle Column (QR Code) */}
                <div className="flex flex-col items-center justify-center px-4">
                  <div className="p-1 border border-[#D4AF37] rounded-[4px] bg-[#0A0A0A] shadow-md">
                    <img src={qrUrl} alt="QR Code" className="w-[75px] h-[75px]" />
                  </div>
                  <span className="text-[5.5px] text-[#D4AF37] mt-2 tracking-widest uppercase text-center leading-tight opacity-90 font-sans">
                    Scan to Verify<br/>
                    <span className="text-[4px] text-[#D4AF37]/60">(Not Functional)</span>
                  </span>
                </div>

                {/* Right Column (Barcode) */}
                <div className="flex flex-row items-center justify-center pl-2">
                  <div className="h-[120px] w-[26px] overflow-hidden flex items-center justify-center rotate-90 origin-center bg-[#F1E3D3] p-1 rounded-sm shadow-inner">
                    <img src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(memberIdString)}&scale=3&height=10&includetext=false&backgroundcolor=F1E3D3&barcolor=0A0A0A`} alt="Barcode" className="w-[120px] h-[26px]" />
                  </div>
                  <div className="text-[#D4AF37] text-[7.5px] tracking-[0.3em] font-mono rotate-180 ml-2 whitespace-nowrap opacity-90" style={{ writingMode: 'vertical-rl' }}>
                    {memberIdString}
                  </div>
                </div>
              </div>

              {/* Bottom Footer */}
              <div className="h-[28px] bg-[#4A0810] flex items-center justify-center border-t border-[#D4AF37]/80 z-10">
                <div className="flex items-center gap-2 text-[#D4AF37] text-[6.5px] tracking-[0.4em] uppercase font-sans font-light opacity-90">
                  <span className="w-4 h-[0.5px] bg-[#D4AF37]"></span>
                  <span>One Vision</span>
                  <span className="text-[3px] text-[#D4AF37]">⚫</span>
                  <span>One Brotherhood</span>
                  <span className="text-[3px] text-[#D4AF37]">⚫</span>
                  <span>One Zeta Psi Omicron</span>
                  <span className="w-4 h-[0.5px] bg-[#D4AF37]"></span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <div className="flex gap-4 w-full max-w-[600px]">
        <Button variant="outline" onClick={() => setIsFlipped(!isFlipped)} className="flex-1 bg-onyx text-gold border-gold/50 hover:bg-onyx-raised hover:text-gold">
          <RefreshCw className="w-4 h-4 mr-2" /> Flip Card
        </Button>
        <Button variant="gold" onClick={handleDownload} className="flex-1">
          <Download className="w-4 h-4 mr-2" /> Download ID
        </Button>
      </div>

      {/* Global CSS for 3D flip effect */}
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}} />
    </div>
  );
}
