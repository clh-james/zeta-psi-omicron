# Zeta Psi Omicron — National Member Information System

A national membership platform for Zeta Psi Omicron Fraternity: a fraternity password gate,
role-based login, a full member BioData registration form, and an admin dashboard for
approving, searching, and managing members nationwide.

Stack: **Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres + Auth +
Row Level Security) · Recharts**

## What's implemented in this scaffold

- **Fraternity password gate** (`/gate`) — a shared password (bcrypt-hashed, stored in
  `settings`) that must be unlocked before login/registration/dashboard are reachable.
  Enforced in `middleware.ts`, verified server-side via the `verify_fraternity_password`
  Postgres function so the hash never reaches the client.
- **Login** (`/login`) — Supabase Auth email/password, "remember me", forgot-password flow.
- **5-role RBAC**: `super_admin`, `national_officer`, `regional_officer`, `chapter_officer`,
  `member` — enforced at the database layer with Postgres Row Level Security policies
  (see `supabase/schema.sql`), not just hidden UI. Sidebar navigation in
  `app/dashboard/layout.tsx` also adapts per role.
- **Member BioData form** (`/register`) — every field group from the brief (personal,
  contact, fraternity info, emergency contact, education, employment, additional info,
  file uploads), validated client- and server-side with Zod, submitted via a Server Action
  with a basic duplicate-registration check.
- **Admin dashboard** (`/dashboard`) — KPI cards, members-per-region bar chart, status
  breakdown pie chart, recently added members.
- **Member directory** (`/dashboard/members`) — instant client-side search (name,
  membership #, chapter, region, batch), status filters, and row actions: approve
  (auto-generates the membership number via `generate_membership_number`), reject,
  suspend, restore.
- **Full Postgres schema** (`supabase/schema.sql`) — all 13 tables from the brief
  (`users`, `members`, `chapters`, `regions`, `provinces`, `positions`, `documents`,
  `announcements`, `events`, `activity_logs`, `audit_logs`, `settings`, `notifications`),
  enums, indexes, an audit-log trigger on `members`, and RLS policies for every table.

## Extension points (scaffolded but not wired end-to-end)

These are exactly the places to build next — the data model and routes already account
for them:

- **File uploads** (`documents` table + Supabase Storage) — the BioData form's upload UI
  collects files client-side; wire `supabase.storage.from('documents').upload(...)` in
  `app/register/actions.ts` after the member row is created.
- **QR code / digital member ID + printable certificates** — `qrcode` is already a
  dependency; generate against `membership_number` once approved.
- **Chapters/Regions/Officers/Announcements/Events admin CRUD screens** — routes are in
  the sidebar (`app/dashboard/chapters`, `/announcements`, `/events`, `/logs`,
  `/settings`) but not yet built; they follow the same server-component + server-action
  pattern as `/dashboard/members`.
- **Reports & exports (PDF/Excel/CSV)** — buttons are in the member directory UI; wire to
  a server route using a PDF/XLSX library.
- **Email notifications** (approval, birthdays, renewal reminders) — the `notifications`
  table and enum are in place; pair with Supabase Edge Functions or a cron job.
- **AI duplicate detection** — the BioData server action does an exact-match check today;
  upgrade to fuzzy name/address/mobile matching.
- **PWA / offline support** — add a manifest + service worker once the core flows are
  stable.

## Getting started

1. **Create a Supabase project** at supabase.com.
2. **Run the schema**:
   ```bash
   supabase link --project-ref your-project-ref
   supabase db push   # runs supabase/schema.sql
   psql < supabase/seed.sql   # optional sample regions/positions
   ```
3. **Set the real fraternity gate password** (replace the seeded default immediately):
   ```sql
   update settings set value = crypt('your-real-password', gen_salt('bf'))
   where key = 'fraternity_password_hash';
   ```
4. **Copy environment variables**:
   ```bash
   cp .env.example .env.local
   # fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
   # and SUPABASE_SERVICE_ROLE_KEY from Project Settings > API
   ```
5. **Install and run**:
   ```bash
   npm install
   npm run dev
   ```
6. **Create your first Super Admin**: sign a user up via Supabase Auth (dashboard or
   `supabase.auth.admin.createUser`), then:
   ```sql
   insert into users (id, username, email, role)
   values ('<auth-user-uuid>', 'admin', 'admin@example.com', 'super_admin');
   ```

## Deployment

Deploy to Vercel: connect the repo, set the three environment variables from
`.env.example` in the Vercel project settings, and deploy. `next.config.js` already
allows Supabase Storage image domains and raises the server-action body limit to 10MB
to match the upload cap in the brief.

## Design system

Palette and type choices live in `tailwind.config.ts` (Onyx / Regalia Gold /
Brotherhood Maroon / Parchment) — see the comment block at the top of that file for the
full token rationale. The signature visual motif is the engraved gold seal (`.seal-badge`,
`.engrave-divider` in `app/globals.css`), echoing the fraternity's own regalia rather than
a generic dashboard template.
