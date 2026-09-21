"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CalendarDays, MapPin, Users, CheckCircle2, HelpCircle, XCircle } from "lucide-react";
import { createEvent, submitRSVP } from "@/app/dashboard/events/actions";

export function EventsManager({ events, currentMemberId, role }: { events: any[], currentMemberId: string, role: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const canCreateEvent = ["super_admin", "national_officer", "regional_officer", "chapter_officer"].includes(role);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createEvent(new FormData(e.currentTarget));
      alert("Event created successfully!");
      setDialogOpen(false);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
    setIsSubmitting(false);
  };

  const handleRSVP = async (eventId: string, status: 'attending' | 'maybe' | 'declined') => {
    if (!currentMemberId) {
      alert("You must have a member profile to RSVP to events.");
      return;
    }
    try {
      await submitRSVP(eventId, status);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-parchment-muted">Upcoming fraternity events and gatherings.</p>
        
        {canCreateEvent && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold"><CalendarDays className="w-4 h-4 mr-2" /> Schedule Event</Button>
            </DialogTrigger>
            <DialogContent className="bg-onyx-raised border-onyx-line text-parchment max-w-lg">
              <DialogHeader>
                <DialogTitle>Schedule a New Event</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label>Event Title</Label>
                  <Input name="title" required className="bg-onyx border-onyx-line" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea name="description" required className="bg-onyx border-onyx-line h-24" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date & Time</Label>
                    <Input type="datetime-local" name="event_date" required className="bg-onyx border-onyx-line" />
                  </div>
                  <div className="space-y-2">
                    <Label>Event Type</Label>
                    <select name="type" required className="w-full bg-onyx border border-onyx-line text-parchment p-2 rounded text-sm outline-none">
                      <option value="national">National</option>
                      <option value="regional">Regional</option>
                      <option value="chapter">Chapter</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Location / Link</Label>
                  <Input name="location" required className="bg-onyx border-onyx-line" placeholder="Physical address or Zoom link" />
                </div>
                <Button type="submit" variant="gold" disabled={isSubmitting} className="w-full">
                  Create Event
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.length === 0 && (
          <p className="text-parchment-muted col-span-full text-center py-10">No upcoming events found.</p>
        )}
        {events.map((event) => {
          const myRSVP = event.event_rsvps.find((r: any) => r.member_id === currentMemberId)?.status;
          
          const attendingCount = event.event_rsvps.filter((r: any) => r.status === 'attending').length;
          
          return (
            <Card key={event.id} className="border-onyx-line bg-onyx-raised flex flex-col">
              <CardHeader className="pb-3 border-b border-onyx-line">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold bg-gold/10 px-2 py-0.5 rounded">
                    {event.type}
                  </span>
                  <span className="text-xs text-parchment-muted flex items-center gap-1">
                    <Users className="w-3 h-3" /> {attendingCount} attending
                  </span>
                </div>
                <CardTitle className="text-parchment text-lg">{event.title}</CardTitle>
                <CardDescription className="text-parchment-muted/80 text-xs mt-1">
                  Organized by {event.organizer?.first_name} {event.organizer?.last_name}
                </CardDescription>
              </CardHeader>
              <CardContent className="py-4 flex-1">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-parchment">
                    <CalendarDays className="w-4 h-4 text-gold" />
                    {new Date(event.event_date).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'})}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-parchment">
                    <MapPin className="w-4 h-4 text-gold" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
                <p className="text-sm text-parchment-muted line-clamp-3">{event.description}</p>
              </CardContent>
              <CardFooter className="pt-4 border-t border-onyx-line flex-col gap-3">
                <div className="w-full">
                  <span className="text-xs uppercase tracking-widest text-parchment-muted block mb-2">Your RSVP</span>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant={myRSVP === 'attending' ? 'gold' : 'outline'} 
                      size="sm" 
                      onClick={() => handleRSVP(event.id, 'attending')}
                      className={`h-8 ${myRSVP !== 'attending' ? 'border-onyx-line hover:text-gold text-parchment-muted' : ''}`}
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Going
                    </Button>
                    <Button 
                      variant={myRSVP === 'maybe' ? 'secondary' : 'outline'} 
                      size="sm" 
                      onClick={() => handleRSVP(event.id, 'maybe')}
                      className={`h-8 ${myRSVP !== 'maybe' ? 'border-onyx-line hover:text-parchment text-parchment-muted' : 'bg-onyx hover:bg-onyx text-parchment'}`}
                    >
                      <HelpCircle className="w-3 h-3 mr-1" /> Maybe
                    </Button>
                    <Button 
                      variant={myRSVP === 'declined' ? 'destructive' : 'outline'} 
                      size="sm" 
                      onClick={() => handleRSVP(event.id, 'declined')}
                      className={`h-8 ${myRSVP !== 'declined' ? 'border-onyx-line hover:text-maroon text-parchment-muted' : 'bg-maroon/20 text-maroon hover:bg-maroon/20 hover:text-maroon border-maroon'}`}
                    >
                      <XCircle className="w-3 h-3 mr-1" /> Can't Go
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
