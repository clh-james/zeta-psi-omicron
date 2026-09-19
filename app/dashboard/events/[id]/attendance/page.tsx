import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { AttendanceManager } from "@/components/dashboard/attendance-manager";

export default async function AttendancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role, region_id, chapter_id")
    .eq("id", userData.user.id)
    .single();

  const role = profile?.role || "member";
  if (!["super_admin", "national_officer", "regional_officer", "chapter_officer"].includes(role)) {
    redirect("/dashboard/events");
  }

  // Fetch the event
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, title, starts_at, ends_at, audience_scope, region_id, chapter_id")
    .eq("id", id)
    .single();

  if (eventError || !event) {
    notFound();
  }

  // Build the query to fetch members within scope
  let membersQuery = supabase.from("members").select("id, first_name, last_name, membership_number, status, chapters(name)");

  // Filter members based on event scope
  if (event.audience_scope === "regional" && event.region_id) {
    membersQuery = membersQuery.eq("region_id", event.region_id);
  } else if (event.audience_scope === "chapter" && event.chapter_id) {
    membersQuery = membersQuery.eq("chapter_id", event.chapter_id);
  }

  const { data: membersList, error: membersError } = await membersQuery.order("last_name");

  // Fetch existing attendance
  const { data: attendanceData } = await supabase
    .from("event_attendance")
    .select("member_id, status")
    .eq("event_id", id);

  const attendanceMap = new Map();
  attendanceData?.forEach(record => {
    attendanceMap.set(record.member_id, record.status);
  });

  const formattedMembers = (membersList || []).map((m: any) => ({
    id: m.id,
    first_name: m.first_name,
    last_name: m.last_name,
    membership_number: m.membership_number,
    chapter_name: m.chapters?.name,
    status: m.status,
    attendance_status: attendanceMap.get(m.id) || null,
  }));

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="font-display text-2xl text-gold">Track Attendance: {event.title}</h1>
        <p className="text-sm text-parchment-muted">
          {new Date(event.starts_at).toLocaleDateString()}
        </p>
      </div>
      
      <AttendanceManager eventId={event.id} members={formattedMembers} />
    </div>
  );
}
