"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Building2, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createRegion, updateRegion, deleteRegion, createChapter, updateChapter, deleteChapter } from "@/app/dashboard/chapters/actions";

type Region = { id: string; name: string; member_count: number };
type Chapter = { id: string; name: string; region_id: string; region_name: string; member_count: number };

export function OrganizationsManager({
  regions,
  chapters,
}: {
  regions: Region[];
  chapters: Chapter[];
}) {
  const [isPending, startTransition] = useTransition();

  // Region State
  const [newRegionName, setNewRegionName] = useState("");
  const [editingRegion, setEditingRegion] = useState<{ id: string; name: string } | null>(null);

  // Chapter State
  const [newChapterName, setNewChapterName] = useState("");
  const [newChapterRegion, setNewChapterRegion] = useState("");
  const [editingChapter, setEditingChapter] = useState<{ id: string; name: string; region_id: string } | null>(null);

  async function handleCreateRegion() {
    if (!newRegionName) return;
    startTransition(async () => {
      await createRegion(newRegionName);
      setNewRegionName("");
    });
  }

  async function handleUpdateRegion() {
    if (!editingRegion) return;
    startTransition(async () => {
      await updateRegion(editingRegion.id, editingRegion.name);
      setEditingRegion(null);
    });
  }

  async function handleDeleteRegion(id: string) {
    if (!confirm("Are you sure? This will fail if the region has chapters.")) return;
    startTransition(async () => {
      const res = await deleteRegion(id);
      if (!res.ok) alert(res.error);
    });
  }

  async function handleCreateChapter() {
    if (!newChapterName || !newChapterRegion) return;
    startTransition(async () => {
      await createChapter(newChapterName, newChapterRegion);
      setNewChapterName("");
    });
  }

  async function handleUpdateChapter() {
    if (!editingChapter) return;
    startTransition(async () => {
      await updateChapter(editingChapter.id, editingChapter.name, editingChapter.region_id);
      setEditingChapter(null);
    });
  }

  async function handleDeleteChapter(id: string) {
    if (!confirm("Are you sure? This will fail if the chapter has members.")) return;
    startTransition(async () => {
      const res = await deleteChapter(id);
      if (!res.ok) alert(res.error);
    });
  }

  return (
    <Tabs defaultValue="chapters" className="space-y-6">
      <TabsList>
        <TabsTrigger value="chapters">Chapters</TabsTrigger>
        <TabsTrigger value="regions">Regions</TabsTrigger>
      </TabsList>

      <TabsContent value="chapters" className="space-y-6">
        <div className="card-surface p-6">
          <h2 className="mb-4 font-display text-lg text-gold flex items-center gap-2">
            <Building2 className="h-5 w-5" /> Add New Chapter
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Chapter Name"
              value={newChapterName}
              onChange={(e) => setNewChapterName(e.target.value)}
              className="flex-1"
            />
            <select
              className="flex h-10 w-full flex-1 rounded-card border border-onyx-line bg-onyx-raised px-3 text-sm text-parchment focus-visible:outline-none focus-visible:border-gold sm:w-auto"
              value={newChapterRegion}
              onChange={(e) => setNewChapterRegion(e.target.value)}
            >
              <option value="">Select Region...</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <Button onClick={handleCreateChapter} disabled={isPending || !newChapterName || !newChapterRegion}>
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
        </div>

        <div className="card-surface">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-onyx-line text-xs uppercase tracking-wide text-parchment-muted">
                  <th className="px-4 py-3">Chapter Name</th>
                  <th className="px-4 py-3">Region</th>
                  <th className="px-4 py-3">Members</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-onyx-line">
                {chapters.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3">
                      {editingChapter?.id === c.id ? (
                        <Input
                          value={editingChapter.name}
                          onChange={(e) => setEditingChapter({ ...editingChapter, name: e.target.value })}
                          className="h-8 max-w-[200px]"
                        />
                      ) : (
                        <span className="text-parchment">{c.name}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingChapter?.id === c.id ? (
                        <select
                          className="h-8 w-[150px] rounded border border-onyx-line bg-onyx px-2 text-sm text-parchment"
                          value={editingChapter.region_id}
                          onChange={(e) => setEditingChapter({ ...editingChapter, region_id: e.target.value })}
                        >
                          {regions.map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-parchment-muted">{c.region_name}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-parchment-muted">{c.member_count}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {editingChapter?.id === c.id ? (
                          <>
                            <Button size="sm" variant="gold" onClick={handleUpdateChapter} disabled={isPending}>Save</Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingChapter(null)}>Cancel</Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" onClick={() => setEditingChapter(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteChapter(c.id)} disabled={isPending}><Trash2 className="h-3.5 w-3.5" /></Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {chapters.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-parchment-muted">No chapters found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden flex flex-col divide-y divide-onyx-line">
            {chapters.map((c) => (
              <div key={c.id} className="p-4 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 space-y-1">
                    <p className="text-xs text-parchment-muted uppercase tracking-wider">Chapter Name</p>
                    {editingChapter?.id === c.id ? (
                      <Input
                        value={editingChapter.name}
                        onChange={(e) => setEditingChapter({ ...editingChapter, name: e.target.value })}
                        className="h-8 w-full"
                      />
                    ) : (
                      <p className="text-parchment font-medium">{c.name}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-parchment-muted uppercase tracking-wider">Region</p>
                    {editingChapter?.id === c.id ? (
                      <select
                        className="h-8 w-full rounded border border-onyx-line bg-onyx px-2 text-sm text-parchment"
                        value={editingChapter.region_id}
                        onChange={(e) => setEditingChapter({ ...editingChapter, region_id: e.target.value })}
                      >
                        {regions.map((r) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm text-parchment-muted">{c.region_name}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-parchment-muted uppercase tracking-wider">Members</p>
                    <p className="text-sm text-parchment-muted">{c.member_count}</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  {editingChapter?.id === c.id ? (
                    <>
                      <Button size="sm" variant="gold" onClick={handleUpdateChapter} disabled={isPending}>Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingChapter(null)}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => setEditingChapter(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteChapter(c.id)} disabled={isPending}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {chapters.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-parchment-muted">No chapters found.</div>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="regions" className="space-y-6">
        <div className="card-surface p-6">
          <h2 className="mb-4 font-display text-lg text-gold flex items-center gap-2">
            <Map className="h-5 w-5" /> Add New Region
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Region Name"
              value={newRegionName}
              onChange={(e) => setNewRegionName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleCreateRegion} disabled={isPending || !newRegionName}>
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
        </div>

        <div className="card-surface">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-onyx-line text-xs uppercase tracking-wide text-parchment-muted">
                  <th className="px-4 py-3">Region Name</th>
                  <th className="px-4 py-3">Members</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-onyx-line">
                {regions.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3">
                      {editingRegion?.id === r.id ? (
                        <Input
                          value={editingRegion.name}
                          onChange={(e) => setEditingRegion({ ...editingRegion, name: e.target.value })}
                          className="h-8 max-w-[200px]"
                        />
                      ) : (
                        <span className="text-parchment">{r.name}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-parchment-muted">{r.member_count}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {editingRegion?.id === r.id ? (
                          <>
                            <Button size="sm" variant="gold" onClick={handleUpdateRegion} disabled={isPending}>Save</Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingRegion(null)}>Cancel</Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" onClick={() => setEditingRegion(r)}><Pencil className="h-3.5 w-3.5" /></Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteRegion(r.id)} disabled={isPending}><Trash2 className="h-3.5 w-3.5" /></Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {regions.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-sm text-parchment-muted">No regions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden flex flex-col divide-y divide-onyx-line">
            {regions.map((r) => (
              <div key={r.id} className="p-4 space-y-4">
                <div className="space-y-1">
                  <p className="text-xs text-parchment-muted uppercase tracking-wider">Region Name</p>
                  {editingRegion?.id === r.id ? (
                    <Input
                      value={editingRegion.name}
                      onChange={(e) => setEditingRegion({ ...editingRegion, name: e.target.value })}
                      className="h-8 w-full"
                    />
                  ) : (
                    <p className="text-parchment font-medium">{r.name}</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-parchment-muted uppercase tracking-wider">Members</p>
                  <p className="text-sm text-parchment-muted">{r.member_count}</p>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  {editingRegion?.id === r.id ? (
                    <>
                      <Button size="sm" variant="gold" onClick={handleUpdateRegion} disabled={isPending}>Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingRegion(null)}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => setEditingRegion(r)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteRegion(r.id)} disabled={isPending}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {regions.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-parchment-muted">No regions found.</div>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
