-- Two account types, both backed by auth.users:
--   admin_users — staff/CMS accounts (bootstrapped manually, see SCHEMA.md)
--   customers   — public client accounts (auto-provisioned on signup)
-- Deliberately not named "users" to avoid colliding with the unrelated
-- `clients` table (marketing "Trusted By" logos, added in 0004).

create table admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  role admin_role not null default 'editor',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
  before update on admin_users
  for each row execute function set_updated_at();

-- security definer: lets RLS policies elsewhere call is_admin() without
-- re-triggering admin_users' own RLS on the internal lookup (which would
-- otherwise recurse). Runs with the privileges of the migration role, which
-- owns admin_users and therefore bypasses its RLS for this one query.
create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from admin_users where id = auth.uid());
$$;

alter table admin_users enable row level security;

create policy "admins can view admin accounts"
  on admin_users for select
  using (id = auth.uid() or is_admin());

create policy "admins can manage admin accounts"
  on admin_users for all
  using (is_admin())
  with check (is_admin());


create table customers (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  company text,
  country text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
  before update on customers
  for each row execute function set_updated_at();

alter table customers enable row level security;

create policy "customers can view own profile"
  on customers for select
  using (id = auth.uid() or is_admin());

create policy "customers can update own profile"
  on customers for update
  using (id = auth.uid() or is_admin())
  with check (id = auth.uid() or is_admin());

create policy "admins can manage customer accounts"
  on customers for delete
  using (is_admin());

-- Auto-provisions a `customers` row for every new auth.users signup, UNLESS
-- the account was created with `raw_user_meta_data->>'is_admin_signup' =
-- 'true'` (the convention for staff accounts created via the Supabase
-- dashboard/admin invite flow, which should NOT get a customer profile).
create or replace function handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.raw_user_meta_data ->> 'is_admin_signup') is distinct from 'true' then
    insert into customers (id, full_name, company, country, phone)
    values (
      new.id,
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'company',
      new.raw_user_meta_data ->> 'country',
      new.raw_user_meta_data ->> 'phone'
    );
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_auth_user();
