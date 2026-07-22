# TOTAL MEDIA — Corporate Website

Marketing website for TOTAL MEDIA, a full-service event production and
technical solutions company operating across Japan.

This repository is **Phase 1: Frontend**. It ships a complete, responsive,
production-quality public website against a typed content layer. There is
no backend yet — see [Phase 2](#phase-2-not-yet-started) below.

## Tech Stack

- **Vite + React 19 + TypeScript**
- **TailwindCSS v4 + shadcn/ui** (New York style, Radix primitives)
- **Framer Motion** for scroll reveals and micro-interactions
- **React Router v7**
- **react-hook-form + zod** for the Quote and Contact forms
- **react-helmet-async** for per-page SEO (title/meta/OG/Twitter/JSON-LD)

## Getting Started

```bash
npm install
npm run dev       # http://localhost:5173
```

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
    layout/     Header, Footer, Layout shell, Seo component
    sections/   Home page sections (Hero, WhyChooseUs, ProcessSteps, ...)
    shared/     Reusable page-level pieces (PageHero, CtaBand, AbstractVisual, ...)
    brand/      Logo component
  content/      Typed content modules — shaped to match the planned Supabase schema
  lib/
    data.ts     Data-access layer wrapping `content/` — this is the ONLY file
                that changes when Phase 2 swaps in Supabase queries
    utils.ts    `cn()` helper
  pages/        One file per route, lazy-loaded in App.tsx
scripts/
  generate-brand-assets.mjs   Rasterizes public/brand/*.svg into favicons, app icons, OG image
  generate-sitemap.ts         Builds public/sitemap.xml + robots.txt from routes + content slugs
public/brand/    Source SVGs for the logo mark and app-icon tile
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

## Phase 2 (Not Yet Started)

Supabase schema and migrations, Supabase Auth, the admin dashboard (CRUD
for services, equipment, portfolio, blog, testimonials, clients, FAQs,
quote requests, contact messages, media library, users, settings,
analytics), Supabase Storage for the quote form's file upload, and
production deployment to Vercel. To be scoped once Phase 1 is reviewed.
