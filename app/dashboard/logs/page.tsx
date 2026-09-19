import { createClient } from "@/lib/supabase/server";
import { LogsViewer } from "@/components/dashboard/logs-viewer";
import { redirect } from "next/navigation";

export default async function LogsPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  // Only super_admin and national_officer should probably see audit logs.
  // Activity logs can be seen by regional and chapter too (in a real app, filtered by scope).
  // For simplicity, we just fetch them all and let RLS handle it.
  
  const { data: rawActivityLogs } = await supabase
    .from("activity_logs")
    .select(`
      id, action, target_table, target_id, metadata, created_at,
      users(username)
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: rawAuditLogs } = await supabase
    .from("audit_logs")
    .select(`
      id, table_name, record_id, operation, old_data, new_data, created_at,
      users(username)
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  const activityLogs = (rawActivityLogs || []).map((log: any) => ({
    id: log.id,
    action: log.action,
    target_table: log.target_table,
    target_id: log.target_id,
    metadata: log.metadata,
    created_at: log.created_at,
    user_name: log.users?.username || "System",
  }));

  const auditLogs = (rawAuditLogs || []).map((log: any) => ({
    id: log.id,
    table_name: log.table_name,
    record_id: log.record_id,
    operation: log.operation,
    old_data: log.old_data,
    new_data: log.new_data,
    created_at: log.created_at,
    user_name: log.users?.username || "System",
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl text-gold">Activity & Audit Logs</h1>
        <p className="text-sm text-parchment-muted">View system activity and data audit trails.</p>
      </div>
      
      <LogsViewer activityLogs={activityLogs} auditLogs={auditLogs} />
    </div>
  );
}
