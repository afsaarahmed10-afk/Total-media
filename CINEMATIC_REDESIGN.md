# Cinematic redesign — design system & handover

Visual direction: concept **01 "Cinematic"** from the September 2026 design
presentation. UX principles (capability-first navigation, proof through real
events, persistent contact channels) from the reference site. Content,
routes, SEO, forms and integrations are unchanged.

## How the system is scoped

`Layout.tsx` wraps every public page in `<div class="cinematic">`.
`src/styles/cinematic.css` remaps the legacy token names (`navy`, `signal`,
`mist`, `--radius`…) to the Cinematic palette inside that scope only, so
admin / auth / dashboard screens (which never mount `Layout`) look exactly as
before. Any new public page automatically inherits the system.

## Tokens

| Token | Value | Use |
|---|---|---|
| `ink` | `#050c1c` | dark sections, header, footer |
| `blue` | `#0e3bb7` | buttons, CTA band, accents on light |
| `blue-tint` | `#7ea2ff` | accent text on dark (blue on ink is only ~2.4:1) |
| `paper` / `mist` | `#fafbfd` / `#f1f4f9` | light sections |
| `line` | `#e3e7ec` | hairlines |

Type: Inter (Latin) + native Japanese stack (Hiragino / Yu Gothic / Meiryo /
Noto CJK — no web font download). One serif-italic accent (Instrument
Serif, ~22 KB) via `<Display accent="…">`; Japanese falls back to a lighter
weight + the blue colour (no italic in Japanese). Scale utilities:
`display-hero / xl / lg / sec / md`, `eyebrow`. Radius is 0 everywhere.

Text on ink must be at least `text-white/60`, and text on paper at least
`text-ink/60` (WCAG AA; enforced by the axe audit).

## Components (`src/components/cinematic/`)

`Display` (word-mask reveal + accent), `Eyebrow`, `CineButton`, `Section`
(tone: paper / mist / ink / blue), `MediaFrame` (fixed aspect ratio, lazy,
optional reveal + hover zoom). Shared components keep their old prop APIs but
are restyled: `PageHero`, `SectionHeading`, `CtaBand`, `Breadcrumbs`, `Reveal`.
Sections: `ServiceIndexRow`, `WorkBand`, `FeaturedProject`, `ProjectGallery`
(filter + lightbox), `PosterVideo`.

## Behaviour worth knowing

- **Header**: transparent over the homepage hero, solid ink elsewhere; the
  "Menu" button opens a full-screen Radix Dialog with every link (all 15
  services, equipment categories, account).
- **Gallery categories** come from free-text `project_images.category`,
  mapped in `src/lib/event-categories.ts` (Stalls & Exhibitions / Stage /
  Hall & Venue / LED & AV / Setup / Other, each with a Japanese label).
  Unknown labels pass through. Deep link: `/portfolio/<slug>?view=stall`.
- **Homepage hero + Stall | Stage band + featured project** use the first
  project that has photos (`src/lib/featured-project.ts`) — add a newer real
  project and the homepage follows.
- **Placeholders**: unfinished admin template text in a project story
  (`[Describe … ]`, `[ADD …]`) is not rendered publicly.
- **Testimonials carousel** is not rendered on the homepage (records are
  still placeholders). Component and admin tooling are intact.
- **Reduced motion**: `MotionConfig reducedMotion="user"` plus explicit
  guards on parallax / reveals; CSS animations/transitions are neutralised.
- New analytics event: `project_video_play` (video is poster-first; the mp4 is
  not requested until play).

## Verification performed (dev server, Chromium)

- 126 page loads (21 routes × ja/en × 1440/768/390): no console errors, no
  failed requests, one `<h1>` each, no horizontal overflow.
- axe-core WCAG 2.0/2.1 A+AA: 0 violations on 60 audits (15 routes × ja/en ×
  desktop/mobile).
- SEO diff vs. the previous commit on 42 routes: title, description, robots,
  canonical, hreflang, Open Graph, Twitter, JSON-LD, `<h1>` and `lang` all
  identical (only additions: a few extra headings / internal links).
- Menu overlay + lightbox: keyboard (Esc, arrows), focus return verified.
- JS transferred is unchanged (≈1.13 MB gz before and after); CSS +~22 KB gz.

## Known follow-ups

1. **Image weight**: real photos are 2400 px WebP served straight from
   Supabase storage (~330 KB hero). Generate 800/1400 px variants (or enable
   Supabase image transforms) and add `srcset`.
2. **Service/blog/equipment cover art is AI-generated** and contains garbled
   signage; replace with real photography when available.
3. **Project story copy**: the IBS record still holds template text for "Our
   Role" and "Result" — write real copy in the admin (it is hidden until then).
4. Six placeholder testimonials / ten placeholder clients remain in the
   database; they are intentionally not shown.
5. Main JS chunk is ~657 KB (was ~545 KB, but total transfer is unchanged).
   Splitting Supabase/i18n out of the entry chunk is the next big win.
