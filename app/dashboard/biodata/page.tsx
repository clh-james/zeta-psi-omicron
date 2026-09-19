"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronRight, ChevronLeft, Save } from "lucide-react";

const STEPS = [
  { id: "personal", title: "Personal Info" },
  { id: "educational", title: "Educational" },
  { id: "professional", title: "Professional" },
  { id: "fraternity", title: "Fraternity" },
  { id: "contact", title: "Contact" },
  { id: "emergency", title: "Emergency" },
];

export default function BiodataPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [memberData, setMemberData] = useState<any>({});
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("members").select("*").eq("user_id", user.id).single();
        if (data) setMemberData(data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleChange = (field: string, value: string) => {
    setMemberData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (isSubmit: boolean = false) => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const payload = {
        ...memberData,
        registration_status: isSubmit ? "pending" : memberData.registration_status || "draft",
        status: isSubmit && memberData.status === "inactive" ? "inactive" : memberData.status,
      };
      await supabase.from("members").update(payload).eq("user_id", user.id);
      if (isSubmit) {
        alert("Biodata submitted for verification!");
      } else {
        alert("Draft saved successfully.");
      }
    }
    setSaving(false);
  };

  if (loading) return <div className="text-parchment-muted p-8 text-center">Loading biodata...</div>;

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-parchment-muted">First Name</label>
              <input type="text" value={memberData.first_name || ""} onChange={(e) => handleChange("first_name", e.target.value)} className="w-full bg-onyx border border-onyx-line rounded p-2 text-parchment focus:border-gold outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-parchment-muted">Last Name</label>
              <input type="text" value={memberData.last_name || ""} onChange={(e) => handleChange("last_name", e.target.value)} className="w-full bg-onyx border border-onyx-line rounded p-2 text-parchment focus:border-gold outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-parchment-muted">Birth Date</label>
              <input type="date" value={memberData.birth_date || ""} onChange={(e) => handleChange("birth_date", e.target.value)} className="w-full bg-onyx border border-onyx-line rounded p-2 text-parchment focus:border-gold outline-none" />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-parchment-muted">Degree / Course</label>
              <input type="text" value={memberData.degree || ""} onChange={(e) => handleChange("degree", e.target.value)} className="w-full bg-onyx border border-onyx-line rounded p-2 text-parchment focus:border-gold outline-none" placeholder="e.g., BS Computer Science" />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-parchment-muted">Institution</label>
              <input type="text" value={memberData.institution || ""} onChange={(e) => handleChange("institution", e.target.value)} className="w-full bg-onyx border border-onyx-line rounded p-2 text-parchment focus:border-gold outline-none" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-parchment-muted">Current Occupation</label>
              <input type="text" value={memberData.occupation || ""} onChange={(e) => handleChange("occupation", e.target.value)} className="w-full bg-onyx border border-onyx-line rounded p-2 text-parchment focus:border-gold outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-parchment-muted">Company / Organization</label>
              <input type="text" value={memberData.company || ""} onChange={(e) => handleChange("company", e.target.value)} className="w-full bg-onyx border border-onyx-line rounded p-2 text-parchment focus:border-gold outline-none" />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-parchment-muted">Batch Name</label>
              <input type="text" value={memberData.batch || ""} onChange={(e) => handleChange("batch", e.target.value)} className="w-full bg-onyx border border-onyx-line rounded p-2 text-parchment focus:border-gold outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-parchment-muted">Membership Number</label>
              <input type="text" value={memberData.membership_number || ""} onChange={(e) => handleChange("membership_number", e.target.value)} className="w-full bg-onyx border border-onyx-line rounded p-2 text-parchment focus:border-gold outline-none" placeholder="Leave blank if unknown" />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-parchment-muted">Email Address</label>
              <input type="email" value={memberData.email || ""} onChange={(e) => handleChange("email", e.target.value)} className="w-full bg-onyx border border-onyx-line rounded p-2 text-parchment focus:border-gold outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-parchment-muted">Mobile Number</label>
              <input type="tel" value={memberData.mobile_number || ""} onChange={(e) => handleChange("mobile_number", e.target.value)} className="w-full bg-onyx border border-onyx-line rounded p-2 text-parchment focus:border-gold outline-none" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs uppercase tracking-widest text-parchment-muted">Permanent Address</label>
              <textarea value={memberData.address || ""} onChange={(e) => handleChange("address", e.target.value)} className="w-full bg-onyx border border-onyx-line rounded p-2 text-parchment focus:border-gold outline-none" rows={3}></textarea>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-parchment-muted">Emergency Contact Name</label>
              <input type="text" value={memberData.emergency_contact_name || ""} onChange={(e) => handleChange("emergency_contact_name", e.target.value)} className="w-full bg-onyx border border-onyx-line rounded p-2 text-parchment focus:border-gold outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-parchment-muted">Emergency Contact Number</label>
              <input type="tel" value={memberData.emergency_contact_number || ""} onChange={(e) => handleChange("emergency_contact_number", e.target.value)} className="w-full bg-onyx border border-onyx-line rounded p-2 text-parchment focus:border-gold outline-none" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-gold uppercase tracking-widest">Digital Biodata</h1>
          <p className="text-parchment-muted mt-2">Maintain your official fraternity record. All changes must be verified by an officer.</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="outline" className={`border-onyx-line ${memberData.registration_status === 'approved' ? 'text-green-500' : 'text-gold'}`}>
            Status: {memberData.registration_status?.toUpperCase() || "DRAFT"}
          </Badge>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
        {STEPS.map((step, idx) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(idx)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold uppercase tracking-widest transition-colors ${
              currentStep === idx ? "bg-gold text-onyx" : "bg-onyx border border-onyx-line text-parchment-muted hover:border-gold/50 hover:text-parchment"
            }`}
          >
            {idx < currentStep ? <Check className="h-3 w-3" /> : <span className="opacity-50">{idx + 1}</span>}
            {step.title}
          </button>
        ))}
      </div>

      <Card className="border-onyx-line bg-onyx-raised shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-seal-radial opacity-20 pointer-events-none"></div>
        <CardHeader className="border-b border-onyx-line">
          <CardTitle className="text-gold font-display text-xl">{STEPS[currentStep].title}</CardTitle>
          <CardDescription>Step {currentStep + 1} of {STEPS.length}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 relative z-10">
          {renderStep()}
        </CardContent>
        <div className="px-6 py-4 border-t border-onyx-line flex justify-between items-center bg-onyx/50">
          <Button
            variant="outline"
            className="border-onyx-line text-parchment-muted hover:text-parchment"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          
          <div className="flex gap-3">
            <Button variant="ghost" className="text-gold hover:bg-gold/10" onClick={() => handleSave(false)} disabled={saving}>
              <Save className="mr-2 h-4 w-4" /> Save Draft
            </Button>
            
            {currentStep === STEPS.length - 1 ? (
              <Button variant="gold" className="shadow-emboss" onClick={() => handleSave(true)} disabled={saving}>
                Submit for Verification <Check className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button variant="outline" className="border-gold/50 text-gold hover:bg-gold hover:text-onyx" onClick={() => setCurrentStep(currentStep + 1)}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
