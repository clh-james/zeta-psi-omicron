import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MemberProfile } from "@/components/dashboard/member-profile";

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user?.id)
    .single();

  const role = profile?.role ?? "member";
  // Determine if the current user can approve (super_admin, national_officer, regional_officer, chapter_officer)
  const canApprove = ["super_admin", "national_officer", "regional_officer", "chapter_officer"].includes(role);

  // Fetch the member details
  const { data: member, error: memberError } = await supabase
    .from("members")
    .select(`
      *,
      chapters ( name ),
      regions ( name ),
      positions ( title )
    `)
    .eq("id", id)
    .single();

  if (memberError || !member) {
    notFound();
  }

  // Fetch related documents
  const { data: documentsData } = await supabase
    .from("documents")
    .select("*")
    .eq("member_id", id);

  const documents = await Promise.all(
    (documentsData || []).map(async (doc) => {
      // Create a short-lived signed URL for the document (valid for 1 hour)
      const { data: urlData } = await supabase.storage
        .from("documents")
        .createSignedUrl(doc.file_path, 3600);

      return {
        id: doc.id,
        type: doc.type,
        file_name: doc.file_name,
        url: urlData?.signedUrl || "#",
      };
    })
  );

  // Fetch Attendance History
  const { data: rawAttendance } = await supabase
    .from("event_attendance")
    .select(`
      status,
      events (
        id, title, starts_at, location
      )
    `)
    .eq("member_id", id)
    .order("created_at", { ascending: false });

  const attendance = (rawAttendance || []).map((a: any) => ({
    status: a.status,
    event_id: a.events?.id,
    event_title: a.events?.title,
    event_date: a.events?.starts_at,
    event_location: a.events?.location,
  }));

  return <MemberProfile member={member} documents={documents} canApprove={canApprove} attendance={attendance} />;
}
