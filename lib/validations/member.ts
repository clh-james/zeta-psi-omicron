import { z } from "zod";

export const biodataSchema = z.object({
  // Personal
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, "Last name is required"),
  suffix: z.string().optional(),
  nickname: z.string().optional(),
  gender: z.string().min(1, "Gender is required"),
  birth_date: z.string().min(1, "Birth date is required"),
  civil_status: z.string().min(1, "Civil status is required"),
  blood_type: z.string().optional(),
  nationality: z.string().default("Filipino"),
  religion: z.string().optional(),
  occupation: z.string().optional(),
  company: z.string().optional(),
  profession: z.string().optional(),
  height_cm: z.coerce.number().positive().optional().or(z.literal("")),
  weight_kg: z.coerce.number().positive().optional().or(z.literal("")),

  // Contact
  mobile_number: z
    .string()
    .regex(/^(\+63|0)9\d{9}$/, "Enter a valid PH mobile number (e.g. 09171234567)"),
  alternate_number: z.string().optional(),
  email: z.string().email("Enter a valid email address"),
  facebook: z.string().optional(),
  messenger: z.string().optional(),
  instagram: z.string().optional(),
  province: z.string().min(1, "Province is required"),
  city: z.string().min(1, "City/Municipality is required"),
  barangay: z.string().min(1, "Barangay is required"),
  zip_code: z.string().optional(),
  current_address: z.string().min(1, "Current address is required"),

  // Fraternity
  chapter_id: z.string().uuid("Select a chapter"),
  region_id: z.string().uuid("Select a region"),
  batch: z.string().optional(),
  year_initiated: z.coerce.number().int().gte(1950).lte(new Date().getFullYear()).optional(),
  initiation_date: z.string().optional(),
  rank: z.string().optional(),
  sponsor: z.string().optional(),
  recruiter: z.string().optional(),
  initiating_officers: z.string().optional(),
  awards: z.string().optional(),
  achievements: z.string().optional(),
  special_skills: z.string().optional(),
  volunteer_work: z.string().optional(),

  // Emergency contact
  emergency_contact_name: z.string().min(1, "Emergency contact name is required"),
  emergency_contact_relationship: z.string().min(1, "Relationship is required"),
  emergency_contact_number: z
    .string()
    .regex(/^(\+63|0)9\d{9}$/, "Enter a valid PH mobile number"),
  emergency_contact_address: z.string().optional(),

  // Education
  elementary_school: z.string().optional(),
  high_school: z.string().optional(),
  college: z.string().optional(),
  graduate_school: z.string().optional(),
  course: z.string().optional(),
  year_graduated: z.coerce.number().int().optional(),

  // Employment
  employer: z.string().optional(),
  job_title: z.string().optional(),
  office_address: z.string().optional(),
  years_employed: z.coerce.number().int().optional(),

  // Additional
  medical_conditions: z.string().optional(),
  allergies: z.string().optional(),
  special_notes: z.string().optional(),
  remarks: z.string().optional(),
});

export type BiodataFormValues = z.infer<typeof biodataSchema>;

export const FILE_UPLOAD_MAX_BYTES = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
