"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Briefcase, HeartHandshake, MapPin, Building2, Trash2 } from "lucide-react";
import { createJobPosting, offerMentorship, deleteJobPosting, deleteMentorshipOffer } from "@/app/dashboard/career/actions";

export function CareerManager({ jobs, mentors, currentMemberId }: { jobs: any[], mentors: any[], currentMemberId?: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [mentorDialogOpen, setMentorDialogOpen] = useState(false);

  const myMentorshipOffer = mentors.find(m => m.member_id === currentMemberId);

  const handleCreateJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createJobPosting(new FormData(e.currentTarget));
      alert("Job posted successfully!");
      setJobDialogOpen(false);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
    setIsSubmitting(false);
  };

  const handleOfferMentorship = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await offerMentorship(new FormData(e.currentTarget));
      alert("Mentorship offer updated!");
      setMentorDialogOpen(false);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
    setIsSubmitting(false);
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;
    try {
      await deleteJobPosting(id);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleDeleteMentorship = async () => {
    if (!confirm("Are you sure you want to remove your mentorship offer?")) return;
    try {
      await deleteMentorshipOffer();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <Tabs defaultValue="jobs" className="space-y-6">
      <TabsList className="bg-onyx border border-onyx-line">
        <TabsTrigger value="jobs" className="data-[state=active]:text-gold">Job Board</TabsTrigger>
        <TabsTrigger value="mentorship" className="data-[state=active]:text-gold">Mentorship Directory</TabsTrigger>
      </TabsList>

      <TabsContent value="jobs">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-parchment-muted">Explore career opportunities posted by our brothers.</p>
          {currentMemberId && (
            <Dialog open={jobDialogOpen} onOpenChange={setJobDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="gold"><Briefcase className="w-4 h-4 mr-2" /> Post a Job</Button>
              </DialogTrigger>
              <DialogContent className="bg-onyx-raised border-onyx-line text-parchment max-w-lg">
                <DialogHeader>
                  <DialogTitle>Post a Job Opportunity</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateJob} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Job Title</Label>
                    <Input name="title" required className="bg-onyx border-onyx-line" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input name="company" required className="bg-onyx border-onyx-line" />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input name="location" required className="bg-onyx border-onyx-line" placeholder="e.g. Remote, Manila" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Job Type</Label>
                    <select name="job_type" required className="w-full bg-onyx border border-onyx-line text-parchment p-2 rounded text-sm outline-none">
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea name="description" required className="bg-onyx border-onyx-line h-24" />
                  </div>
                  <div className="space-y-2">
                    <Label>Application URL / Email</Label>
                    <Input name="apply_url" className="bg-onyx border-onyx-line" />
                  </div>
                  <Button type="submit" variant="gold" disabled={isSubmitting} className="w-full">
                    Submit Job Posting
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map(job => (
            <Card key={job.id} className="border-onyx-line bg-onyx-raised flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-gold text-lg">{job.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Building2 className="w-4 h-4" /> {job.company}
                    </CardDescription>
                  </div>
                  {job.poster_id === currentMemberId && (
                    <Button variant="ghost" size="icon" className="text-maroon hover:bg-maroon/20 hover:text-maroon" onClick={() => handleDeleteJob(job.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs text-parchment-muted mb-4 uppercase tracking-wider">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                  <span className="px-2 py-0.5 bg-onyx border border-onyx-line rounded">{job.job_type}</span>
                </div>
                <p className="text-sm text-parchment-muted mb-6 line-clamp-3 flex-1">{job.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-onyx-line">
                  <div className="text-xs text-parchment-muted">
                    Posted by: {job.poster?.first_name} {job.poster?.last_name}
                  </div>
                  {job.apply_url && (
                    <a href={job.apply_url.startsWith('http') ? job.apply_url : `mailto:${job.apply_url}`} target="_blank" rel="noreferrer">
                      <Button variant="outline" size="sm" className="border-gold text-gold hover:bg-gold hover:text-onyx-dark transition-colors">
                        Apply Now
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {jobs.length === 0 && (
            <p className="text-sm text-parchment-muted col-span-2 py-8 text-center">No jobs posted yet.</p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="mentorship">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-parchment-muted">Connect with experienced brothers for career guidance.</p>
          {currentMemberId && (
            <Dialog open={mentorDialogOpen} onOpenChange={setMentorDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="gold"><HeartHandshake className="w-4 h-4 mr-2" /> {myMentorshipOffer ? "Edit Offer" : "Offer Mentorship"}</Button>
              </DialogTrigger>
              <DialogContent className="bg-onyx-raised border-onyx-line text-parchment max-w-lg">
                <DialogHeader>
                  <DialogTitle>{myMentorshipOffer ? "Update Mentorship Offer" : "Offer Mentorship"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleOfferMentorship} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Areas of Expertise</Label>
                    <Input name="expertise" required defaultValue={myMentorshipOffer?.expertise} placeholder="e.g. Finance, Software Dev, Law" className="bg-onyx border-onyx-line" />
                  </div>
                  <div className="space-y-2">
                    <Label>Availability</Label>
                    <Input name="availability" required defaultValue={myMentorshipOffer?.availability} placeholder="e.g. Weekends, 1hr/week" className="bg-onyx border-onyx-line" />
                  </div>
                  <div className="space-y-2">
                    <Label>Short Bio / Mentorship Style</Label>
                    <Textarea name="bio" required defaultValue={myMentorshipOffer?.bio} className="bg-onyx border-onyx-line h-24" />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" variant="gold" disabled={isSubmitting} className="flex-1">
                      Save Offer
                    </Button>
                    {myMentorshipOffer && (
                      <Button type="button" variant="outline" className="border-maroon text-maroon hover:bg-maroon/10" onClick={handleDeleteMentorship} disabled={isSubmitting}>
                        Stop Mentoring
                      </Button>
                    )}
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {mentors.map(mentor => (
            <Card key={mentor.id} className="border-onyx-line bg-onyx-raised">
              <CardHeader>
                <CardTitle className="text-gold text-lg">{mentor.member?.first_name} {mentor.member?.last_name}</CardTitle>
                <CardDescription className="text-parchment-muted">{mentor.member?.profession || mentor.member?.occupation}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-parchment-muted block mb-1">Expertise</span>
                    <p className="text-sm text-parchment">{mentor.expertise}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-parchment-muted block mb-1">Availability</span>
                    <p className="text-sm text-parchment">{mentor.availability}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-parchment-muted block mb-1">About</span>
                    <p className="text-sm text-parchment">{mentor.bio}</p>
                  </div>
                </div>
                {currentMemberId !== mentor.member_id && (
                  <a href={`mailto:${mentor.member?.email}`}>
                    <Button variant="outline" className="w-full border-onyx-line hover:bg-onyx text-parchment">
                      Request Mentorship
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
          {mentors.length === 0 && (
            <p className="text-sm text-parchment-muted col-span-2 py-8 text-center">No mentors registered yet.</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
