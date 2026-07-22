-- Enums for stable domain taxonomy (see supabase/SCHEMA.md for the
-- text-vs-enum rule). These map 1:1 to union types in src/content/types.ts.

create type admin_role as enum ('admin', 'editor');

create type service_category as enum ('event-type', 'technical');

create type equipment_availability as enum ('in-stock', 'limited', 'made-to-order');

create type project_category as enum (
  'Conference', 'Corporate', 'Exhibition', 'Hybrid', 'Virtual', 'Outdoor'
);

create type faq_category as enum (
  'general', 'quotes-pricing', 'equipment', 'planning', 'technical'
);

create type quote_status as enum (
  'new', 'in_review', 'quoted', 'won', 'lost', 'archived'
);

create type message_status as enum ('new', 'read', 'archived');
