"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Check, X, Upload, CreditCard } from "lucide-react";
import { createDue, submitPaymentProof, verifyPayment } from "@/app/dashboard/dues/actions";

export function DuesManager({ role, memberId, dues, payments }: { role: string; memberId?: string; dues: any[]; payments: any[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDue, setSelectedDue] = useState<any>(null);
  const [proofUrl, setProofUrl] = useState("");
  const [reference, setReference] = useState("");
  const isAdmin = ["super_admin", "national_officer", "regional_officer", "chapter_officer"].includes(role);

  const handleCreateDue = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createDue(new FormData(e.currentTarget));
      (e.target as HTMLFormElement).reset();
      alert("Due created successfully!");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
    setIsSubmitting(false);
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDue || !proofUrl) return alert("Missing receipt URL or Due ID");
    setIsSubmitting(true);
    try {
      await submitPaymentProof(selectedDue.id, reference, proofUrl, selectedDue.amount);
      alert("Payment proof submitted for verification.");
      setSelectedDue(null);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
    setIsSubmitting(false);
  };

  const handleVerify = async (paymentId: string, status: "verified" | "rejected") => {
    try {
      await verifyPayment(paymentId, status);
      alert("Payment status updated.");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  if (isAdmin) {
    return (
      <Tabs defaultValue="overview">
        <TabsList className="mb-6 bg-onyx border border-onyx-line">
          <TabsTrigger value="overview">Dues Overview</TabsTrigger>
          <TabsTrigger value="verifications">Pending Verifications</TabsTrigger>
          <TabsTrigger value="create">Create New Due</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {dues.map(d => (
              <Card key={d.id} className="border-onyx-line bg-onyx-raised">
                <CardHeader>
                  <CardTitle className="text-parchment">{d.title}</CardTitle>
                  <CardDescription>Due by {new Date(d.due_date).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-parchment-muted mb-4">{d.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-parchment-muted uppercase tracking-widest text-xs">Amount:</span>
                    <span className="text-gold font-bold">₱{d.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-parchment-muted uppercase tracking-widest text-xs">Scope:</span>
                    <span className="text-parchment capitalize">{d.audience_scope}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="verifications">
          <Card className="border-onyx-line">
            <CardHeader>
              <CardTitle>Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.filter(p => p.status === "pending").map(p => (
                  <div key={p.id} className="flex justify-between items-center p-4 border border-onyx-line bg-onyx rounded-md">
                    <div>
                      <p className="text-sm font-bold text-parchment">{p.due?.title || "Unknown Due"}</p>
                      <p className="text-xs text-parchment-muted">Member ID: {p.member_id}</p>
                      <p className="text-xs text-parchment-muted">Ref: {p.reference_number || "None"}</p>
                      {p.proof_file_url && (
                        <a href={p.proof_file_url} target="_blank" rel="noreferrer" className="text-xs text-gold hover:underline">View Receipt</a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10" onClick={() => handleVerify(p.id, "verified")}>
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="border-maroon text-maroon hover:bg-maroon/10" onClick={() => handleVerify(p.id, "rejected")}>
                        <X className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  </div>
                ))}
                {payments.filter(p => p.status === "pending").length === 0 && (
                  <p className="text-sm text-parchment-muted text-center py-6">No pending verifications.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card className="border-onyx-line max-w-2xl">
            <CardHeader>
              <CardTitle>Issue New Dues</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateDue} className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input name="title" required placeholder="e.g., Annual National Dues 2026" className="bg-onyx border-onyx-line text-parchment" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea name="description" className="bg-onyx border-onyx-line text-parchment" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount (₱)</Label>
                    <Input name="amount" type="number" step="0.01" required className="bg-onyx border-onyx-line text-parchment" />
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input name="due_date" type="date" required className="bg-onyx border-onyx-line text-parchment" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Audience Scope</Label>
                  <select name="audience_scope" className="w-full bg-onyx border border-onyx-line text-parchment p-2 rounded text-sm outline-none">
                    <option value="national">National (All Members)</option>
                  </select>
                </div>
                <Button variant="gold" type="submit" disabled={isSubmitting} className="w-full">
                  <Plus className="h-4 w-4 mr-2" /> Issue Dues
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  }

  // Member View
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {dues.map(d => {
          const payment = payments.find(p => p.due_id === d.id);
          const isPaid = payment?.status === "verified";
          const isPending = payment?.status === "pending";

          return (
            <Card key={d.id} className="border-onyx-line bg-onyx-raised relative overflow-hidden">
              {isPaid && (
                <div className="absolute top-0 right-0 bg-green-500/20 text-green-500 px-4 py-1 text-xs font-bold rounded-bl-lg uppercase tracking-widest">
                  Paid
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-parchment">{d.title}</CardTitle>
                <CardDescription>Due by {new Date(d.due_date).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-3xl font-display text-gold font-bold">₱{d.amount.toFixed(2)}</span>
                </div>
                {isPaid ? (
                  <p className="text-sm text-parchment-muted flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" /> Payment verified
                  </p>
                ) : isPending ? (
                  <p className="text-sm text-parchment-muted flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" /> Verification pending
                  </p>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="gold" className="w-full" onClick={() => setSelectedDue(d)}>
                        <CreditCard className="h-4 w-4 mr-2" /> Pay Now / Upload Proof
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-onyx-raised border-onyx-line text-parchment">
                      <DialogHeader>
                        <DialogTitle>Submit Payment Proof</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmitProof} className="space-y-4 mt-4">
                        <div className="bg-onyx p-4 rounded text-sm text-parchment-muted mb-4 border border-onyx-line">
                          <p className="font-bold text-parchment mb-2">Payment Instructions:</p>
                          <p>1. Send exactly <strong className="text-gold">₱{d.amount.toFixed(2)}</strong> to our GCash or Bank Account.</p>
                          <p>2. Upload your receipt image to an image host (like Imgur) for now and paste the URL below.</p>
                          <p>3. Enter the Reference Number.</p>
                        </div>
                        <div className="space-y-2">
                          <Label>Receipt URL</Label>
                          <Input value={proofUrl} onChange={(e) => setProofUrl(e.target.value)} required placeholder="https://..." className="bg-onyx border-onyx-line" />
                        </div>
                        <div className="space-y-2">
                          <Label>Reference Number</Label>
                          <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="e.g., 100239485" className="bg-onyx border-onyx-line" />
                        </div>
                        <Button type="submit" variant="gold" disabled={isSubmitting} className="w-full">
                          <Upload className="h-4 w-4 mr-2" /> Submit Proof
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          );
        })}
        {dues.length === 0 && (
          <p className="text-sm text-parchment-muted">No outstanding dues at this time.</p>
        )}
      </div>
    </div>
  );
}

// Need to define Clock icon since I used it above
function Clock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
