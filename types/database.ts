// Placeholder hand-rolled types for the tables this app touches directly.
// In production, replace this file with the generated types:
//   supabase gen types typescript --project-id <ref> > types/database.ts

export type UserRole =
  | "super_admin"
  | "national_officer"
  | "regional_officer"
  | "chapter_officer"
  | "member";

export type MemberStatus = "active" | "inactive" | "suspended" | "honorary" | "life_member";
export type RegistrationStatus = "pending" | "approved" | "rejected";

export interface MemberRecord {
  id: string;
  user_id: string | null;
  membership_number: string | null;

  first_name: string;
  middle_name: string | null;
  last_name: string;
  suffix: string | null;
  nickname: string | null;
  gender: string | null;
  birth_date: string | null;
  civil_status: string | null;
  blood_type: string | null;
  nationality: string | null;
  religion: string | null;
  occupation: string | null;
  company: string | null;
  profession: string | null;
  height_cm: number | null;
  weight_kg: number | null;

  mobile_number: string | null;
  alternate_number: string | null;
  email: string | null;
  facebook: string | null;
  messenger: string | null;
  instagram: string | null;
  province: string | null;
  city: string | null;
  barangay: string | null;
  zip_code: string | null;
  current_address: string | null;

  chapter_id: string | null;
  region_id: string | null;
  batch: string | null;
  year_initiated: number | null;
  initiation_date: string | null;
  rank: string | null;
  position_id: string | null;
  status: MemberStatus;
  sponsor: string | null;
  recruiter: string | null;
  initiating_officers: string | null;
  years_in_service: number | null;
  awards: string | null;
  achievements: string | null;
  special_skills: string | null;
  volunteer_work: string | null;

  emergency_contact_name: string | null;
  emergency_contact_relationship: string | null;
  emergency_contact_number: string | null;
  emergency_contact_address: string | null;

  elementary_school: string | null;
  high_school: string | null;
  college: string | null;
  graduate_school: string | null;
  course: string | null;
  year_graduated: number | null;

  employer: string | null;
  job_title: string | null;
  office_address: string | null;
  years_employed: number | null;

  medical_conditions: string | null;
  allergies: string | null;
  special_notes: string | null;
  remarks: string | null;

  registration_status: RegistrationStatus;
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: string;
  name: string;
  province_id: string | null;
  region_id: string;
  is_active: boolean;
}

export interface Region {
  id: string;
  name: string;
  code: string;
}

// Generic placeholder so `createBrowserClient<Database>` / `createServerClient<Database>`
// type-check without the full generated schema.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any;
