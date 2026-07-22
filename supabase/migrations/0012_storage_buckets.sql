-- Two Storage buckets:
--   media              — public, admin-curated (backs the `media` table)
--   quote-attachments  — private, path convention "{quote_request_id}/{file_name}"
--                         so RLS can check ownership from the path alone.

insert into storage.buckets (id, name, public)
values
  ('media', 'media', true),
  ('quote-attachments', 'quote-attachments', false)
on conflict (id) do nothing;

create policy "public can view media bucket" on storage.objects
  for select
  using (bucket_id = 'media');

create policy "admins manage media bucket" on storage.objects
  for insert with check (bucket_id = 'media' and is_admin());

create policy "admins update media bucket" on storage.objects
  for update using (bucket_id = 'media' and is_admin());

create policy "admins delete media bucket" on storage.objects
  for delete using (bucket_id = 'media' and is_admin());


-- Anyone can upload a quote attachment (matches the permissive INSERT on
-- quote_request_attachments in 0010_forms.sql — anonymous submitters have
-- no stable identity to restrict against here either).
create policy "anyone can upload quote attachments" on storage.objects
  for insert
  with check (bucket_id = 'quote-attachments');

create policy "owner or admin can read quote attachments" on storage.objects
  for select
  using (
    bucket_id = 'quote-attachments'
    and (
      is_admin()
      or exists (
        select 1 from quote_requests qr
        where qr.id::text = (storage.foldername(name))[1]
          and qr.customer_id = auth.uid()
      )
    )
  );

create policy "admins delete quote attachments" on storage.objects
  for delete using (bucket_id = 'quote-attachments' and is_admin());
