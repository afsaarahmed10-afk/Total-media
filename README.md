# TOTAL MEDIA — Corporate Website

Marketing website for TOTAL MEDIA, a full-service event production and
technical solutions company operating across Japan. Public site, customer
accounts, and an internal admin dashboard, all backed by Supabase.

## Tech Stack

- **Vite + React 19 + TypeScript**
- **TailwindCSS v4 + shadcn/ui** (New York style, Radix primitives)
- **Framer Motion** for scroll reveals and micro-interactions
- **React Router v7**
- **Supabase** — Postgres + Auth + Storage (`@supabase/supabase-js`)
- **react-hook-form + zod** for every form: Quote, Contact, auth, and the
  full admin CRUD surface
- **react-helmet-async** for per-page SEO (title/meta/OG/Twitter/JSON-LD)

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project's URL + anon key
npm run dev                  # http://localhost:5173
```

Without `.env.local`, the public pages still render (from the static
content in `src/content/*.ts`), but sign-in, the customer dashboard, and
`/admin` won't work. See `supabase/SCHEMA.md` for schema setup and the
one-time step to bootstrap the first admin account.

```bash
npm run build     # type-check, production build, regenerate sitemap.xml
npm run preview   # preview the production build locally
npm run lint       # oxlint
```

## Project Structure

```
src/
  components/
    ui/         shadcn/ui primitives
    layout/     Header, Footer, Layout/DashboardLayout/AdminLayout shells, Seo
    sections/   Home page sections (Hero, WhyChooseUs, ProcessSteps, ...)
    shared/     Reusable page-level pieces (PageHero, CtaBand, AbstractVisual, ...)
    auth/       Login/signup form pieces, ProtectedRoute, AdminRoute, GuestOnlyRoute
    admin/      Shared admin CRUD building blocks (AdminDataTable, RelationPicker,
                ObjectListField, MediaPickerField, ConfirmDeleteDialog, ...)
    brand/      Logo component
  content/      Typed static content modules — the public site's fallback when
                no Supabase project is configured (see content-store.ts)
  lib/
    data.ts          Public read API pages call — reads content-store's bundle
    content-store.ts Fetches all public content from Supabase once (or falls
                      back to content/*.ts when unconfigured); data.ts's source
    supabase/         Client + generated database.types.ts
    auth/             AuthContext (session, customer profile, admin profile)
    admin/            Small helpers shared by admin pages (media upload, ...)
  pages/
    (routes)/   Public marketing pages, one file per route
    auth/       Login, signup, password reset
    account/    Customer dashboard + profile settings
    admin/      Every /admin/* page — one list + form pair per content domain
scripts/
  generate-brand-assets.mjs   Rasterizes public/brand/*.svg into favicons, app icons, OG image
  generate-sitemap.ts         Builds public/sitemap.xml + robots.txt from routes + content slugs
public/brand/    Source SVGs for the logo mark and app-icon tile
supabase/migrations/  Full schema: content tables, accounts, forms, settings, storage buckets
```

## Brand Assets

See [`BRAND_GUIDE.md`](./BRAND_GUIDE.md) for logo usage, color variants, and
clearspace rules. Regenerate rasterized assets (favicons, app icons, default
OG image) after editing the source SVGs in `public/brand/`:

```bash
npm run brand:generate
```

## Content & Imagery

All copy is original, written specifically for this project — no Lorem
Ipsum. There is no photography anywhere on the site: every "image" (hero
fields, equipment galleries, portfolio and blog cover art) is an original,
deterministically-generated abstract composition (`AbstractVisual`
component), seeded from the entity's slug so the same item always renders
the same visual. This avoids ever presenting fabricated "photos" of events,
people, or venues that don't exist, and it means zero image requests on the
network — a meaningful performance win as a side effect.

A few pieces of contact/legal content are explicit placeholders pending
real business details and legal review before launch:

- Office address, phone, and email in `src/components/layout/Footer.tsx` and `src/pages/ContactPage.tsx`
- Privacy Policy and Terms & Conditions (`src/pages/PrivacyPolicyPage.tsx`, `src/pages/TermsPage.tsx`)
- The canonical domain `https://www.totalmedia.co.jp` used throughout `Seo.tsx`, `index.html`, and the sitemap script

## SEO

Every page sets title/description/canonical/OG/Twitter tags via the `Seo`
component, plus JSON-LD where relevant (Organization on Home, Service on
service pages, Product on equipment pages, Article on blog posts,
BreadcrumbList via `Seo`'s `breadcrumbs` prop, FAQPage on `/faq`). Note this
is a client-rendered SPA, not SSR — tags are correct in the DOM after React
mounts, but crawlers/scrapers that don't execute JavaScript will only see
the static defaults in `index.html`. A prerendering step could be added
later without changing the stack if guaranteed static HTML per route
becomes a requirement.

## Status

**Shipped:** the full Supabase schema (`supabase/migrations/`), customer
auth (email/password + Google OAuth, password reset, protected routes),
the customer account dashboard, both public forms (Quote, Contact) writing
to Supabase with file attachments, and a complete internal admin dashboard
at `/admin` — CRUD for every content domain (services, solutions,
equipment, portfolio, blog, testimonials, clients, FAQs, industries), a
media library, the quote/contact inbox, site settings, and admin-user role
management. CI (`.github/workflows/ci.yml`) runs lint/type-check/build on
every push and PR to `main`.

**Not done yet:**
- Production deployment (no Vercel project connected yet)
- Automated tests (none exist — CI currently only catches type/build/lint errors)
- Email notifications when a new quote request or contact message arrives
  (admins currently only see new submissions by opening the dashboard)
- Rate-limiting/CAPTCHA on the public Quote/Contact forms (both have a
  honeypot field only — see `supabase/SCHEMA.md`'s "Known Limitation" note)
- The content/legal placeholders below
- A security review of the RLS policies across all migrations
- Prerendering/SSR, if guaranteed static HTML per route becomes a
  requirement (see the SEO note above)
