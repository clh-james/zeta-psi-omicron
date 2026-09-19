import { ShieldAlert, Database, UserCheck, Settings, Edit, UserPlus, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AuditLog {
  id: string;
  user: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'activity' | 'audit';
}

export function AuditLogs({ logs }: { logs: AuditLog[] }) {
  const getIcon = (action: string, type: string) => {
    if (type === 'audit') return <Database className="w-4 h-4" />;
    if (action.includes('approve')) return <UserCheck className="w-4 h-4" />;
    if (action.includes('edit')) return <Edit className="w-4 h-4" />;
    if (action.includes('register')) return <UserPlus className="w-4 h-4" />;
    if (action.includes('settings')) return <Settings className="w-4 h-4" />;
    return <ShieldAlert className="w-4 h-4" />;
  };

  return (
    <div className="card-surface p-6">
      <div className="flex items-center gap-3 mb-6 border-b border-onyx-line pb-4">
        <ShieldAlert className="w-5 h-5 text-gold" />
        <h2 className="font-display text-xl text-gold">System Security & Audit Trail</h2>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-onyx-line before:to-transparent">
        {logs.length === 0 ? (
          <p className="text-center text-parchment-muted text-sm relative z-10 py-8 bg-onyx">No audit logs recorded yet.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gold/30 bg-onyx text-gold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                {getIcon(log.action, log.type)}
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-card border border-onyx-line bg-onyx-raised shadow">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant={log.type === 'audit' ? 'secondary' : 'default'} className="text-[10px] uppercase">
                    {log.type}
                  </Badge>
                  <time className="text-xs text-parchment-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(log.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </time>
                </div>
                <p className="text-sm font-medium text-parchment mt-2">{log.user}</p>
                <p className="text-sm text-parchment-muted mt-1">{log.details}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
