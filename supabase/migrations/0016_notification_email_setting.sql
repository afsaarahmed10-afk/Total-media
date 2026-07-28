-- Separate from `contact_email` (the address shown publicly on the Contact
-- page) so admins can route "new submission" alerts to a different inbox
-- (e.g. a shared team address) without changing what visitors see.

insert into site_settings (key, value) values
  ('notification_email', '"hello@totalmedia.co.jp"')
on conflict (key) do nothing;
