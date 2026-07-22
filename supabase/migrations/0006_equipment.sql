-- Mirrors `EquipmentItem` in src/content/types.ts. `visual_seed` is kept
-- even after real photography exists, so AbstractVisual remains a graceful
-- fallback for any item without gallery images yet.

create table equipment_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_id uuid not null references equipment_categories (id) on delete restrict,
  name text not null,
  summary text not null,
  description text not null,
  specs jsonb not null default '[]',          -- [{ label, value }]
  applications text[] not null default '{}',
  availability equipment_availability not null default 'in-stock',
  visual_seed text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index equipment_items_category_id_idx on equipment_items (category_id);
create trigger set_updated_at before update on equipment_items
  for each row execute function set_updated_at();

create table equipment_images (
  equipment_item_id uuid not null references equipment_items (id) on delete cascade,
  media_id uuid not null references media (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (equipment_item_id, media_id)
);

create table equipment_related_items (
  equipment_item_id uuid not null references equipment_items (id) on delete cascade,
  related_item_id uuid not null references equipment_items (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (equipment_item_id, related_item_id),
  check (equipment_item_id <> related_item_id)
);

alter table equipment_items enable row level security;
alter table equipment_images enable row level security;
alter table equipment_related_items enable row level security;

create policy "public can read equipment_items" on equipment_items
  for select using (true);
create policy "admins manage equipment_items" on equipment_items
  for all using (is_admin()) with check (is_admin());

create policy "public can read equipment_images" on equipment_images
  for select using (true);
create policy "admins manage equipment_images" on equipment_images
  for all using (is_admin()) with check (is_admin());

create policy "public can read equipment_related_items" on equipment_related_items
  for select using (true);
create policy "admins manage equipment_related_items" on equipment_related_items
  for all using (is_admin()) with check (is_admin());
