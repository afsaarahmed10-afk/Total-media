-- Mirrors `BlogPost` in src/content/types.ts. No separate authors table —
-- bylines (author, author_role) are editorial text, not linked accounts.
-- cover_media_id is nullable so AbstractVisual keeps covering posts that
-- haven't had a real cover image uploaded yet.

create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_id uuid not null references blog_categories (id) on delete restrict,
  title text not null,
  excerpt text not null,
  content text[] not null default '{}',
  author text not null,
  author_role text not null,
  published_at timestamptz not null default now(),
  read_minutes integer not null default 5,
  cover_media_id uuid references media (id) on delete set null,
  visual_seed text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index blog_posts_category_id_idx on blog_posts (category_id);
create index blog_posts_published_at_idx on blog_posts (published_at desc);
create trigger set_updated_at before update on blog_posts
  for each row execute function set_updated_at();

alter table blog_posts enable row level security;

create policy "public can read blog_posts" on blog_posts
  for select using (true);
create policy "admins manage blog_posts" on blog_posts
  for all using (is_admin()) with check (is_admin());
