-- Adds the optional "full real-media event showcase" fields for portfolio
-- projects (see `Project` in src/content/types.ts). Every new column is
-- nullable — projects without a showcase keep working exactly as before,
-- driven by visualSeed/imageUrl alone.

alter table projects add column date_label text;
alter table projects add column venue text;
alter table projects add column event_start_date date;
alter table projects add column event_end_date date;
-- Shape: { theEvent: string[], ourRole: string[], theExperience: string[], theResult: string[] }
alter table projects add column story jsonb;

-- Lets the showcase group gallery photos (e.g. "setup", "event", "aftermath").
alter table project_images add column category text;

create table project_videos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  video_url text not null,
  poster_url text,
  title text not null,
  description text,
  category text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on project_videos
  for each row execute function set_updated_at();

alter table project_videos enable row level security;

create policy "public can read project_videos" on project_videos
  for select using (true);
create policy "admins manage project_videos" on project_videos
  for all using (is_admin()) with check (is_admin());
