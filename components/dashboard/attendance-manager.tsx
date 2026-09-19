"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { markAttendance } from "@/app/dashboard/events/actions";
import { Check, X, UserMinus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type AttendanceMember = {
  id: string;
  first_name: string;
  last_name: string;
  membership_number: string | null;
  chapter_name: string | null;
  status: string;
  attendance_status: string | null;
};

export function AttendanceManager({ eventId, members }: { eventId: string; members: AttendanceMember[] }) {
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");

  const handleMark = (memberId: string, status: string) => {
    startTransition(async () => {
      await markAttendance(eventId, memberId, status);
    });
  };

  const filteredMembers = members.filter(m => 
    `${m.first_name} ${m.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    m.membership_number?.toLowerCase().includes(search.toLowerCase())
  );

  const presentCount = members.filter(m => m.attendance_status === 'present').length;
  const absentCount = members.filter(m => m.attendance_status === 'absent').length;
  const excusedCount = members.filter(m => m.attendance_status === 'excused').length;
  const unmarkedCount = members.length - presentCount - absentCount - excusedCount;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-surface p-4 text-center">
          <p className="text-sm text-parchment-muted uppercase tracking-wider">Present</p>
          <p className="text-2xl font-display text-green-500">{presentCount}</p>
        </div>
        <div className="card-surface p-4 text-center">
          <p className="text-sm text-parchment-muted uppercase tracking-wider">Absent</p>
          <p className="text-2xl font-display text-red-500">{absentCount}</p>
        </div>
        <div className="card-surface p-4 text-center">
          <p className="text-sm text-parchment-muted uppercase tracking-wider">Excused</p>
          <p className="text-2xl font-display text-gold">{excusedCount}</p>
        </div>
        <div className="card-surface p-4 text-center">
          <p className="text-sm text-parchment-muted uppercase tracking-wider">Unmarked</p>
          <p className="text-2xl font-display text-parchment">{unmarkedCount}</p>
        </div>
      </div>

      <div className="card-surface p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-parchment-muted" />
            <Input
              placeholder="Search by name or number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-parchment">
            <thead className="border-b border-onyx-line uppercase text-parchment-muted">
              <tr>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">ZPO Number</th>
                <th className="py-3 px-4">Chapter</th>
                <th className="py-3 px-4 text-right">Attendance Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-parchment-muted">
                    No members found matching your search.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b border-onyx-line/50 hover:bg-onyx-raised/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {member.first_name} {member.last_name}
                        </span>
                        <Badge variant={member.status as any}>{member.status}</Badge>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-gold/80">
                      {member.membership_number || "PENDING"}
                    </td>
                    <td className="py-3 px-4 text-parchment-muted">
                      {member.chapter_name || "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant={member.attendance_status === 'present' ? 'gold' : 'outline'}
                          className={member.attendance_status === 'present' ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-green-600/30 text-green-500 hover:bg-green-500/10'}
                          onClick={() => handleMark(member.id, 'present')}
                          disabled={isPending}
                        >
                          <Check className="w-4 h-4 mr-1" /> Present
                        </Button>
                        <Button
                          size="sm"
                          variant={member.attendance_status === 'absent' ? 'gold' : 'outline'}
                          className={member.attendance_status === 'absent' ? '' : 'border-red-500/30 text-red-500 hover:bg-red-500/10'}
                          onClick={() => handleMark(member.id, 'absent')}
                          disabled={isPending}
                        >
                          <X className="w-4 h-4 mr-1" /> Absent
                        </Button>
                        <Button
                          size="sm"
                          variant={member.attendance_status === 'excused' ? 'gold' : 'outline'}
                          className={member.attendance_status === 'excused' ? '' : 'border-gold/30 text-gold hover:bg-gold/10'}
                          onClick={() => handleMark(member.id, 'excused')}
                          disabled={isPending}
                        >
                          <UserMinus className="w-4 h-4 mr-1" /> Excused
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
