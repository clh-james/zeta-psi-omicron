"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, AlertTriangle } from "lucide-react";

export default function ContentManagementPage() {
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchContent() {
      const { data } = await supabase.from("site_content").select("*").order("key");
      if (data) setContent(data);
      setLoading(false);
    }
    fetchContent();
  }, []);

  const handleChange = (index: number, valStr: string) => {
    const newContent = [...content];
    try {
      newContent[index].value = JSON.parse(valStr);
      setContent(newContent);
    } catch (e) {
      // Invalid JSON, maybe just store as string temporarily or show error
    }
  };

  const handleSave = async (key: string, value: any) => {
    setSaving(true);
    const { error } = await supabase.from("site_content").upsert({ key, value });
    if (error) {
      alert("Error saving content: " + error.message);
    } else {
      alert("Content updated successfully");
    }
    setSaving(false);
  };

  const handleInitialize = async () => {
    setSaving(true);
    const defaults = [
      { key: 'mission', value: { text: "To foster leadership, academic excellence, and an unbreakable bond of brotherhood." } },
      { key: 'vision', value: { text: "To be the premier national fraternity shaping the next generation of leaders." } },
      { key: 'core_values', value: { values: ["Leadership", "Brotherhood", "Excellence", "Service"] } },
      { key: 'history_timeline', value: { events: [{ year: "1965", title: "Founding", description: "Established at the University of the Philippines Los Baños (UPLB)." }] } }
    ];
    
    for (const item of defaults) {
      await supabase.from("site_content").upsert(item);
    }
    
    const { data } = await supabase.from("site_content").select("*").order("key");
    if (data) setContent(data);
    setSaving(false);
  };

  if (loading) return <div className="text-parchment-muted">Loading content...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl text-gold">Content Management</h1>
        <p className="text-sm text-parchment-muted">Manage dynamic website content such as Mission, Vision, and History Timeline.</p>
      </div>

      <div className="bg-maroon/20 border border-maroon p-4 rounded-md flex gap-3 text-parchment">
        <AlertTriangle className="h-5 w-5 text-maroon" />
        <p className="text-sm">Content must be valid JSON matching the website's expected structure.</p>
      </div>
      
      {content.length === 0 && (
        <div className="text-center py-12 bg-onyx-raised border border-onyx-line rounded-lg">
          <p className="text-parchment-muted mb-4">No content found in the database.</p>
          <Button variant="gold" onClick={handleInitialize} disabled={saving}>
            Initialize Default Content
          </Button>
        </div>
      )}

      {content.map((item, idx) => (
        <Card key={item.key} className="bg-onyx border-onyx-line">
          <CardHeader>
            <CardTitle className="text-parchment capitalize">{item.key.replace("_", " ")}</CardTitle>
            <CardDescription>Last updated: {new Date(item.updated_at).toLocaleString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full h-32 bg-onyx-raised border border-onyx-line text-parchment p-3 rounded font-mono text-xs focus:border-gold outline-none"
              defaultValue={JSON.stringify(item.value, null, 2)}
              onChange={(e) => handleChange(idx, e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <Button variant="gold" onClick={() => handleSave(item.key, item.value)} disabled={saving}>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
