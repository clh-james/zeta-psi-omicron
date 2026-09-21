"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Megaphone,
  CalendarDays,
  FileBarChart,
  ScrollText,
  Settings,
  ShieldAlert,
  CreditCard,
  Briefcase,
  MessageSquare,
  FolderArchive,
  BadgeCheck,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, roles: "all" },
  { href: "/dashboard/biodata", label: "My Biodata", icon: FileBarChart, roles: "all" },
  { href: "/dashboard/id-card", label: "Digital ID Card", icon: BadgeCheck, roles: "all" },
  { href: "/dashboard/directory", label: "Directory", icon: Users, roles: "all" },
  { href: "/dashboard/members", label: "Manage Members", icon: Users, roles: ["super_admin", "national_officer", "regional_officer", "chapter_officer"] },
  { href: "/dashboard/history", label: "History", icon: ScrollText, roles: "all" },
  { href: "/dashboard/archives", label: "The Archives", icon: FolderArchive, roles: "all" },
  { href: "/dashboard/dues", label: "Dues & Payments", icon: CreditCard, roles: "all" },
  { href: "/dashboard/career", label: "Career & Mentorship", icon: Briefcase, roles: "all" },
  { href: "/dashboard/events", label: "Events & Calendar", icon: CalendarDays, roles: "all" },
  { href: "/dashboard/chat", label: "Live Chat", icon: MessageSquare, roles: "all" },
  {
    href: "/dashboard/chapters",
    label: "Chapters & Regions",
    icon: Building2,
    roles: ["super_admin", "national_officer", "regional_officer"],
  },
  {
    href: "/dashboard/announcements",
    label: "Announcements",
    icon: Megaphone,
    roles: "all",
  },
  {
    href: "/dashboard/reports",
    label: "Reports",
    icon: FileBarChart,
    roles: ["super_admin", "national_officer", "regional_officer", "chapter_officer"],
  },
  { href: "/dashboard/content", label: "Content CMS", icon: ScrollText, roles: ["super_admin", "national_officer"] },
  { href: "/dashboard/settings", label: "Settings & Security", icon: ShieldAlert, roles: ["super_admin"] },
] as const;

export function SidebarNav({ role }: { role: string }) {
  const pathname = usePathname();
  const visibleNav = NAV.filter((item) => item.roles === "all" || item.roles.includes(role as any));

  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {visibleNav.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-card px-3 py-2 text-sm transition-colors ${
              isActive
                ? "bg-onyx text-gold"
                : "text-parchment-muted hover:bg-onyx hover:text-gold"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
