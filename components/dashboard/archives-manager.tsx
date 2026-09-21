"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Download, Trash2, Upload, File, FileSignature, FolderArchive } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { saveDocumentMetadata, deleteDocument } from "@/app/dashboard/archives/actions";

const ICONS: Record<string, any> = {
  constitution: FileSignature,
  minutes: FileText,
  forms: File,
  other: FolderArchive,
};

export function ArchivesManager({ documents, role }: { documents: any[], role: string }) {
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const isOfficer = ["super_admin", "national_officer", "regional_officer", "chapter_officer"].includes(role);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return alert("Please select a file to upload.");
    
    setIsSubmitting(true);
    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from("archives").upload(filePath, file);
      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage.from("archives").getPublicUrl(filePath);

      // 3. Save Metadata
      const formData = new FormData(e.currentTarget);
      formData.append("file_url", publicUrl);
      formData.append("file_type", fileExt || "unknown");

      await saveDocumentMetadata(formData);

      alert("Document uploaded successfully!");
      setDialogOpen(false);
      setFile(null);
    } catch (err: any) {
      alert("Error uploading document: " + err.message);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) return;
    try {
      await deleteDocument(id);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-parchment-muted">Official documents, forms, and archives.</p>
        
        {isOfficer && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold"><Upload className="w-4 h-4 mr-2" /> Upload Document</Button>
            </DialogTrigger>
            <DialogContent className="bg-onyx-raised border-onyx-line text-parchment max-w-lg">
              <DialogHeader>
                <DialogTitle>Upload New Document</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label>Document Title</Label>
                  <Input name="title" required className="bg-onyx border-onyx-line" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea name="description" className="bg-onyx border-onyx-line h-20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <select name="category" required className="w-full bg-onyx border border-onyx-line text-parchment p-2 rounded text-sm outline-none">
                      <option value="constitution">Constitution & Bylaws</option>
                      <option value="minutes">Meeting Minutes</option>
                      <option value="forms">Official Forms</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Visibility</Label>
                    <select name="visibility" required className="w-full bg-onyx border border-onyx-line text-parchment p-2 rounded text-sm outline-none">
                      <option value="all_members">All Members</option>
                      <option value="officers_only">Officers Only</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>File</Label>
                  <Input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)} 
                    required 
                    className="bg-onyx border-onyx-line text-parchment file:text-gold file:bg-onyx-raised file:border-0 file:mr-4 file:px-4 file:py-1 hover:file:bg-onyx cursor-pointer" 
                  />
                </div>
                <Button type="submit" variant="gold" disabled={isSubmitting || !file} className="w-full">
                  {isSubmitting ? "Uploading..." : "Upload to Archives"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {documents.length === 0 && (
          <p className="text-parchment-muted col-span-full text-center py-10">No documents found in the archives.</p>
        )}
        {documents.map((doc) => {
          const IconComponent = ICONS[doc.category] || FolderArchive;
          
          return (
            <Card key={doc.id} className="border-onyx-line bg-onyx-raised flex flex-col">
              <CardHeader className="pb-3 border-b border-onyx-line">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-gold/10 rounded-lg">
                    <IconComponent className="w-5 h-5 text-gold" />
                  </div>
                  {doc.visibility === 'officers_only' && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-maroon bg-maroon/10 px-2 py-0.5 rounded">
                      Officers Only
                    </span>
                  )}
                </div>
                <CardTitle className="text-parchment text-lg truncate">{doc.title}</CardTitle>
                <CardDescription className="text-parchment-muted/80 text-xs mt-1">
                  Uploaded {new Date(doc.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="py-4 flex-1">
                <p className="text-sm text-parchment-muted line-clamp-3">
                  {doc.description || "No description provided."}
                </p>
              </CardContent>
              <CardFooter className="pt-4 border-t border-onyx-line flex justify-between items-center">
                <a 
                  href={doc.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 border border-onyx-line bg-transparent hover:bg-onyx hover:text-gold text-parchment h-9 px-4 py-2"
                >
                  <Download className="w-4 h-4 mr-2" /> Download
                </a>
                
                {isOfficer && (
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)} className="text-maroon hover:text-maroon hover:bg-maroon/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
