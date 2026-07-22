-- Mirrors `Project` in src/content/types.ts. `client` is plain display
-- text (not FK'd to the `clients` logo-cloud table) — a project's client
-- name and the curated "Trusted By" logo list are independent concerns.

create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  client text not null,
  location text not null,
  year integer not null,
  category project_category not null,
  summary text not null,
  description text[] not null default '{}',
  stats jsonb not null default '[]',          -- [{ label, value }]
  visual_seed text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on projects
  for each row execute function set_updated_at();

create table project_images (
  project_id uuid not null references projects (id) on delete cascade,
  media_id uuid not null references media (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (project_id, media_id)
);

create table project_services (
  project_id uuid not null references projects (id) on delete cascade,
  service_id uuid not null references services (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (project_id, service_id)
);

create table project_equipment (
  project_id uuid not null references projects (id) on delete cascade,
  equipment_item_id uuid not null references equipment_items (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (project_id, equipment_item_id)
);

alter table projects enable row level security;
alter table project_images enable row level security;
alter table project_services enable row level security;
alter table project_equipment enable row level security;

create policy "public can read projects" on projects
  for select using (true);
create policy "admins manage projects" on projects
  for all using (is_admin()) with check (is_admin());

create policy "public can read project_images" on project_images
  for select using (true);
create policy "admins manage project_images" on project_images
  for all using (is_admin()) with check (is_admin());

create policy "public can read project_services" on project_services
  for select using (true);
create policy "admins manage project_services" on project_services
  for all using (is_admin()) with check (is_admin());

create policy "public can read project_equipment" on project_equipment
  for select using (true);
create policy "admins manage project_equipment" on project_equipment
  for all using (is_admin()) with check (is_admin());
