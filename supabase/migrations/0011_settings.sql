-- Flexible key/value store for admin-editable site settings (contact info,
-- social links, SEO defaults, business hours, ...) so adding a new setting
-- doesn't require a migration. Admin-only — the frontend's hardcoded
-- defaults (Footer.tsx, ContactPage.tsx) keep working until the client
-- wiring step reads from this table.

create table site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on site_settings
  for each row execute function set_updated_at();

alter table site_settings enable row level security;

create policy "admins manage site_settings" on site_settings
  for all using (is_admin()) with check (is_admin());

-- Seed a starting set of keys so the admin UI has something to edit rather
-- than an empty table. Placeholder values match Footer.tsx / index.html —
-- update these before launch.
insert into site_settings (key, value) values
  ('contact_address', '{"lines": ["TOTAL MEDIA Inc.", "Shibuya-ku, Tokyo 150-0002, Japan"]}'),
  ('contact_phone', '"+81 3-4567-8901"'),
  ('contact_email', '"hello@totalmedia.co.jp"'),
  ('site_url', '"https://www.totalmedia.co.jp"'),
  ('quote_response_sla', '{"standard_days": 2, "complex_days": 5}');
