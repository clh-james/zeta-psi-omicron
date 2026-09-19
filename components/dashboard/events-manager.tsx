"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Calendar, MapPin, Globe, Map as MapIcon, Building2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createEvent, deleteEvent, rsvpEvent } from "@/app/dashboard/events/actions";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type Region = { id: string; name: string };
type Chapter = { id: string; name: string };
type FraternityEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  starts_at: string;
  ends_at: string | null;
  audience_scope: string;
  region_name?: string | null;
  chapter_name?: string | null;
  author_name: string;
};

export function EventsManager({
  events,
  regions,
  chapters,
  canManage,
  currentMemberId,
  userRsvps = {},
}: {
  events: FraternityEvent[];
  regions: Region[];
  chapters: Chapter[];
  canManage: boolean;
  currentMemberId?: string | null;
  userRsvps?: Record<string, string>;
}) {
  const [isPending, startTransition] = useTransition();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [scope, setScope] = useState("national");
  const [regionId, setRegionId] = useState("");
  const [chapterId, setChapterId] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !startsAt || !location) return;
    
    startTransition(async () => {
      const res = await createEvent({
        title,
        description,
        location,
        starts_at: new Date(startsAt).toISOString(),
        ends_at: endsAt ? new Date(endsAt).toISOString() : "",
        audience_scope: scope,
        region_id: scope === "regional" ? regionId : null,
        chapter_id: scope === "chapter" ? chapterId : null,
      });
      if (res.ok) {
        setIsCreating(false);
        setTitle("");
        setDescription("");
        setLocation("");
        setStartsAt("");
        setEndsAt("");
      } else {
        alert(res.error);
      }
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    startTransition(async () => {
      await deleteEvent(id);
    });
  }

  function handleRsvp(eventId: string, status: string) {
    startTransition(async () => {
      await rsvpEvent(eventId, status);
    });
  }

  return (
    <div className="space-y-6">
      {canManage && !isCreating && (
        <div className="flex justify-end">
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" /> Schedule Event
          </Button>
        </div>
      )}

      {isCreating && (
        <form onSubmit={handleCreate} className="card-surface space-y-4 p-6 border border-gold/40">
          <h2 className="font-display text-lg text-gold flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Schedule New Event
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4 md:col-span-2">
              <Input 
                placeholder="Event Title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required
              />
              <Textarea 
                placeholder="Event Description..." 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="min-h-[100px]"
              />
              <Input 
                placeholder="Location (e.g. Grand Hotel Manila or Zoom Link)" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wide text-parchment-muted block">Starts At</label>
              <Input 
                type="datetime-local"
                value={startsAt} 
                onChange={(e) => setStartsAt(e.target.value)} 
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wide text-parchment-muted block">Ends At (Optional)</label>
              <Input 
                type="datetime-local"
                value={endsAt} 
                onChange={(e) => setEndsAt(e.target.value)} 
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <div className="flex-1">
              <label className="text-xs uppercase tracking-wide text-parchment-muted mb-1 block">Audience Scope</label>
              <select
                className="w-full rounded-card border border-onyx-line bg-onyx px-3 py-2 text-sm text-parchment focus-visible:outline-none focus-visible:border-gold"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
              >
                <option value="national">National (All Members)</option>
                <option value="regional">Regional</option>
                <option value="chapter">Chapter</option>
              </select>
            </div>

            {scope === "regional" && (
              <div className="flex-1">
                <label className="text-xs uppercase tracking-wide text-parchment-muted mb-1 block">Select Region</label>
                <select
                  className="w-full rounded-card border border-onyx-line bg-onyx px-3 py-2 text-sm text-parchment focus-visible:outline-none focus-visible:border-gold"
                  value={regionId}
                  onChange={(e) => setRegionId(e.target.value)}
                  required
                >
                  <option value="">Select Region...</option>
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
            )}

            {scope === "chapter" && (
              <div className="flex-1">
                <label className="text-xs uppercase tracking-wide text-parchment-muted mb-1 block">Select Chapter</label>
                <select
                  className="w-full rounded-card border border-onyx-line bg-onyx px-3 py-2 text-sm text-parchment focus-visible:outline-none focus-visible:border-gold"
                  value={chapterId}
                  onChange={(e) => setChapterId(e.target.value)}
                  required
                >
                  <option value="">Select Chapter...</option>
                  {chapters.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsCreating(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" disabled={isPending || !title || !startsAt || !location}>
              Schedule Event
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="card-surface p-12 text-center text-parchment-muted">
            <p>No upcoming events scheduled.</p>
          </div>
        ) : (
          events.map((e) => (
            <div key={e.id} className="card-surface relative overflow-hidden p-6 transition-colors hover:bg-onyx-raised/80">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-xl text-gold">{e.title}</h3>
                    <Badge variant={e.audience_scope === "national" ? "default" : "secondary"}>
                      {e.audience_scope === "national" && <Globe className="mr-1 h-3 w-3 inline" />}
                      {e.audience_scope === "regional" && <MapIcon className="mr-1 h-3 w-3 inline" />}
                      {e.audience_scope === "chapter" && <Building2 className="mr-1 h-3 w-3 inline" />}
                      {e.audience_scope.toUpperCase()}
                      {e.region_name ? ` - ${e.region_name}` : ""}
                      {e.chapter_name ? ` - ${e.chapter_name}` : ""}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-parchment">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-parchment-muted" />
                      {new Date(e.starts_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      {e.ends_at && ` - ${new Date(e.ends_at).toLocaleTimeString([], { timeStyle: 'short' })}`}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-parchment-muted" />
                      {e.location}
                    </span>
                  </div>
                </div>

                {canManage && (
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/dashboard/events/${e.id}/attendance`}>
                      <Button size="sm" variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                        Track Attendance
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(e.id)}
                      className="text-red-400 hover:bg-red-500/10 hover:text-red-400"
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              {e.description && (
                <div className="mt-4 whitespace-pre-wrap text-sm text-parchment-muted/90 leading-relaxed border-t border-onyx-line pt-4">
                  {e.description}
                </div>
              )}

              {currentMemberId && (
                <div className="mt-6 pt-4 border-t border-onyx-line flex items-center justify-between">
                  <div className="text-sm text-parchment-muted">
                    Will you be attending this event?
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant={userRsvps[e.id] === 'present' ? 'gold' : 'outline'}
                      onClick={() => handleRsvp(e.id, 'present')}
                      disabled={isPending}
                      className={userRsvps[e.id] === 'present' ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-green-600/30 text-green-500 hover:bg-green-500/10'}
                    >
                      Attending
                    </Button>
                    <Button 
                      size="sm" 
                      variant={userRsvps[e.id] === 'absent' ? 'gold' : 'outline'}
                      onClick={() => handleRsvp(e.id, 'absent')}
                      disabled={isPending}
                      className={userRsvps[e.id] === 'absent' ? '' : 'border-red-500/30 text-red-500 hover:bg-red-500/10'}
                    >
                      Not Attending
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
