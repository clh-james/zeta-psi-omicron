import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("username, role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "member";

  const SidebarContent = (
    <>
      <div className="flex items-center gap-3 border-b border-onyx-line px-5 py-5">
        <div className="h-9 w-9 overflow-hidden rounded-full shadow-emboss shrink-0">
          <Image
            src="/zeta-psi-omicron-seal.png"
            alt="Zeta Psi Omicron Fraternity Seal"
            width={36}
            height={36}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="font-display text-sm text-gold">Zeta Psi Omicron</p>
          <p className="text-[10px] uppercase tracking-widest text-parchment-muted">
            National MIS
          </p>
        </div>
      </div>

      <SidebarNav role={role} />

      <div className="mt-auto border-t border-onyx-line px-5 py-4 flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-xs text-parchment-muted">Signed in as</p>
          <p className="truncate text-sm text-parchment">{profile?.username ?? user.email}</p>
          <p className="text-[10px] uppercase tracking-widest text-gold">{role.replace("_", " ")}</p>
        </div>
        <SignOutButton />
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-onyx">
      <aside className="hidden w-64 flex-col border-r border-onyx-line bg-onyx-raised md:flex">
        {SidebarContent}
      </aside>

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="flex items-center justify-between border-b border-onyx-line bg-onyx-raised px-4 py-3 md:hidden">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-parchment hover:text-gold hover:bg-onyx">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-onyx-raised border-r-onyx-line flex flex-col">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                {SidebarContent}
              </SheetContent>
            </Sheet>
            <p className="font-display text-sm text-gold">ZPO MIS</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationBell userId={user.id} />
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-end border-b border-onyx-line bg-onyx-raised px-6 py-3">
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <NotificationBell userId={user.id} />
          </div>
        </header>

        <main className="p-6 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
