"use client";

import { useState } from "react";
import { Clock, Activity, Database, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ActivityLog = {
  id: string;
  action: string;
  target_table: string | null;
  target_id: string | null;
  metadata: any;
  created_at: string;
  user_name: string;
};

type AuditLog = {
  id: string;
  table_name: string;
  record_id: string;
  operation: string;
  old_data: any;
  new_data: any;
  created_at: string;
  user_name: string;
};

export function LogsViewer({
  activityLogs,
  auditLogs,
}: {
  activityLogs: ActivityLog[];
  auditLogs: AuditLog[];
}) {
  const [activeTab, setActiveTab] = useState<"activity" | "audit">("activity");

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-2 border-b border-onyx-line pb-px">
        <button
          onClick={() => setActiveTab("activity")}
          className={`flex items-center gap-2 px-4 py-2 font-display text-sm transition-colors ${
            activeTab === "activity"
              ? "border-b-2 border-gold text-gold"
              : "text-parchment-muted hover:text-parchment"
          }`}
        >
          <Activity className="h-4 w-4" /> Activity Logs
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`flex items-center gap-2 px-4 py-2 font-display text-sm transition-colors ${
            activeTab === "audit"
              ? "border-b-2 border-gold text-gold"
              : "text-parchment-muted hover:text-parchment"
          }`}
        >
          <Database className="h-4 w-4" /> Audit Logs
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === "activity" && (
          activityLogs.length === 0 ? (
            <div className="card-surface p-12 text-center text-parchment-muted">
              <p>No activity logs found.</p>
            </div>
          ) : (
            activityLogs.map((log) => (
              <div key={log.id} className="card-surface p-4 text-sm flex flex-col md:flex-row md:items-center gap-4">
                <div className="shrink-0 text-parchment-muted w-32 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(log.created_at).toLocaleDateString()}
                </div>
                <div className="shrink-0 w-48 flex items-center gap-2 text-gold">
                  <User className="h-3.5 w-3.5" />
                  {log.user_name}
                </div>
                <div className="flex-1 text-parchment flex items-center gap-2">
                  <Badge variant="secondary" className="border-parchment-muted text-parchment font-mono lowercase">
                    {log.action}
                  </Badge>
                  {log.target_table && (
                    <span className="text-parchment-muted">
                      on <span className="text-parchment">{log.target_table}</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          )
        )}

        {activeTab === "audit" && (
          auditLogs.length === 0 ? (
            <div className="card-surface p-12 text-center text-parchment-muted">
              <p>No audit logs found.</p>
            </div>
          ) : (
            auditLogs.map((log) => (
              <div key={log.id} className="card-surface p-4 text-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4 border-b border-onyx-line pb-3">
                  <div className="shrink-0 text-parchment-muted w-32 flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(log.created_at).toLocaleDateString()}
                  </div>
                  <div className="shrink-0 w-48 flex items-center gap-2 text-gold">
                    <User className="h-3.5 w-3.5" />
                    {log.user_name}
                  </div>
                  <div className="flex-1 text-parchment flex items-center gap-2">
                    <Badge 
                      variant={
                        log.operation === "INSERT" ? "default" :
                        log.operation === "DELETE" ? "rejected" :
                        "secondary"
                      }
                      className="font-mono"
                    >
                      {log.operation}
                    </Badge>
                    <span className="text-parchment-muted">
                      on <span className="text-parchment font-mono">{log.table_name}</span>
                    </span>
                  </div>
                </div>
                
                {/* Diff Viewer (Simple JSON dump for now) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {log.old_data && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-parchment-muted mb-2">Previous State</p>
                      <pre className="bg-onyx p-3 rounded-card text-xs text-red-400 overflow-auto max-h-48 border border-red-900/30">
                        {JSON.stringify(log.old_data, null, 2)}
                      </pre>
                    </div>
                  )}
                  {log.new_data && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-parchment-muted mb-2">New State</p>
                      <pre className="bg-onyx p-3 rounded-card text-xs text-green-400 overflow-auto max-h-48 border border-green-900/30">
                        {JSON.stringify(log.new_data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}
