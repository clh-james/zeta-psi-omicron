"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Megaphone, Clock, Globe, Map, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createAnnouncement, deleteAnnouncement } from "@/app/dashboard/announcements/actions";
import { Badge } from "@/components/ui/badge";

type Region = { id: string; name: string };
type Chapter = { id: string; name: string };
type Announcement = {
  id: string;
  title: string;
  body: string;
  audience_scope: string;
  region_name?: string | null;
  chapter_name?: string | null;
  published_at: string;
  is_pinned?: boolean;
  author_name: string;
};

export function AnnouncementsManager({
  announcements,
  regions,
  chapters,
  canManage,
}: {
  announcements: Announcement[];
  regions: Region[];
  chapters: Chapter[];
  canManage: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [scope, setScope] = useState("national");
  const [regionId, setRegionId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !body) return;
    
    startTransition(async () => {
      const res = await createAnnouncement({
        title,
        body,
        audience_scope: scope,
        region_id: scope === "regional" ? regionId : null,
        chapter_id: scope === "chapter" ? chapterId : null,
        is_pinned: isPinned,
      });
      if (res.ok) {
        setIsCreating(false);
        setTitle("");
        setBody("");
        setIsPinned(false);
      } else {
        alert(res.error);
      }
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    startTransition(async () => {
      await deleteAnnouncement(id);
    });
  }

  return (
    <div className="space-y-6">
      {canManage && !isCreating && (
        <div className="flex justify-end">
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Announcement
          </Button>
        </div>
      )}

      {isCreating && (
        <form onSubmit={handleCreate} className="card-surface space-y-4 p-6 border border-gold/40">
          <h2 className="font-display text-lg text-gold flex items-center gap-2">
            <Megaphone className="h-5 w-5" /> Broadcast Announcement
          </h2>
          
          <Input 
            placeholder="Announcement Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required
          />
          
          <Textarea 
            placeholder="Write your message here..." 
            value={body} 
            onChange={(e) => setBody(e.target.value)} 
            required
            className="min-h-[120px]"
          />

          <div className="flex flex-col sm:flex-row gap-4">
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

          <div className="flex items-center gap-2 mt-4 pt-2 border-t border-onyx-line">
            <input 
              type="checkbox" 
              id="pin-announcement" 
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="rounded border-onyx-line bg-onyx text-gold focus:ring-gold"
            />
            <label htmlFor="pin-announcement" className="text-sm text-parchment cursor-pointer">
              Pin to Overview Dashboard
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsCreating(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" disabled={isPending || !title || !body}>
              Publish
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="card-surface p-12 text-center text-parchment-muted">
            <p>No announcements to display.</p>
          </div>
        ) : (
          announcements.map((a) => (
            <div key={a.id} className="card-surface relative overflow-hidden p-6 transition-colors hover:bg-onyx-raised/80">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-lg text-parchment">{a.title}</h3>
                    <Badge variant={a.audience_scope === "national" ? "default" : "secondary"}>
                      {a.audience_scope === "national" && <Globe className="mr-1 h-3 w-3 inline" />}
                      {a.audience_scope === "regional" && <Map className="mr-1 h-3 w-3 inline" />}
                      {a.audience_scope === "chapter" && <Building2 className="mr-1 h-3 w-3 inline" />}
                      {a.audience_scope.toUpperCase()}
                      {a.region_name ? ` - ${a.region_name}` : ""}
                      {a.chapter_name ? ` - ${a.chapter_name}` : ""}
                    </Badge>
                    {a.is_pinned && (
                      <Badge variant="secondary" className="border-gold/30 text-gold bg-transparent ml-2">
                        📌 Pinned
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-parchment-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(a.published_at).toLocaleDateString()} at {new Date(a.published_at).toLocaleTimeString()}
                    </span>
                    <span>By {a.author_name}</span>
                  </div>
                </div>
                {canManage && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(a.id)}
                    className="text-red-400 hover:bg-red-500/10 hover:text-red-400"
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="mt-4 whitespace-pre-wrap text-sm text-parchment-muted/90 leading-relaxed">
                {a.body}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
