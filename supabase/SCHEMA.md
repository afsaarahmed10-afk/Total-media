# Supabase Schema Reference

Phase 2, Step 1 deliverable: schema + migrations only. See
`supabase/migrations/*.sql` for the source of truth — this file is a
scannable map of it, not a replacement for reading the SQL.

No Supabase project exists yet. Once you create one:

```bash
supabase link --project-ref <your-project-ref>
supabase db push          # applies 0001–0013 in order
```

or paste each file into the Supabase Studio SQL editor in numeric order.

## Bootstrap step required after first deploy

`admin_users` has no public INSERT path (by design — only existing admins
can create other admins). The very first admin has to be created manually:

1. Create the account in **Supabase Studio → Authentication → Users → Add
   user**, setting `raw_user_meta_data: {"is_admin_signup": true}` (this
   flag stops the `customers` auto-provisioning trigger from also creating
   a client profile for this account).
2. Insert their row directly: `insert into admin_users (id, display_name,
   role) values ('<their auth.users id>', 'Your Name', 'admin');`

## Table Map

| Domain | Tables | Notes |
|---|---|---|
| Accounts | `admin_users`, `customers` | Both `id` = `auth.users.id`. See naming note below. |
| Taxonomy & media | `equipment_categories`, `blog_categories`, `clients`, `faqs`, `industries`, `media` | All public-read, admin-write. `media` backs Storage objects. |
| Services | `services`, `service_related_services`, `service_related_equipment_categories`, `service_faqs` | Join tables carry `sort_order`. |
| Solutions | `solutions`, `solution_services` | |
| Equipment | `equipment_items`, `equipment_images`, `equipment_related_items` | `equipment_images` empty until real photography is uploaded — `visual_seed` keeps `AbstractVisual` as fallback. |
| Portfolio | `projects`, `project_images`, `project_services`, `project_equipment` | `client` is plain text, not FK'd. |
| Blog | `blog_posts` | `cover_media_id` nullable. |
| Testimonials | `testimonials` | Has `is_published`/`sort_order` beyond the frontend type — for admin curation. |
| Forms | `contact_messages`, `quote_requests`, `quote_request_attachments` | Guest-friendly; `customer_id` nullable. |
| Settings | `site_settings` | Key/value, admin-only. |

## Why `customers`, not `users`

Phase 1 already has a `Client` content type for the homepage "Trusted By"
logo cloud (`src/content/clients.ts`). The public-account table is named
`customers` specifically so it can't be confused with that — `clients`
(marketing logos, no login) and `customers` (account holders) are
unrelated.

## The Modeling Rule (why some things are arrays, some are jsonb, some are join tables)

- **References to rows in another table** → join table with composite PK
  (`service_related_services`, `project_equipment`, etc.), not an array of
  slugs. Real foreign keys, real cascade behavior, and a straightforward
  multi-select in the future admin UI.
- **Structured content that belongs to one row and isn't a relation** (a
  service's process steps, a project's stats) → `jsonb`.
- **Plain string lists** (overview paragraphs, capabilities, applications)
  → `text[]`.
- **Stable domain taxonomy** (service category, equipment availability,
  project category, FAQ category, admin role) → Postgres `enum`.
- **Form dropdown options that might change independently of the schema**
  (quote request's event type, budget range) → plain `text`, not enum.

## RLS Model

Every table has RLS enabled. Three patterns, no exceptions:

1. **Public content** (services, equipment, portfolio, blog, taxonomy,
   media, published testimonials): anyone can `SELECT`; only `is_admin()`
   can write.
2. **Account-owned data** (`customers`, and — via `customer_id` — the
   submitter's own `contact_messages`/`quote_requests`): the owner
   (`id = auth.uid()` or `customer_id = auth.uid()`) or an admin can read;
   only the owner can update their own profile; only admins can
   update/delete submissions (status changes, etc).
3. **Fully admin-only** (`admin_users`, `site_settings`): no anon or
   customer access at all.

`is_admin()` (defined in `0003_accounts.sql`) is `security definer` so it
can check `admin_users` from inside other tables' RLS policies without
recursing into `admin_users`' own RLS.

## Storage Buckets

| Bucket | Public | Path convention | Notes |
|---|---|---|---|
| `media` | Yes | any | Admin-curated; backs the `media` table. |
| `quote-attachments` | No | `{quote_request_id}/{file_name}` | The path's first segment is the owning `quote_requests.id`, so RLS can check ownership without a join. |

## Known Limitation, Flagged Deliberately

`quote_request_attachments` (and the matching `quote-attachments` bucket
policy) allow `INSERT` from anyone, including anonymous visitors, because
an anonymous submitter has no stable identity to check ownership against
at RLS time — the same reason `quote_requests` itself allows anonymous
`INSERT`. This is an accepted tradeoff for keeping the Quote form
guest-friendly. If abuse becomes a problem in practice, the fix is at the
application layer (rate limiting, a CAPTCHA, or moving the insert behind a
Supabase Edge Function that validates the request server-side) — not
something RLS alone can solve for an intentionally anonymous form. Revisit
when the Quote form is actually wired to Supabase.

## Explicitly Not Built Yet

`@supabase/supabase-js` isn't installed in the frontend. No page reads
from or writes to these tables — Phase 1's `src/lib/data.ts` still reads
the static `src/content/*.ts` files. No admin dashboard UI, no client
login/register/account pages. Those are separate, later steps.
