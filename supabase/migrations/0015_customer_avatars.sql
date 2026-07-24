-- Adds avatar support for customer accounts, ahead of the client
-- login/dashboard/profile-settings UI. Follows the same bucket + RLS
-- pattern as 0012_storage_buckets.sql: public-read, owner-write, path
-- convention "{auth.uid()}/{file_name}" so RLS can check ownership from
-- the path alone (same trick used for quote-attachments).

alter table customers add column avatar_url text;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "public can view avatars bucket" on storage.objects
  for select
  using (bucket_id = 'avatars');

create policy "owner can upload own avatar" on storage.objects
  for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "owner can update own avatar" on storage.objects
  for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "owner can delete own avatar" on storage.objects
  for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
