-- Public form submissions. Both stay guest-friendly (forcing an account to
-- request a quote would hurt conversion) but tag the row with customer_id
-- when the submitter happens to be logged in, so it shows in their future
-- account history. RLS lets a submission be created by anyone, but only
-- read by its owner or staff.

create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  subject text not null,
  message text not null,
  status message_status not null default 'new',
  customer_id uuid references customers (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on contact_messages
  for each row execute function set_updated_at();

create table quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  country text not null,
  email text not null,
  phone text not null,
  event_type text not null,          -- free text: see SCHEMA.md for why this isn't an enum
  venue text,
  city text not null,
  event_date date,
  attendees integer,
  budget text,                       -- free text bucket label, e.g. "¥1,000,000 – ¥3,000,000"
  requested_services text[] not null default '{}', -- snapshot of service names, not FK'd
  notes text,
  status quote_status not null default 'new',
  customer_id uuid references customers (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index quote_requests_status_idx on quote_requests (status);
create trigger set_updated_at before update on quote_requests
  for each row execute function set_updated_at();

create table quote_request_attachments (
  id uuid primary key default gen_random_uuid(),
  quote_request_id uuid not null references quote_requests (id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes integer,
  created_at timestamptz not null default now()
);
create index quote_request_attachments_quote_request_id_idx
  on quote_request_attachments (quote_request_id);


alter table contact_messages enable row level security;
alter table quote_requests enable row level security;
alter table quote_request_attachments enable row level security;

create policy "anyone can submit a contact message" on contact_messages
  for insert
  with check (customer_id is null or customer_id = auth.uid());

create policy "owner or admin can read contact_messages" on contact_messages
  for select
  using (is_admin() or (customer_id is not null and customer_id = auth.uid()));

create policy "admins manage contact_messages" on contact_messages
  for update using (is_admin()) with check (is_admin());

create policy "admins delete contact_messages" on contact_messages
  for delete using (is_admin());


create policy "anyone can submit a quote request" on quote_requests
  for insert
  with check (customer_id is null or customer_id = auth.uid());

create policy "owner or admin can read quote_requests" on quote_requests
  for select
  using (is_admin() or (customer_id is not null and customer_id = auth.uid()));

create policy "admins manage quote_requests" on quote_requests
  for update using (is_admin()) with check (is_admin());

create policy "admins delete quote_requests" on quote_requests
  for delete using (is_admin());


-- Attachment INSERT is intentionally permissive (anyone submitting a quote
-- can attach files to it) since anonymous submitters have no stable
-- identity to check ownership against at the RLS layer. SELECT/DELETE
-- inherit visibility from the parent quote_requests row. When the Quote
-- form is wired to Supabase, consider doing the quote_request + attachment
-- inserts inside a single Postgres function call to further reduce
-- spray/spam risk — see supabase/SCHEMA.md.
create policy "anyone can attach a file to a quote request" on quote_request_attachments
  for insert
  with check (true);

create policy "owner or admin can read quote_request_attachments" on quote_request_attachments
  for select
  using (
    exists (
      select 1 from quote_requests qr
      where qr.id = quote_request_attachments.quote_request_id
        and (is_admin() or (qr.customer_id is not null and qr.customer_id = auth.uid()))
    )
  );

create policy "admins delete quote_request_attachments" on quote_request_attachments
  for delete using (is_admin());
