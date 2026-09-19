import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsManager } from "@/components/dashboard/settings-manager";
import { AuditLogs } from "@/components/dashboard/audit-logs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldAlert, Settings } from "lucide-react";
import { requireRole } from "@/lib/rbac";

export default async function SettingsPage() {
  await requireRole(["super_admin"]);
  const supabase = await createClient();

  // Fetch audit logs
  const { data: rawAuditLogs } = await supabase
    .from("audit_logs")
    .select(`
      id, table_name, operation, created_at,
      users ( username )
    `)
    .order("created_at", { ascending: false })
    .limit(30);

  // Fetch activity logs
  const { data: rawActivityLogs } = await supabase
    .from("activity_logs")
    .select(`
      id, action, target_table, created_at,
      users ( username )
    `)
    .order("created_at", { ascending: false })
    .limit(30);

  const formattedLogs = [
    ...(rawAuditLogs || []).map((log: any) => ({
      id: log.id,
      user: log.users?.username || "System",
      action: log.operation,
      details: `${log.operation} on ${log.table_name}`,
      timestamp: log.created_at,
      type: "audit" as const,
    })),
    ...(rawActivityLogs || []).map((log: any) => ({
      id: log.id,
      user: log.users?.username || "System",
      action: log.action,
      details: `Action: ${log.action} on ${log.target_table || "system"}`,
      timestamp: log.created_at,
      type: "activity" as const,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-gold">System Settings & Security</h1>
        <p className="text-sm text-parchment-muted">Manage global parameters and monitor system integrity.</p>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-onyx-raised border border-onyx-line p-1 mb-6">
          <TabsTrigger value="settings" className="data-[state=active]:bg-onyx data-[state=active]:text-gold text-parchment-muted">
            <Settings className="w-4 h-4 mr-2" /> Global Settings
          </TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:bg-onyx data-[state=active]:text-gold text-parchment-muted">
            <ShieldAlert className="w-4 h-4 mr-2" /> Audit Trail
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <SettingsManager />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLogs logs={formattedLogs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
