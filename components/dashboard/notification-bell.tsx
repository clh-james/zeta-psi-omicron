"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getNotifications, markNotificationsAsRead } from "@/app/dashboard/notifications/actions";

export function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Initial fetch
    getNotifications(userId).then(setNotifications);

    // Set up polling every 30 seconds for a real application, 
    // or use Supabase realtime subscriptions.
    const interval = setInterval(() => {
      getNotifications(userId).then(setNotifications);
    }, 30000);

    return () => clearInterval(interval);
  }, [userId]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && unreadCount > 0) {
      // Mark as read when opening the popover
      markNotificationsAsRead(userId).then(() => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      });
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-parchment-muted hover:text-gold hover:bg-onyx">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-onyx-raised">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 border-onyx-line bg-onyx-raised shadow-xl rounded-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-onyx-line bg-onyx/50">
          <h3 className="font-display text-sm text-gold">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-[10px] text-parchment-muted bg-onyx px-2 py-0.5 rounded-full border border-onyx-line">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-parchment-muted">
              You're all caught up!
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-onyx-line">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 transition-colors ${notification.is_read ? 'bg-transparent' : 'bg-gold/5'}`}
                >
                  <p className="text-sm font-medium text-parchment mb-1">{notification.title}</p>
                  <p className="text-xs text-parchment-muted leading-relaxed">{notification.body}</p>
                  <p className="text-[10px] text-parchment-muted/60 mt-2">
                    {new Date(notification.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
