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
    await supabase.from("site_content").upsert({ key, value });
    alert("Content updated successfully");
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
