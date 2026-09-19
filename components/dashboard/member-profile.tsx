"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText, User, Building2, CalendarCheck, Check, X, UserMinus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { MemberIDCard } from "./member-id-card";
import { DocumentViewer } from "./document-viewer";

interface DocumentRow {
  id: string;
  type: string;
  file_name: string;
  url: string;
}

interface AttendanceRecord {
  status: string;
  event_id: string;
  event_title: string;
  event_date: string;
  event_location: string;
}
import { useState, useTransition } from "react";
import { approveMember, rejectMember } from "@/app/dashboard/members/actions";

export function MemberProfile({ member, documents, canApprove, attendance }: { member: any; documents: DocumentRow[]; canApprove?: boolean; attendance?: AttendanceRecord[] }) {
  // Format dates safely
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString();
  };

  const [isPending, startTransition] = useTransition();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const [activeDocument, setActiveDocument] = useState<DocumentRow | null>(null);

  const handleApprove = () => {
    startTransition(async () => {
      await approveMember(member.id, member.chapter_id ?? "");
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    startTransition(async () => {
      await rejectMember(member.id, rejectReason);
      setShowRejectModal(false);
    });
  };

  return (
    <div className="space-y-6 pb-24">
      {activeDocument && (
        <DocumentViewer
          isOpen={!!activeDocument}
          onClose={() => setActiveDocument(null)}
          documentUrl={activeDocument.url}
          documentType={activeDocument.type}
          documentTitle={activeDocument.file_name}
        />
      )}
      {/* Header and Back navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/members">
            <Button variant="outline" size="sm" className="h-9 w-9 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl text-gold">
              {member.first_name} {member.last_name}
            </h1>
            <div className="text-sm text-parchment-muted flex items-center gap-2">
              <Badge variant={member.registration_status === "pending" ? "pending" : (member.status as any)}>
                {member.registration_status === "pending" ? "Pending" : member.status.replace("_", " ")}
              </Badge>
              {member.membership_number && (
                <span className="font-mono text-gold/80">{member.membership_number}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="biodata" className="mt-8">
            <div className="w-full overflow-x-auto scrollbar-none">
              <TabsList className="bg-onyx-raised border-b border-onyx-line w-max min-w-full justify-start rounded-none h-auto p-0">
                <TabsTrigger
                  value="biodata"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gold data-[state=active]:text-gold rounded-none px-6 py-3 text-parchment-muted"
                >
                  <User className="w-4 h-4 mr-2" /> Biodata
                </TabsTrigger>
                <TabsTrigger
                  value="fraternity"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gold data-[state=active]:text-gold rounded-none px-6 py-3 text-parchment-muted"
                >
                  <Building2 className="w-4 h-4 mr-2" /> Fraternity Record
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gold data-[state=active]:text-gold rounded-none px-6 py-3 text-parchment-muted"
                >
                  <FileText className="w-4 h-4 mr-2" /> Documents
                </TabsTrigger>
                <TabsTrigger
                  value="attendance"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gold data-[state=active]:text-gold rounded-none px-6 py-3 text-parchment-muted"
                >
                  <CalendarCheck className="w-4 h-4 mr-2" /> Attendance
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="biodata" className="mt-4 space-y-6">
              <div className="card-surface p-6 space-y-6">
                <div>
                  <h3 className="font-display text-lg text-gold mb-4 border-b border-onyx-line pb-2">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <DetailItem label="Full Name" value={`${member.first_name} ${member.middle_name || ""} ${member.last_name} ${member.suffix || ""}`} />
                    <DetailItem label="Nickname" value={member.nickname} />
                    <DetailItem label="Gender" value={member.gender} />
                    <DetailItem label="Birth Date" value={formatDate(member.birth_date)} />
                    <DetailItem label="Civil Status" value={member.civil_status} />
                    <DetailItem label="Blood Type" value={member.blood_type} />
                    <DetailItem label="Nationality" value={member.nationality} />
                    <DetailItem label="Religion" value={member.religion} />
                    <DetailItem label="Height (cm)" value={member.height_cm} />
                    <DetailItem label="Weight (kg)" value={member.weight_kg} />
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-lg text-gold mb-4 border-b border-onyx-line pb-2">Contact Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <DetailItem label="Mobile Number" value={member.mobile_number} />
                    <DetailItem label="Alternate Number" value={member.alternate_number} />
                    <DetailItem label="Email" value={member.email} />
                    <DetailItem label="Current Address" value={member.current_address} />
                    <DetailItem label="Barangay" value={member.barangay} />
                    <DetailItem label="City/Municipality" value={member.city} />
                    <DetailItem label="Province" value={member.province} />
                    <DetailItem label="Zip Code" value={member.zip_code} />
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-lg text-gold mb-4 border-b border-onyx-line pb-2">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <DetailItem label="Name" value={member.emergency_contact_name} />
                    <DetailItem label="Relationship" value={member.emergency_contact_relationship} />
                    <DetailItem label="Contact Number" value={member.emergency_contact_number} />
                    <DetailItem label="Address" value={member.emergency_contact_address} />
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-lg text-gold mb-4 border-b border-onyx-line pb-2">Education</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <DetailItem label="Elementary School" value={member.elementary_school} />
                    <DetailItem label="High School" value={member.high_school} />
                    <DetailItem label="College" value={member.college} />
                    <DetailItem label="Course" value={member.course} />
                    <DetailItem label="Year Graduated" value={member.year_graduated} />
                    <DetailItem label="Graduate School" value={member.graduate_school} />
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-lg text-gold mb-4 border-b border-onyx-line pb-2">Employment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <DetailItem label="Employer" value={member.employer} />
                    <DetailItem label="Job Title" value={member.job_title} />
                    <DetailItem label="Years Employed" value={member.years_employed} />
                    <DetailItem label="Office Address" value={member.office_address} className="md:col-span-2" />
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-lg text-gold mb-4 border-b border-onyx-line pb-2">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <DetailItem label="Medical Conditions" value={member.medical_conditions} />
                    <DetailItem label="Allergies" value={member.allergies} />
                    <DetailItem label="Special Notes" value={member.special_notes} className="md:col-span-2" />
                    <DetailItem label="Remarks" value={member.remarks} className="md:col-span-2" />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fraternity" className="mt-4">
              <div className="card-surface p-6 space-y-6">
                <div>
                  <h3 className="font-display text-lg text-gold mb-4 border-b border-onyx-line pb-2">Fraternity Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <DetailItem label="Chapter" value={member.chapters?.name} />
                    <DetailItem label="Region" value={member.regions?.name} />
                    <DetailItem label="Batch Name" value={member.batch} />
                    <DetailItem label="Initiation Year" value={member.year_initiated} />
                    <DetailItem label="Initiation Date" value={formatDate(member.initiation_date)} />
                    <DetailItem label="Rank/Position" value={member.rank || member.positions?.title} />
                    <DetailItem label="Sponsor" value={member.sponsor} />
                    <DetailItem label="Recruiter" value={member.recruiter} />
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-lg text-gold mb-4 border-b border-onyx-line pb-2">Achievements & Service</h3>
                  <div className="grid grid-cols-1 gap-y-4 text-sm">
                    <DetailItem label="Years in Service" value={member.years_in_service} />
                    <DetailItem label="Awards" value={member.awards} />
                    <DetailItem label="Volunteer Work" value={member.volunteer_work} />
                    <DetailItem label="Special Skills" value={member.special_skills} />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-4">
              <div className="card-surface p-6">
                <h3 className="font-display text-lg text-gold mb-4 border-b border-onyx-line pb-2">Uploaded Documents</h3>
                
                {documents.length === 0 ? (
                  <p className="text-sm text-parchment-muted py-8 text-center">No documents have been uploaded.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map(doc => (
                      <div key={doc.id} className="border border-onyx-line rounded-card p-4 flex flex-col items-center text-center gap-3 bg-onyx">
                        <FileText className="w-8 h-8 text-gold/60" />
                        <div>
                          <p className="text-sm font-medium text-parchment">{doc.type.replace(/_/g, " ").toUpperCase()}</p>
                          <p className="text-xs text-parchment-muted truncate max-w-[200px]">{doc.file_name}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2"
                          onClick={() => setActiveDocument(doc)}
                        >
                          <FileText className="w-3.5 h-3.5 mr-2" /> View Document
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="attendance" className="mt-4">
              <div className="card-surface p-6">
                <h3 className="font-display text-lg text-gold mb-4 border-b border-onyx-line pb-2">Event Attendance History</h3>
                
                {(!attendance || attendance.length === 0) ? (
                  <p className="text-sm text-parchment-muted py-8 text-center">No attendance records found.</p>
                ) : (
                  <div className="space-y-3">
                    {attendance.map((record, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-onyx-line rounded-card bg-onyx gap-4">
                        <div>
                          <p className="font-medium text-parchment">{record.event_title}</p>
                          <p className="text-xs text-parchment-muted mt-1">
                            {new Date(record.event_date).toLocaleDateString()} • {record.event_location}
                          </p>
                        </div>
                        <Badge variant={record.status as any} className="w-max">
                          {record.status === 'present' && <Check className="w-3 h-3 mr-1 inline" />}
                          {record.status === 'absent' && <X className="w-3 h-3 mr-1 inline" />}
                          {record.status === 'excused' && <UserMinus className="w-3 h-3 mr-1 inline" />}
                          {record.status.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar: ID Card Preview */}
        <div className="space-y-6">
          <div className="card-surface p-6 flex items-center justify-center bg-black">
             <div className="w-full max-w-[300px]">
                <MemberIDCard member={{
                  id: member.id,
                  first_name: member.first_name,
                  last_name: member.last_name,
                  membership_number: member.membership_number,
                  chapter_name: member.chapters?.name,
                  region_name: member.regions?.name,
                }} />
             </div>
          </div>
          
          <div className="card-surface p-6 space-y-4">
             <h3 className="font-display text-sm text-gold border-b border-onyx-line pb-2">System Info</h3>
             <DetailItem label="Registered" value={formatDate(member.created_at)} />
             <DetailItem label="Last Updated" value={formatDate(member.updated_at)} />
             {member.approved_at && (
                <DetailItem label="Approved On" value={formatDate(member.approved_at)} />
             )}
          </div>
        </div>
      </div>

      {/* Sticky Approval Action Bar */}
      {member.registration_status === "pending" && canApprove && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-onyx-line bg-onyx-raised p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:left-64">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <div>
              <p className="font-display text-gold">Registration Pending Approval</p>
              <p className="text-sm text-parchment-muted">Review the documents and biodata before deciding.</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="destructive" 
                onClick={() => setShowRejectModal(true)}
                disabled={isPending}
              >
                Reject Registration
              </Button>
              <Button 
                variant="gold" 
                onClick={handleApprove}
                disabled={isPending}
              >
                {isPending ? "Processing..." : "Approve & Generate ID"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-onyx-line bg-onyx-raised p-6 shadow-2xl animate-in zoom-in-95">
            <h2 className="font-display text-xl text-red-500 mb-2">Reject Registration</h2>
            <p className="text-sm text-parchment-muted mb-4">
              Please provide a reason for rejecting this application. This will be visible to the member so they can correct it.
            </p>
            <textarea
              className="w-full rounded-md border border-onyx-line bg-onyx p-3 text-sm text-parchment placeholder-parchment-muted/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              rows={4}
              placeholder="e.g. The uploaded Government ID is too blurry to read."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowRejectModal(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReject} disabled={isPending || !rejectReason.trim()}>
                {isPending ? "Rejecting..." : "Confirm Rejection"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  if (!value || value === "") {
    return (
      <div className={className}>
        <p className="text-xs text-parchment-muted uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-parchment/40 italic">—</p>
      </div>
    );
  }
  return (
    <div className={className}>
      <p className="text-xs text-parchment-muted uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-parchment">{value}</p>
    </div>
  );
}

