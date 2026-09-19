-- ============================================================================
-- Zeta Psi Omicron Fraternity — National Member Information System
-- Database schema for Supabase (PostgreSQL + Row Level Security)
-- ============================================================================
-- Run order: this file is idempotent-ish (uses IF NOT EXISTS / OR REPLACE)
-- but is meant to run once against a fresh Supabase project via:
--   supabase db push
-- ============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- ENUMS
-- ----------------------------------------------------------------------------

create type user_role as enum (
  'super_admin',
  'national_officer',
  'regional_officer',
  'chapter_officer',
  'member'
);

create type member_status as enum (
  'active',
  'inactive',
  'suspended',
  'honorary',
  'life_member'
);

create type registration_status as enum (
  'pending',
  'approved',
  'rejected'
);

create type civil_status as enum (
  'single',
  'married',
  'widowed',
  'separated'
);

create type document_type as enum (
  'profile_picture',
  'government_id',
  'initiation_certificate',
  'certificate',
  'award',
  'signature',
  'other'
);

create type notification_type as enum (
  'approval',
  'rejection',
  'announcement',
  'birthday',
  'renewal_reminder',
  'system'
);

-- ----------------------------------------------------------------------------
-- GEOGRAPHY / ORG STRUCTURE
-- ----------------------------------------------------------------------------

create table regions (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  code text not null unique,               -- e.g. 'NCR', 'R3', 'R7'
  created_at timestamptz not null default now()
);

create table provinces (
  id uuid primary key default uuid_generate_v4(),
  region_id uuid not null references regions(id) on delete restrict,
  name text not null,
  created_at timestamptz not null default now(),
  unique (region_id, name)
);

