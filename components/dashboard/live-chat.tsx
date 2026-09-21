"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { sendMessage } from "@/app/dashboard/chat/actions";

export function LiveChat({ initialMessages, currentMemberId }: { initialMessages: any[], currentMemberId: string }) {
  const [messages, setMessages] = useState<any[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    // Scroll to bottom on load
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Subscribe to realtime inserts on 'messages' table
    const channel = supabase
      .channel("live-chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          // We need to fetch the sender's profile because the payload only has sender_id
          const { data: member } = await supabase
            .from("members")
            .select("first_name, last_name, chapter:chapters(name)")
            .eq("id", payload.new.sender_id)
            .single();

          const newMsg = {
            ...payload.new,
            sender: member
          };
          
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setIsSending(true);
    try {
      await sendMessage(newMessage);
      setNewMessage("");
    } catch (err: any) {
      alert("Error sending message: " + err.message);
    }
    setIsSending(false);
  };

  return (
    <Card className="border-onyx-line bg-onyx-raised flex flex-col h-[600px] shadow-lg shadow-black/50">
      <CardHeader className="border-b border-onyx-line pb-4 bg-onyx">
        <CardTitle className="text-gold flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          Global Fraternity Lounge
        </CardTitle>
        <CardDescription>Live chat with brothers worldwide.</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-parchment-muted text-sm my-10">No messages yet. Be the first to say hello!</p>
        )}
        
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentMemberId;
          const chapterName = msg.sender?.chapter?.name ? ` • ${msg.sender.chapter.name} Chapter` : "";
          
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs font-bold text-parchment-muted">
                  {isMe ? "You" : `${msg.sender?.first_name} ${msg.sender?.last_name}`}
                </span>
                <span className="text-[10px] text-parchment-muted/50">{chapterName}</span>
              </div>
              <div 
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                  isMe 
                    ? "bg-gold text-onyx-dark rounded-tr-sm" 
                    : "bg-onyx border border-onyx-line text-parchment rounded-tl-sm"
                }`}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-parchment-muted/40 mt-1">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </CardContent>

      <div className="p-4 border-t border-onyx-line bg-onyx/50 rounded-b-lg">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..." 
            className="bg-onyx-raised border-onyx-line text-parchment focus-visible:ring-gold"
            autoComplete="off"
          />
          <Button type="submit" variant="gold" size="icon" disabled={isSending || !newMessage.trim()}>
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </Card>
  );
}
