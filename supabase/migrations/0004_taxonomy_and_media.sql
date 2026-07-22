-- Lookup/taxonomy tables plus the shared media asset library. All publicly
-- readable (they back public pages); writes are admin-only.

create table equipment_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on equipment_categories
  for each row execute function set_updated_at();

create table blog_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on blog_categories
  for each row execute function set_updated_at();

-- Marketing "Trusted By" logo cloud — unrelated to `customers`.
create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on clients
  for each row execute function set_updated_at();

create table faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category faq_category,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on faqs
  for each row execute function set_updated_at();

create table industries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  use_cases text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on industries
  for each row execute function set_updated_at();

-- Backs Supabase Storage objects in the `media` bucket (see
-- 0012_storage_buckets.sql). Referenced by equipment_images, project_images,
-- and blog_posts.cover_media_id.
create table media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  file_name text not null,
  mime_type text not null,
  size_bytes integer,
  alt_text text,
  width integer,
  height integer,
  uploaded_by uuid references admin_users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on media
  for each row execute function set_updated_at();

alter table equipment_categories enable row level security;
alter table blog_categories enable row level security;
alter table clients enable row level security;
alter table faqs enable row level security;
alter table industries enable row level security;
alter table media enable row level security;

create policy "public can read equipment_categories" on equipment_categories
  for select using (true);
create policy "admins manage equipment_categories" on equipment_categories
  for all using (is_admin()) with check (is_admin());

create policy "public can read blog_categories" on blog_categories
  for select using (true);
create policy "admins manage blog_categories" on blog_categories
  for all using (is_admin()) with check (is_admin());

create policy "public can read clients" on clients
  for select using (true);
create policy "admins manage clients" on clients
  for all using (is_admin()) with check (is_admin());

create policy "public can read faqs" on faqs
  for select using (true);
create policy "admins manage faqs" on faqs
  for all using (is_admin()) with check (is_admin());

create policy "public can read industries" on industries
  for select using (true);
create policy "admins manage industries" on industries
  for all using (is_admin()) with check (is_admin());

create policy "public can read media" on media
  for select using (true);
create policy "admins manage media" on media
  for all using (is_admin()) with check (is_admin());
