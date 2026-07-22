-- Mirrors `Testimonial` in src/content/types.ts, plus `sort_order` and
-- `is_published` — not in the frontend type today, but the admin
-- dashboard's Testimonials section (per the original brief) needs to
-- curate which testimonials are live and in what order, so these are
-- added ahead of that UI rather than reworking the schema later.
-- `company` is intentionally plain text, not FK'd to `clients` — same
-- reasoning as `projects.client`.

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author text not null,
  role text not null,
  company text not null,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on testimonials
  for each row execute function set_updated_at();

alter table testimonials enable row level security;

create policy "public can read published testimonials" on testimonials
  for select using (is_published or is_admin());
create policy "admins manage testimonials" on testimonials
  for all using (is_admin()) with check (is_admin());
