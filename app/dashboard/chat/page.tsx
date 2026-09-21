import { createClient } from "@/lib/supabase/server";
import { LiveChat } from "@/components/dashboard/live-chat";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ChatPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get current member ID
  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("user_id", user.id)
    .single();

  // Fetch initial history (last 50 messages)
  const { data: messages } = await supabase
    .from("messages")
    .select(`
      *,
      sender:members (first_name, last_name, chapter:chapters(name))
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-display text-2xl text-gold">Live Chat</h1>
        <p className="text-sm text-parchment-muted">
          Connect and chat with brothers in real-time.
        </p>
      </div>

      <LiveChat 
        initialMessages={(messages || []).reverse()} 
        currentMemberId={member?.id || ""} 
      />
    </div>
  );
}
