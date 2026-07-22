-- Extensions and shared helper functions used across every later migration.

create extension if not exists pgcrypto;

-- Maintains `updated_at` on any table that has the column. Attach with:
--   create trigger set_updated_at before update on <table>
--   for each row execute function set_updated_at();
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Note: is_admin() is defined in 0003_accounts.sql, once the admin_users
-- table it depends on exists.
