"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Check, X, Ban, RotateCcw, Printer, FileDown, QrCode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  approveMember,
  rejectMember,
  suspendMember,
  restoreMember,
} from "@/app/dashboard/members/actions";
import { MemberIDCard } from "./member-id-card";

export interface MemberRow {
  id: string;
  first_name: string;
  last_name: string;
  membership_number: string | null;
  chapter_id: string | null;
  chapter_name: string | null;
  region_name: string | null;
  batch: string | null;
  status: string;
  registration_status: string;
}

export function MemberDirectory({ members }: { members: MemberRow[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isPending, startTransition] = useTransition();
  const [selectedMemberForID, setSelectedMemberForID] = useState<MemberRow | null>(null);
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      const matchesQuery =
        !q ||
        `${m.first_name} ${m.last_name}`.toLowerCase().includes(q) ||
        m.membership_number?.toLowerCase().includes(q) ||
        m.chapter_name?.toLowerCase().includes(q) ||
        m.region_name?.toLowerCase().includes(q) ||
        m.batch?.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "all" ||
        m.status === statusFilter ||
        m.registration_status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [members, query, statusFilter]);

  const handleExportCSV = () => {
    const headers = ["First Name", "Last Name", "Membership Number", "Chapter", "Region", "Batch", "Status", "Registration Status"];
    const csvContent = [
      headers.join(","),
      ...filtered.map(m => [
        `"${m.first_name}"`,
        `"${m.last_name}"`,
        `"${m.membership_number ?? ""}"`,
        `"${m.chapter_name ?? ""}"`,
        `"${m.region_name ?? ""}"`,
        `"${m.batch ?? ""}"`,
        `"${m.status}"`,
        `"${m.registration_status}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Zeta_Psi_Omicron_Members_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 print:space-y-0">
      
      {/* Print-Only Header */}
      <div className="hidden print:block text-center mb-8 pb-4 border-b border-black">
        <h1 className="font-display text-2xl tracking-wider uppercase text-black">Zeta Psi Omicron</h1>
        <p className="text-sm tracking-widest text-black/70">Membership Directory Report</p>
        <p className="text-xs mt-2 text-black/50">Generated on: {new Date().toLocaleDateString()}</p>
        <p className="text-xs text-black/50">Total Members: {filtered.length}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/60" />
          <Input
            placeholder="Search name, membership #, chapter, region, batch…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-none pb-2 sm:pb-0">
          {["all", "pending", "active", "inactive", "suspended"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs uppercase tracking-wide transition-colors ${
                statusFilter === s
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-onyx-line text-parchment-muted hover:text-parchment"
              }`}
            >
              {s}
            </button>
          ))}
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="whitespace-nowrap">
            <FileDown className="h-3.5 w-3.5 mr-1.5" /> Excel
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()} className="whitespace-nowrap">
            <Printer className="h-3.5 w-3.5 mr-1.5" /> PDF
          </Button>
        </div>
      </div>

      <div className="card-surface overflow-x-auto scrollbar-thin scrollbar-thumb-onyx-line scrollbar-track-transparent print:border-none print:shadow-none print:bg-transparent">
        <table className="w-full text-left text-sm print:text-black min-w-[800px]">
          <thead>
            <tr className="border-b border-onyx-line text-xs uppercase tracking-wide text-parchment-muted print:text-black print:border-black">
              <th className="px-4 py-3 print:px-2">Member</th>
              <th className="px-4 py-3 print:px-2">Membership #</th>
              <th className="px-4 py-3 print:px-2">Chapter</th>
              <th className="px-4 py-3 print:px-2">Region</th>
              <th className="px-4 py-3 print:px-2">Batch</th>
              <th className="px-4 py-3 print:px-2">Status</th>
              <th className="px-4 py-3 text-right print:hidden">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-onyx-line print:divide-black/20">
            {filtered.map((m) => (
              <tr 
                key={m.id} 
                className="print:break-inside-avoid hover:bg-onyx-raised transition-colors cursor-pointer group"
                onClick={() => router.push(`/dashboard/members/${m.id}`)}
              >
                <td className="px-4 py-3 text-parchment print:text-black print:px-2 font-medium group-hover:text-gold transition-colors">
                  {m.first_name} {m.last_name}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gold print:text-black print:px-2">
                  {m.membership_number ?? "—"}
                </td>
                <td className="px-4 py-3 text-parchment-muted print:text-black print:px-2">{m.chapter_name ?? "—"}</td>
                <td className="px-4 py-3 text-parchment-muted print:text-black print:px-2">{m.region_name ?? "—"}</td>
                <td className="px-4 py-3 text-parchment-muted print:text-black print:px-2">{m.batch ?? "—"}</td>
                <td className="px-4 py-3 print:px-2">
                  <Badge
                    variant={
                      m.registration_status === "pending"
                        ? "pending"
                        : (m.status as any)
                    }
                  >
                    {m.registration_status === "pending" ? "Pending" : m.status.replace("_", " ")}
                  </Badge>
                </td>
                <td className="px-4 py-3 print:hidden">
                  <div className="flex justify-end gap-1.5">
                    {m.registration_status === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          variant="gold"
                          disabled={isPending}
                          onClick={(e) => {
                            e.stopPropagation();
                            startTransition(() => {
                              approveMember(m.id, m.chapter_id ?? "");
                            });
                          }}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={isPending}
                          onClick={(e) => {
                            e.stopPropagation();
                            startTransition(() => {
                              rejectMember(m.id, "Did not meet requirements");
                            });
                          }}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    ) : m.status === "suspended" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isPending}
                        onClick={(e) => {
                          e.stopPropagation();
                          startTransition(() => { restoreMember(m.id); });
                        }}
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Restore
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMemberForID(m);
                          }}
                          title="View Digital ID"
                        >
                          <QrCode className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isPending}
                          onClick={(e) => {
                            e.stopPropagation();
                            startTransition(() => { suspendMember(m.id); });
                          }}
                        >
                          <Ban className="h-3.5 w-3.5" /> Suspend
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-parchment-muted">
                  No members match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedMemberForID && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm print:bg-white print:backdrop-blur-none">
          <div className="relative animate-in zoom-in-95 duration-200">
            {/* Modal Actions (Hidden on Print) */}
            <div className="absolute -top-12 right-0 flex gap-2 print:hidden">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-2" /> Print
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedMemberForID(null)}>
                <X className="h-4 w-4 mr-2" /> Close
              </Button>
            </div>
            
            {/* ID Card */}
            <div className="print:absolute print:inset-0 print:m-0 print:p-0 print:flex print:items-center print:justify-center">
              <MemberIDCard member={selectedMemberForID} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
