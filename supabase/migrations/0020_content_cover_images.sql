-- Single cover image for the three content tables that don't already have
-- image support via a join table (equipment_items/projects use
-- equipment_images/project_images; blog_posts already has cover_media_id).
-- Nullable, same "on delete set null" convention as blog_posts.cover_media_id
-- — AbstractVisual stays the fallback for any row without a real photo yet.

alter table services add column cover_media_id uuid references media (id) on delete set null;
alter table solutions add column cover_media_id uuid references media (id) on delete set null;
alter table equipment_categories add column cover_media_id uuid references media (id) on delete set null;