create table chapters (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  province_id uuid references provinces(id) on delete set null,
  region_id uuid not null references regions(id) on delete restrict,
  charter_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table positions (
  id uuid primary key default uuid_generate_v4(),
  title text not null unique,              -- Grand Master, Secretary General, etc.
  scope text not null check (scope in ('national','regional','chapter')),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- USERS (auth identity + role) — mirrors auth.users 1:1
-- ----------------------------------------------------------------------------

create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  email text not null unique,
  role user_role not null default 'member',
  chapter_id uuid references chapters(id) on delete set null,
  region_id uuid references regions(id) on delete set null,
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- MEMBERS — the full BioData record
-- ----------------------------------------------------------------------------

create table members (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete set null,
  membership_number text unique,           -- auto-generated on approval, e.g. ZPO-07-000482

  -- Personal information
  first_name text not null,
  middle_name text,
  last_name text not null,
  suffix text,
  nickname text,
  gender text,
  birth_date date,
  civil_status civil_status,
  blood_type text,
  nationality text default 'Filipino',
  religion text,
  occupation text,
  company text,
  profession text,
  height_cm numeric(5,1),
  weight_kg numeric(5,1),

  -- Contact information
  mobile_number text,
  alternate_number text,
  email text,
  facebook text,
  messenger text,
  instagram text,
  province text,
  city text,
  barangay text,
  zip_code text,
  current_address text,

  -- Fraternity information
  chapter_id uuid references chapters(id) on delete set null,
  region_id uuid references regions(id) on delete set null,
  batch text,
  year_initiated int,
  initiation_date date,
  rank text,
  position_id uuid references positions(id) on delete set null,
  status member_status not null default 'active',
  sponsor text,
  recruiter text,
  initiating_officers text,
  years_in_service int,
  awards text,
  achievements text,
  special_skills text,
  volunteer_work text,

  -- Emergency contact
  emergency_contact_name text,
  emergency_contact_relationship text,
  emergency_contact_number text,
  emergency_contact_address text,

  -- Education
  elementary_school text,
  high_school text,
  college text,
  graduate_school text,
  course text,
  year_graduated int,

  -- Employment
  employer text,
  job_title text,
  office_address text,
  years_employed int,

  -- Additional
  medical_conditions text,
  allergies text,
  special_notes text,
  remarks text,

  -- Registration lifecycle
  registration_status registration_status not null default 'pending',
  approved_by uuid references users(id) on delete set null,
  approved_at timestamptz,
  rejected_reason text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_members_chapter on members(chapter_id);
create index idx_members_region on members(region_id);
create index idx_members_status on members(status);
create index idx_members_registration_status on members(registration_status);
create index idx_members_name on members(last_name, first_name);
create index idx_members_membership_number on members(membership_number);

-- ----------------------------------------------------------------------------
-- DOCUMENTS (file uploads: photo, IDs, certificates, awards)
-- ----------------------------------------------------------------------------

create table documents (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid not null references members(id) on delete cascade,
  type document_type not null,
  file_path text not null,                 -- Supabase Storage object path
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes <= 10485760), -- 10MB cap
  uploaded_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index idx_documents_member on documents(member_id);

-- ----------------------------------------------------------------------------
-- ANNOUNCEMENTS & EVENTS
-- ----------------------------------------------------------------------------

create table announcements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  body text not null,
  audience_scope text not null default 'national' check (audience_scope in ('national','regional','chapter')),
  region_id uuid references regions(id) on delete cascade,
  chapter_id uuid references chapters(id) on delete cascade,
  published_at timestamptz,
  is_pinned boolean not null default false,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  location text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  audience_scope text not null default 'national' check (audience_scope in ('national','regional','chapter')),
  region_id uuid references regions(id) on delete cascade,
  chapter_id uuid references chapters(id) on delete cascade,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table event_attendance (
  event_id uuid references events(id) on delete cascade,
  member_id uuid references members(id) on delete cascade,
  status text not null check (status in ('present', 'absent', 'excused')),
  recorded_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (event_id, member_id)
);

-- ----------------------------------------------------------------------------
-- LOGS
-- ----------------------------------------------------------------------------

create table activity_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete set null,
  action text not null,                    -- e.g. 'member.approve', 'member.edit'
  target_table text,
  target_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete set null,
  table_name text not null,
  record_id uuid not null,
  operation text not null check (operation in ('INSERT','UPDATE','DELETE')),
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create index idx_activity_logs_user on activity_logs(user_id);
create index idx_audit_logs_table_record on audit_logs(table_name, record_id);

-- ----------------------------------------------------------------------------
-- SETTINGS (fraternity password gate, super-admin controlled)
-- ----------------------------------------------------------------------------

create table settings (
  key text primary key,
  value text not null,
  updated_by uuid references users(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- The fraternity password gate is stored hashed, never plaintext.
-- Seed a default — CHANGE THIS IMMEDIATELY after first deploy (see README).
insert into settings (key, value)
values ('fraternity_password_hash', crypt('ChangeMe_ZPO2026', gen_salt('bf')))
on conflict (key) do nothing;

-- Verifies the fraternity gate password against the stored bcrypt hash.
-- security definer so the anon/authenticated role never needs direct
-- select access on `settings` (which also holds other sensitive config).
create or replace function verify_fraternity_password(p_password text)
returns boolean
language plpgsql
security definer
as $$
declare
  v_hash text;
begin
  select value into v_hash from settings where key = 'fraternity_password_hash';
  if v_hash is null then
    return false;
  end if;
  return v_hash = crypt(p_password, v_hash);
end;
$$;

-- Only the service-role key (used server-side by the /api/gate/unlock route)
-- may execute this — never expose it to anon/authenticated directly.
revoke execute on function verify_fraternity_password(text) from public, anon, authenticated;

-- Updates the fraternity gate password hash.
-- security definer so the service-role or super_admin can update the settings.
create or replace function update_fraternity_password(p_new_password text)
returns void
language plpgsql
security definer
as $$
begin
  if current_user_role() != 'super_admin' then
    raise exception 'Unauthorized: Only super admins can update the fraternity password.';
  end if;

  update settings
  set 
    value = crypt(p_new_password, gen_salt('bf')),
    updated_at = now(),
    updated_by = auth.uid()
  where key = 'fraternity_password_hash';
end;
$$;

revoke execute on function update_fraternity_password(text) from public, anon, authenticated;

-- ----------------------------------------------------------------------------
-- SITE CONTENT (Dynamic About, History, etc.)
-- ----------------------------------------------------------------------------

create table site_content (
  key text primary key,
  value jsonb not null,
  updated_by uuid references users(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- Initial default content
insert into site_content (key, value) values 
('mission', '{"text": "To foster leadership, academic excellence, and an unbreakable bond of brotherhood."}'),
('vision', '{"text": "To be the premier national fraternity shaping the next generation of leaders."}'),
('core_values', '{"values": ["Leadership", "Brotherhood", "Excellence", "Service"]}'),
('history_timeline', '{"events": [{"year": "1965", "title": "Founding", "description": "Established at the University of the Philippines Los Baños (UPLB)."}]}')
on conflict (key) do nothing;

alter table site_content enable row level security;
create policy site_content_read on site_content for select using (true); -- Publicly readable
create policy site_content_write on site_content for all
  using (current_user_role() in ('super_admin','national_officer'));

-- ----------------------------------------------------------------------------
-- NOTIFICATIONS
-- ----------------------------------------------------------------------------

create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  type notification_type not null,
  title text not null,
  body text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_notifications_user on notifications(user_id, is_read);

-- ----------------------------------------------------------------------------
-- FUNCTIONS
-- ----------------------------------------------------------------------------

-- Generates the next membership number for a chapter, format: ZPO-<chapter short>-<seq>
create or replace function generate_membership_number(p_chapter_id uuid)
returns text
language plpgsql
security definer
as $$
declare
  v_seq int;
  v_code text;
begin
  select count(*) + 1 into v_seq from members where chapter_id = p_chapter_id;
  select upper(left(regexp_replace(name, '[^a-zA-Z]', '', 'g'), 3)) into v_code
    from chapters where id = p_chapter_id;
  return 'ZPO-' || coalesce(v_code, 'GEN') || '-' || lpad(v_seq::text, 6, '0');
end;
$$;

-- Keeps updated_at fresh
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_users_updated_at before update on users
  for each row execute function set_updated_at();
create trigger trg_members_updated_at before update on members
  for each row execute function set_updated_at();

-- Writes an audit_log row on every member change
create or replace function audit_members()
returns trigger language plpgsql security definer as $$
begin
  insert into audit_logs (user_id, table_name, record_id, operation, old_data, new_data)
  values (
    auth.uid(),
    'members',
    coalesce(new.id, old.id),
    tg_op,
    case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('UPDATE','INSERT') then to_jsonb(new) else null end
  );
  return coalesce(new, old);
end;
$$;

create trigger trg_audit_members
  after insert or update or delete on members
  for each row execute function audit_members();

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------

alter table users enable row level security;
alter table members enable row level security;
alter table documents enable row level security;
alter table chapters enable row level security;
alter table regions enable row level security;
alter table provinces enable row level security;
alter table positions enable row level security;
alter table announcements enable row level security;
alter table events enable row level security;
alter table activity_logs enable row level security;
alter table audit_logs enable row level security;
alter table settings enable row level security;
alter table notifications enable row level security;

-- Helper: current user's role, chapter, region (avoids recursive RLS lookups)
create or replace function current_user_role() returns user_role
language sql security definer stable as $$
  select role from users where id = auth.uid();
$$;

create or replace function current_user_chapter() returns uuid
language sql security definer stable as $$
  select chapter_id from users where id = auth.uid();
$$;

create or replace function current_user_region() returns uuid
language sql security definer stable as $$
  select region_id from users where id = auth.uid();
$$;

-- USERS: read own row; admins/officers read within scope; only super_admin writes roles
create policy users_select_self on users for select
  using (id = auth.uid());
create policy users_select_admin on users for select
  using (current_user_role() in ('super_admin','national_officer'));
create policy users_select_regional on users for select
  using (current_user_role() = 'regional_officer' and region_id = current_user_region());
create policy users_select_chapter on users for select
  using (current_user_role() = 'chapter_officer' and chapter_id = current_user_chapter());
create policy users_update_self on users for update
  using (id = auth.uid());
create policy users_manage_super_admin on users for all
  using (current_user_role() = 'super_admin');

-- MEMBERS: read scoped by role; write scoped by role
create policy members_select_self on members for select
  using (user_id = auth.uid());
create policy members_select_national on members for select
  using (current_user_role() in ('super_admin','national_officer'));
create policy members_select_regional on members for select
  using (current_user_role() = 'regional_officer' and region_id = current_user_region());
create policy members_select_chapter on members for select
  using (current_user_role() = 'chapter_officer' and chapter_id = current_user_chapter());

create policy members_insert_self on members for insert
  with check (user_id = auth.uid() or current_user_role() in ('super_admin','national_officer','regional_officer','chapter_officer'));

create policy members_update_national on members for update
  using (current_user_role() in ('super_admin','national_officer'));
create policy members_update_regional on members for update
  using (current_user_role() = 'regional_officer' and region_id = current_user_region());
create policy members_update_chapter on members for update
  using (current_user_role() = 'chapter_officer' and chapter_id = current_user_chapter());
create policy members_update_self_pending on members for update
  using (user_id = auth.uid() and registration_status = 'pending');

create policy members_delete_super_admin on members for delete
  using (current_user_role() = 'super_admin');

-- DOCUMENTS: visible to the member who owns them + officers who can see that member
create policy documents_select on documents for select
  using (
    exists (
      select 1 from members m
      where m.id = documents.member_id
        and (
          m.user_id = auth.uid()
          or current_user_role() in ('super_admin','national_officer')
          or (current_user_role() = 'regional_officer' and m.region_id = current_user_region())
          or (current_user_role() = 'chapter_officer' and m.chapter_id = current_user_chapter())
        )
    )
  );
create policy documents_insert on documents for insert
  with check (uploaded_by = auth.uid());
create policy documents_delete_admin on documents for delete
  using (current_user_role() in ('super_admin','national_officer','chapter_officer'));

-- Reference tables: readable by all authenticated users, writable by national+ officers
create policy ref_read_chapters on chapters for select using (auth.role() = 'authenticated');
create policy ref_write_chapters on chapters for all
  using (current_user_role() in ('super_admin','national_officer'));
create policy ref_read_regions on regions for select using (auth.role() = 'authenticated');
create policy ref_write_regions on regions for all
  using (current_user_role() in ('super_admin','national_officer'));
create policy ref_read_provinces on provinces for select using (auth.role() = 'authenticated');
create policy ref_write_provinces on provinces for all
  using (current_user_role() in ('super_admin','national_officer'));
create policy ref_read_positions on positions for select using (auth.role() = 'authenticated');
create policy ref_write_positions on positions for all
  using (current_user_role() in ('super_admin','national_officer'));

-- Announcements & events: read by all authenticated, write by officers
create policy announcements_read on announcements for select using (auth.role() = 'authenticated');
create policy announcements_write on announcements for all
  using (current_user_role() in ('super_admin','national_officer','regional_officer','chapter_officer'));
create policy events_read on events for select using (auth.role() = 'authenticated');
create policy events_write on events for all
  using (current_user_role() in ('super_admin','national_officer','regional_officer','chapter_officer'));

alter table event_attendance enable row level security;
create policy attendance_read on event_attendance for select using (auth.role() = 'authenticated');
create policy attendance_write on event_attendance for all
  using (current_user_role() in ('super_admin','national_officer','regional_officer','chapter_officer'));

-- Logs: only admins/officers can read; system (security definer functions) writes
create policy activity_logs_read on activity_logs for select
  using (current_user_role() in ('super_admin','national_officer','regional_officer','chapter_officer'));
create policy audit_logs_read on audit_logs for select
  using (current_user_role() in ('super_admin','national_officer'));

-- Settings: only super_admin
create policy settings_super_admin on settings for all
  using (current_user_role() = 'super_admin');

-- Notifications: users see their own only
create policy notifications_own on notifications for select
  using (user_id = auth.uid());
create policy notifications_update_own on notifications for update
  using (user_id = auth.uid());
