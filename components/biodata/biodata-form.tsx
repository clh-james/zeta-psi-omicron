"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { UploadCloud, ChevronRight, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { biodataSchema, type BiodataFormValues } from "@/lib/validations/member";
import { submitBiodata } from "@/app/register/actions";

const SECTIONS = [
  "personal",
  "contact",
  "fraternity",
  "emergency",
  "background",
  "additional",
] as const;

const SECTION_LABELS: Record<(typeof SECTIONS)[number], string> = {
  personal: "Personal",
  contact: "Contact",
  fraternity: "Fraternity",
  emergency: "Emergency Contact",
  background: "Education & Work",
  additional: "Additional & Files",
};

// Chapters/regions would normally be fetched server-side and passed in as props;
// kept as a prop here so this component stays reusable/testable.
export function BiodataForm({
  chapters,
  regions,
}: {
  chapters: { id: string; name: string }[];
  regions: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [section, setSection] = useState<(typeof SECTIONS)[number]>("personal");
  const [serverError, setServerError] = useState<string | null>(null);
  const [files, setFiles] = useState<Record<string, File | null>>({
    profile_picture: null,
    government_id: null,
    initiation_certificate: null,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BiodataFormValues>({
    resolver: zodResolver(biodataSchema),
    defaultValues: { nationality: "Filipino" },
  });

  // Location state
  const [provinces, setProvinces] = useState<{ code: string; name: string }[]>([]);
  const [cities, setCities] = useState<{ code: string; name: string }[]>([]);
  const [barangays, setBarangays] = useState<{ code: string; name: string }[]>([]);
  
  const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
  const [selectedCityCode, setSelectedCityCode] = useState("");
  const [selectedBarangayCode, setSelectedBarangayCode] = useState("");

  useEffect(() => {
    fetch("https://psgc.gitlab.io/api/provinces/")
      .then((res) => res.json())
      .then((data) => {
        // Add Metro Manila manually since it's a region, not a province in PSGC
        const sortedProvinces = [...data, { code: "130000000", name: "Metro Manila" }].sort((a, b) => a.name.localeCompare(b.name));
        setProvinces(sortedProvinces);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedProvinceCode) {
      setCities([]);
      return;
    }
    
    // Handle Metro Manila region special case
    const endpoint = selectedProvinceCode === "130000000" 
      ? `https://psgc.gitlab.io/api/regions/130000000/cities-municipalities/`
      : `https://psgc.gitlab.io/api/provinces/${selectedProvinceCode}/cities-municipalities/`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        const sortedCities = [...data].sort((a, b) => a.name.localeCompare(b.name));
        setCities(sortedCities);
      })
      .catch(console.error);
  }, [selectedProvinceCode]);

  useEffect(() => {
    if (!selectedCityCode) {
      setBarangays([]);
      return;
    }
    fetch(`https://psgc.gitlab.io/api/cities-municipalities/${selectedCityCode}/barangays/`)
      .then((res) => res.json())
      .then((data) => {
        const sortedBarangays = [...data].sort((a, b) => a.name.localeCompare(b.name));
        setBarangays(sortedBarangays);
      })
      .catch(console.error);
  }, [selectedCityCode]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setSelectedProvinceCode(code);
    setSelectedCityCode("");
    setSelectedBarangayCode("");
    setValue("city", "");
    setValue("barangay", "");
    const name = provinces.find(p => p.code === code)?.name || "";
    setValue("province", name, { shouldValidate: true });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setSelectedCityCode(code);
    setSelectedBarangayCode("");
    setValue("barangay", "");
    const name = cities.find(c => c.code === code)?.name || "";
    setValue("city", name, { shouldValidate: true });
  };

  const handleBarangayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setSelectedBarangayCode(code);
    const name = barangays.find(b => b.code === code)?.name || "";
    setValue("barangay", name, { shouldValidate: true });
  };

  const sectionIndex = SECTIONS.indexOf(section);

  function goNext() {
    if (sectionIndex < SECTIONS.length - 1) setSection(SECTIONS[sectionIndex + 1]);
  }
  function goBack() {
    if (sectionIndex > 0) setSection(SECTIONS[sectionIndex - 1]);
  }

  async function onSubmit(values: BiodataFormValues) {
    setServerError(null);

    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        formData.append(key, val.toString());
      }
    });

    if (files.profile_picture) formData.append("profile_picture", files.profile_picture);
    if (files.government_id) formData.append("government_id", files.government_id);
    if (files.initiation_certificate) formData.append("initiation_certificate", files.initiation_certificate);

    const result = await submitBiodata(formData);

    if (!result.ok) {
      const firstError = Object.values(result.errors)[0]?.[0];
      setServerError(firstError || "Something went wrong. Please review your entries.");
      return;
    }

    router.push("/register/success");
  }

  function handleFileChange(key: string, fileList: FileList | null) {
    const file = fileList?.[0] ?? null;
    if (file && file.size > 10 * 1024 * 1024) {
      setServerError(`${file.name} exceeds the 10MB upload limit.`);
      return;
    }
    setFiles((prev) => ({ ...prev, [key]: file }));
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <div className="h-16 w-16 overflow-hidden rounded-full shadow-emboss">
          <Image
            src="/zeta-psi-omicron-seal.png"
            alt="Zeta Psi Omicron Fraternity Seal"
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        </div>
        <h1 className="font-display text-2xl text-gold">Member BioData Form</h1>
        <p className="max-w-md text-sm text-parchment-muted">
          Complete every section below. Your registration will be reviewed by your chapter
          officers before your membership number is issued.
        </p>
      </div>

      <Tabs value={section} onValueChange={(v) => setSection(v as typeof section)}>
        <TabsList>
          {SECTIONS.map((s) => (
            <TabsTrigger key={s} value={s}>
              {SECTION_LABELS[s]}
            </TabsTrigger>
          ))}
        </TabsList>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TabsContent value="personal" className="card-surface space-y-4 p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="First Name" error={errors.first_name?.message}>
                <Input {...register("first_name")} />
              </Field>
              <Field label="Middle Name" error={errors.middle_name?.message}>
                <Input {...register("middle_name")} />
              </Field>
              <Field label="Last Name" error={errors.last_name?.message}>
                <Input {...register("last_name")} />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Suffix" error={errors.suffix?.message}>
                <Input {...register("suffix")} placeholder="Jr., III, etc." />
              </Field>
              <Field label="Nickname" error={errors.nickname?.message}>
                <Input {...register("nickname")} />
              </Field>
              <Field label="Gender" error={errors.gender?.message}>
                <Input {...register("gender")} placeholder="Male / Female" />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Birth Date" error={errors.birth_date?.message}>
                <Input type="date" {...register("birth_date")} />
              </Field>
              <Field label="Civil Status" error={errors.civil_status?.message}>
                <Input {...register("civil_status")} placeholder="Single / Married" />
              </Field>
              <Field label="Blood Type" error={errors.blood_type?.message}>
                <Input {...register("blood_type")} placeholder="O+, A-, etc." />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Nationality" error={errors.nationality?.message}>
                <Input {...register("nationality")} />
              </Field>
              <Field label="Religion" error={errors.religion?.message}>
                <Input {...register("religion")} />
              </Field>
              <Field label="Occupation" error={errors.occupation?.message}>
                <Input {...register("occupation")} />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-4">
              <Field label="Company" error={errors.company?.message}>
                <Input {...register("company")} />
              </Field>
              <Field label="Profession" error={errors.profession?.message}>
                <Input {...register("profession")} />
              </Field>
              <Field label="Height (cm)" error={errors.height_cm?.message as string}>
                <Input type="number" step="0.1" {...register("height_cm")} />
              </Field>
              <Field label="Weight (kg)" error={errors.weight_kg?.message as string}>
                <Input type="number" step="0.1" {...register("weight_kg")} />
              </Field>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="card-surface space-y-4 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Mobile Number" error={errors.mobile_number?.message}>
                <Input {...register("mobile_number")} placeholder="09171234567" />
              </Field>
              <Field label="Alternate Number" error={errors.alternate_number?.message}>
                <Input {...register("alternate_number")} />
              </Field>
            </div>
            <Field label="Email Address" error={errors.email?.message}>
              <Input type="email" {...register("email")} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Facebook" error={errors.facebook?.message}>
                <Input {...register("facebook")} />
              </Field>
              <Field label="Messenger" error={errors.messenger?.message}>
                <Input {...register("messenger")} />
              </Field>
              <Field label="Instagram" error={errors.instagram?.message}>
                <Input {...register("instagram")} />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Province" error={errors.province?.message}>
                <select
                  className="flex h-10 w-full rounded-card border border-onyx-line bg-onyx-raised px-3 text-sm text-parchment focus-visible:outline-none focus-visible:border-gold"
                  onChange={handleProvinceChange}
                  value={selectedProvinceCode}
                >
                  <option value="" disabled>Select province…</option>
                  {provinces.map((p) => (
                    <option key={p.code} value={p.code}>{p.name}</option>
                  ))}
                </select>
                <input type="hidden" {...register("province")} />
              </Field>
              <Field label="City / Municipality" error={errors.city?.message}>
                <select
                  className="flex h-10 w-full rounded-card border border-onyx-line bg-onyx-raised px-3 text-sm text-parchment focus-visible:outline-none focus-visible:border-gold disabled:opacity-50"
                  onChange={handleCityChange}
                  value={selectedCityCode}
                  disabled={!selectedProvinceCode || cities.length === 0}
                >
                  <option value="" disabled>Select city…</option>
                  {cities.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
                <input type="hidden" {...register("city")} />
              </Field>
              <Field label="Barangay" error={errors.barangay?.message}>
                <select
                  className="flex h-10 w-full rounded-card border border-onyx-line bg-onyx-raised px-3 text-sm text-parchment focus-visible:outline-none focus-visible:border-gold disabled:opacity-50"
                  onChange={handleBarangayChange}
                  value={selectedBarangayCode}
                  disabled={!selectedCityCode || barangays.length === 0}
                >
                  <option value="" disabled>Select barangay…</option>
                  {barangays.map((b) => (
                    <option key={b.code} value={b.code}>{b.name}</option>
                  ))}
                </select>
                <input type="hidden" {...register("barangay")} />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="ZIP Code" error={errors.zip_code?.message}>
                <Input {...register("zip_code")} />
              </Field>
              <Field
                label="Current Address"
                error={errors.current_address?.message}
                className="sm:col-span-2"
              >
                <Input {...register("current_address")} />
              </Field>
            </div>
          </TabsContent>

          <TabsContent value="fraternity" className="card-surface space-y-4 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Chapter" error={errors.chapter_id?.message}>
                <select
                  {...register("chapter_id")}
                  className="flex h-10 w-full rounded-card border border-onyx-line bg-onyx-raised px-3 text-sm text-parchment focus-visible:outline-none focus-visible:border-gold"
                >
                  <option value="">Select chapter…</option>
                  {chapters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Region" error={errors.region_id?.message}>
                <select
                  {...register("region_id")}
                  className="flex h-10 w-full rounded-card border border-onyx-line bg-onyx-raised px-3 text-sm text-parchment focus-visible:outline-none focus-visible:border-gold"
                >
                  <option value="">Select region…</option>
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Batch" error={errors.batch?.message}>
                <Input {...register("batch")} />
              </Field>
              <Field label="Year Initiated" error={errors.year_initiated?.message as string}>
                <Input type="number" {...register("year_initiated")} />
              </Field>
              <Field label="Initiation Date" error={errors.initiation_date?.message}>
                <Input type="date" {...register("initiation_date")} />
              </Field>
            </div>
            <Field label="Rank" error={errors.rank?.message}>
              <Input {...register("rank")} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Sponsor" error={errors.sponsor?.message}>
                <Input {...register("sponsor")} />
              </Field>
              <Field label="Recruiter" error={errors.recruiter?.message}>
                <Input {...register("recruiter")} />
              </Field>
            </div>
            <Field label="Initiating Officers" error={errors.initiating_officers?.message}>
              <Textarea {...register("initiating_officers")} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Awards" error={errors.awards?.message}>
                <Textarea {...register("awards")} />
              </Field>
              <Field label="Achievements" error={errors.achievements?.message}>
                <Textarea {...register("achievements")} />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Special Skills" error={errors.special_skills?.message}>
                <Textarea {...register("special_skills")} />
              </Field>
              <Field label="Volunteer Work" error={errors.volunteer_work?.message}>
                <Textarea {...register("volunteer_work")} />
              </Field>
            </div>
          </TabsContent>

          <TabsContent value="emergency" className="card-surface space-y-4 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Contact Name"
                error={errors.emergency_contact_name?.message}
              >
                <Input {...register("emergency_contact_name")} />
              </Field>
              <Field
                label="Relationship"
                error={errors.emergency_contact_relationship?.message}
              >
                <Input {...register("emergency_contact_relationship")} />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Contact Number"
                error={errors.emergency_contact_number?.message}
              >
                <Input {...register("emergency_contact_number")} placeholder="09171234567" />
              </Field>
              <Field label="Address" error={errors.emergency_contact_address?.message}>
                <Input {...register("emergency_contact_address")} />
              </Field>
            </div>
          </TabsContent>

          <TabsContent value="background" className="card-surface space-y-6 p-6">
            <div>
              <p className="mb-3 font-display text-sm tracking-wide text-gold">
                Educational Background
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Elementary" error={errors.elementary_school?.message}>
                  <Input {...register("elementary_school")} />
                </Field>
                <Field label="High School" error={errors.high_school?.message}>
                  <Input {...register("high_school")} />
                </Field>
                <Field label="College" error={errors.college?.message}>
                  <Input {...register("college")} />
                </Field>
                <Field label="Graduate School" error={errors.graduate_school?.message}>
                  <Input {...register("graduate_school")} />
                </Field>
                <Field label="Course" error={errors.course?.message}>
                  <Input {...register("course")} />
                </Field>
                <Field label="Year Graduated" error={errors.year_graduated?.message as string}>
                  <Input type="number" {...register("year_graduated")} />
                </Field>
              </div>
            </div>
            <div className="engrave-divider" />
            <div>
              <p className="mb-3 font-display text-sm tracking-wide text-gold">Employment</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Employer" error={errors.employer?.message}>
                  <Input {...register("employer")} />
                </Field>
                <Field label="Job Title" error={errors.job_title?.message}>
                  <Input {...register("job_title")} />
                </Field>
                <Field
                  label="Office Address"
                  error={errors.office_address?.message}
                  className="sm:col-span-2"
                >
                  <Input {...register("office_address")} />
                </Field>
                <Field label="Years Employed" error={errors.years_employed?.message as string}>
                  <Input type="number" {...register("years_employed")} />
                </Field>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="additional" className="card-surface space-y-6 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Medical Conditions" error={errors.medical_conditions?.message}>
                <Textarea {...register("medical_conditions")} placeholder="None, if not applicable" />
              </Field>
              <Field label="Allergies" error={errors.allergies?.message}>
                <Textarea {...register("allergies")} placeholder="None, if not applicable" />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Special Notes" error={errors.special_notes?.message}>
                <Textarea {...register("special_notes")} />
              </Field>
              <Field label="Remarks" error={errors.remarks?.message}>
                <Textarea {...register("remarks")} />
              </Field>
            </div>

            <div className="engrave-divider" />

            <div>
              <p className="mb-3 font-display text-sm tracking-wide text-gold">File Uploads</p>
              <p className="mb-4 text-xs text-parchment-muted">
                Accepted formats: PDF, JPG, PNG. Maximum 10MB each.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <FileDropField
                  label="Profile Picture"
                  file={files.profile_picture}
                  onChange={(fl) => handleFileChange("profile_picture", fl)}
                />
                <FileDropField
                  label="Government ID"
                  file={files.government_id}
                  onChange={(fl) => handleFileChange("government_id", fl)}
                />
                <FileDropField
                  label="Initiation Certificate"
                  file={files.initiation_certificate}
                  onChange={(fl) => handleFileChange("initiation_certificate", fl)}
                />
              </div>
            </div>
          </TabsContent>

          {serverError && (
            <p role="alert" className="mt-4 text-sm font-medium text-maroon-light">
              {serverError}
            </p>
          )}

          <div className="mt-6 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={goBack}
              disabled={sectionIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>

            {sectionIndex < SECTIONS.length - 1 ? (
              <Button type="button" variant="outline" onClick={goNext}>
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting…" : "Submit BioData"}
              </Button>
            )}
          </div>
        </form>
      </Tabs>
    </div>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-maroon-light">{error}</p>}
    </div>
  );
}

function FileDropField({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | null;
  onChange: (files: FileList | null) => void;
}) {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border border-dashed border-gold/30 bg-onyx px-3 py-6 text-center transition-colors hover:border-gold/60">
      <UploadCloud className="h-5 w-5 text-gold/70" />
      <span className="text-xs text-parchment-muted">{label}</span>
      <span className="max-w-full truncate text-[11px] text-gold">
        {file ? file.name : "Tap to upload"}
      </span>
      <input
        type="file"
        accept="application/pdf,image/jpeg,image/png"
        className="hidden"
        onChange={(e) => onChange(e.target.files)}
      />
    </label>
  );
}
