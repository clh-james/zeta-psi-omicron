"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, FileText } from "lucide-react";
import Image from "next/image";

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  documentType: string;
  documentTitle: string;
}

export function DocumentViewer({
  isOpen,
  onClose,
  documentUrl,
  documentType,
  documentTitle,
}: DocumentViewerProps) {
  // Determine if it's an image or a PDF. Supabase URLs often don't have extensions,
  // but we can infer from the `documentType` or assume if it fails it falls back.
  // We'll treat profile_picture and most others as images, except if the URL ends in .pdf
  const isPdf = documentUrl.toLowerCase().includes(".pdf");
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-onyx border-onyx-line shadow-2xl h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gold" />
              <div>
                <DialogTitle>{documentTitle}</DialogTitle>
                <DialogDescription className="text-xs uppercase tracking-widest mt-1">
                  {documentType.replace(/_/g, " ")}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2 pr-6">
              <Button variant="outline" size="sm" onClick={() => window.open(documentUrl, '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" /> Open Native
              </Button>
              <a href={documentUrl} download>
                <Button variant="gold" size="sm">
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
              </a>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto bg-black/50 rounded-md border border-onyx-line flex items-center justify-center p-4">
          {isPdf ? (
            <iframe 
              src={documentUrl} 
              className="w-full h-full rounded bg-white" 
              title={documentTitle}
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Using standard img instead of Next Image to avoid host configuration issues with external URLs */}
              <img 
                src={documentUrl} 
                alt={documentTitle}
                className="max-w-full max-h-full object-contain shadow-2xl rounded"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
