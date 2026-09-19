"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();
  
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleSignOut} 
      title="Sign out" 
      className="text-parchment-muted hover:text-red-400 hover:bg-onyx shrink-0"
    >
      <LogOut className="h-4 w-4" />
    </Button>
  );
}
