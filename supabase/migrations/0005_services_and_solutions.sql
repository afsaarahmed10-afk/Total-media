-- Mirrors the `Service` and `Solution` interfaces in src/content/types.ts.
-- Join tables carry `sort_order` because the frontend arrays they replace
-- (relatedServiceSlugs, includedServiceSlugs, ...) are ordered lists, and
-- Postgres doesn't guarantee row order without one.

create table services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category service_category not null,
  name text not null,
  short_description text not null,
  hero_statement text not null,
  overview text[] not null default '{}',
  capabilities text[] not null default '{}',
  process jsonb not null default '[]',       -- [{ title, description }]
  ideal_for text[] not null default '{}',
  seo_title text not null,
  seo_description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on services
  for each row execute function set_updated_at();

create table service_related_services (
  service_id uuid not null references services (id) on delete cascade,
  related_service_id uuid not null references services (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (service_id, related_service_id),
  check (service_id <> related_service_id)
);

create table service_related_equipment_categories (
  service_id uuid not null references services (id) on delete cascade,
  equipment_category_id uuid not null references equipment_categories (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (service_id, equipment_category_id)
);

create table service_faqs (
  service_id uuid not null references services (id) on delete cascade,
  faq_id uuid not null references faqs (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (service_id, faq_id)
);


create table solutions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text not null,
  hero_statement text not null,
  overview text[] not null default '{}',
  highlights jsonb not null default '[]',     -- [{ title, description }]
  seo_title text not null,
  seo_description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on solutions
  for each row execute function set_updated_at();

create table solution_services (
  solution_id uuid not null references solutions (id) on delete cascade,
  service_id uuid not null references services (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (solution_id, service_id)
);


alter table services enable row level security;
alter table service_related_services enable row level security;
alter table service_related_equipment_categories enable row level security;
alter table service_faqs enable row level security;
alter table solutions enable row level security;
alter table solution_services enable row level security;

create policy "public can read services" on services
  for select using (true);
create policy "admins manage services" on services
  for all using (is_admin()) with check (is_admin());

create policy "public can read service_related_services" on service_related_services
  for select using (true);
create policy "admins manage service_related_services" on service_related_services
  for all using (is_admin()) with check (is_admin());

create policy "public can read service_related_equipment_categories" on service_related_equipment_categories
  for select using (true);
create policy "admins manage service_related_equipment_categories" on service_related_equipment_categories
  for all using (is_admin()) with check (is_admin());

create policy "public can read service_faqs" on service_faqs
  for select using (true);
create policy "admins manage service_faqs" on service_faqs
  for all using (is_admin()) with check (is_admin());

create policy "public can read solutions" on solutions
  for select using (true);
create policy "admins manage solutions" on solutions
  for all using (is_admin()) with check (is_admin());

create policy "public can read solution_services" on solution_services
  for select using (true);
create policy "admins manage solution_services" on solution_services
  for all using (is_admin()) with check (is_admin());
