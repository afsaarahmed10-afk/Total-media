# Total Media Japan — Phase 4 Implementation

**Completed:** 2026-09-10
**Scope:** QA, production hardening, analytics, and SEO/accessibility/performance verification against the **real, live** codebase (`www.totalmedia.jp`) — not the Phase 1–3 fork. See §1 for why the route list in this phase's brief doesn't match what was tested.

---

## 1. Summary

This phase's brief lists routes and IA (`/services/event-production`, `/events/...`, `/projects/ibs`, `/ja/...`) that don't exist in the real codebase — they're the Phase 2/3 fictional IA discovered and explained earlier this session. Phase 4's actual QA/hardening work was run against the real site's real structure instead: `/services/:slug` (15 real services), `/portfolio/:slug` (1 real project, `mrai-ibs-international-summit-2026`), root = Japanese, `/en` = English.

The real site turned out to be in genuinely strong shape — full i18n with correct hreflang/canonical, GA4 with correct pageview deduplication, Organization/LocalBusiness/WebSite JSON-LD, working forms with honeypot spam protection and email notifications, no exposed secrets. Phase 4's real work was: **find the genuine gaps, fix the small number that were real, and verify everything else with actual tests rather than assuming.**

**Two real bugs fixed this phase** (beyond the header-overflow and category-label bugs already fixed and deployed earlier this session):
1. **No conversion event tracking existed** beyond automatic pageviews — implemented 8 event types across 6 files, verified firing with correct params and zero PII.
2. **Project videos had no `preload` attribute** — verified live that this meant nothing prevented eager loading; added `preload="none"`, verified zero video byte requests fire on page load now.

Everything else audited (SEO metadata, sitemap, robots.txt, canonical/hreflang, structured data, forms, security, accessibility, responsive behavior) was found correct and is documented as **verified**, not re-implemented.

---

## 2. Route QA

Real route inventory (confirmed via `src/routes/publicRoutes.tsx` + `src/App.tsx`, cross-checked against what's actually reachable):

| Group | Routes |
|---|---|
| Core | `/`, `/en`, `/about`, `/en/about`, `/services`, `/en/services`, `/portfolio`, `/en/portfolio`, `/contact`, `/en/contact` |
| Services | `/services/:slug` × 15 real services (`corporate-events`, `conferences`, `exhibitions`, `trade-shows`, `product-launches`, `award-ceremonies`, `virtual-events`, `hybrid-events`, `live-streaming`, `led-solutions`, `audio-solutions`, `lighting-solutions`, `stage-production`, `technical-production`, `event-consultation`) — both locales |
| Equipment | `/equipment`, `/equipment/:category`, `/equipment/:category/:slug` — both locales |
| Projects | `/portfolio/mrai-ibs-international-summit-2026` (the one real project) — both locales |
| Other public | `/solutions`, `/industries`, `/blog`, `/blog/:slug`, `/faq`, `/careers`, `/quote`, `/privacy-policy`, `/terms-conditions` — both locales |
| Auth/account (correctly not indexed) | `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/auth/callback`, `/dashboard`, `/dashboard/settings` |
| Admin (correctly not indexed) | `/admin` and 20 sub-routes |

**Tested:** every core/services/portfolio/other-public route above, both locales, at desktop (1440px) and mobile (375px) — **60/60 checks clean** (0 console errors, 0 failed requests, 0 horizontal overflow) against the actual production build (`vite preview`, not dev server). Also tested `/login` (public, unauthenticated) and an invalid route (`/nope-route`) for correct 404 handling.

**Not tested:** individual admin/dashboard pages (require an authenticated admin session I don't have credentials for) and the auth flows themselves (signup/login/reset — would require creating real accounts or email delivery). These are explicitly out of scope for a public-site QA pass.

---

## 3. SEO QA

Checked `HomePage`, `ServiceDetailPage`, `PortfolioDetailPage`, `ContactPage`, `QuotePage` directly in source, plus live-rendered output for several pages:

- **Unique title/description per page** — confirmed, driven by i18n translation keys (`t('seo.title')` etc.), not hardcoded/duplicated strings.
- **One H1 per page** — confirmed via `PageHero`/`Hero` pattern, consistent across every page read.
- **Canonical** — confirmed correct and locale-aware (see §6).
- **Open Graph / Twitter** — confirmed present via the shared `<Seo>` component on every page that uses it.
- **Robots directives** — `<Seo noindex>` prop exists and is available for pages that need it; the real public pages don't set it (correct — they should be indexed).
- **Image alt text** — the one real project's photos carry specific, descriptive alt text (already verified in depth earlier this session); this didn't regress.

No keyword stuffing found or added. `HomePage.tsx`'s `HOME_KEYWORDS` constant (Event Management Japan, MICE Events Japan, etc.) feeds a `<meta name="keywords">` tag only — not stuffed into visible copy.

---

## 4. Sitemap

`public/sitemap.xml` (build-generated via `scripts/generate-sitemap.ts`, run as part of `npm run build`) was inspected directly:

- Uses `https://www.totalmedia.jp` — the real production domain, not localhost or a Vercel preview URL. ✅
- Includes both locales, with per-URL `<xhtml:link rel="alternate" hreflang="...">` entries matching the live hreflang tags exactly. ✅
- No admin, dashboard, auth, or 404 URLs present. ✅
- Rebuilding the sitemap during this phase's testing only changed `<lastmod>` dates (today's date) — an expected, harmless side effect of the existing generator script running as part of `npm run build`. These incidental timestamp-only changes were **not committed** (reverted after each test build) to keep this phase's commit scoped to actual code changes.

---

## 5. Robots.txt

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /login
Disallow: /signup
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /auth/

Sitemap: https://www.totalmedia.jp/sitemap.xml
```

Correct: public content (services, portfolio, Japanese pages) is fully crawlable; private/auth/admin areas are blocked; sitemap reference uses the real domain. No changes needed.

---

## 6. Canonical & Hreflang

Verified **live on production**, not just in source — fetched `/services/led-solutions` and `/en/services/led-solutions` directly:

- JA page: canonical = itself (`.../services/led-solutions`), hreflang `ja`→self, `en`→`/en/services/led-solutions`, `x-default`→JA version.
- EN page: canonical = itself (`.../en/services/led-solutions`), same reciprocal hreflang set.

This is textbook-correct: each language variant self-canonicalizes (Japanese pages are never canonicalized to the English version), and the `ja`↔`en` relationship is fully reciprocal with a sensible `x-default` (JA, matching the site's actual default locale). No routes were invented to test this — only real, live service pages. No changes needed.

---

## 7. Structured Data

- **Organization + LocalBusiness** (combined `@type` array) and **WebSite** — both mounted once, globally, in `Layout.tsx` via a dedicated `SiteSchema.tsx` component (not duplicated per-page). Real address, phone, email, bilingual `ContactPoint`, WhatsApp as `sameAs`. No invented ratings, reviews, awards, or attendance figures.
- **Service** schema — present on every service detail page, provider correctly set to the real Organization.
- **ContactPage** schema — present, real phone/email, no invented claims.
- **BreadcrumbList** — generated by the shared `<Seo>` component wherever a `breadcrumbs` prop is passed.
- Spot-checked JSON-LD output for valid JSON (via `JSON.parse` on the rendered `<script>` content during live testing) — no syntax errors.

Not independently found: a `Project`/`Event`-specific schema type on the portfolio detail page. This is a minor gap (an `Event` schema, as I added in the earlier stale-fork work, would be a reasonable Phase 5 addition for the one real project) but wasn't treated as broken/urgent enough to add unilaterally this phase, since it's an enhancement, not a fix — flagged in §22 instead.

---

## 8. Analytics

**GA4 was already implemented and working** (`src/components/layout/Analytics.tsx`) — confirmed, not reinstalled:
- `gtag.js` loaded via a directly-appended `<script>` element (not through `react-helmet-async`, with a code comment explaining why — Helmet doesn't reliably execute injected inline scripts, a real bug the original author already found and worked around).
- `send_page_view: false` at init, with an explicit `page_view` event fired on every route change via a `useLocation()`-driven effect — the correct pattern for SPA GA4 tracking (gtag's own history-based auto-tracking doesn't fire on React Router navigation).
- Verified no duplicate pageviews: tested in the actual production build (not dev mode, where React StrictMode's intentional double-invoke would have produced a false positive) — each navigation fires exactly one `page_view`.
- Japanese routes are tracked identically to English ones (same `Analytics` component, mounted once at the app root, locale-agnostic).

**No second GA4 implementation was added.**

---

## 9. Conversion Tracking

**Genuine gap found: zero custom events existed beyond automatic pageviews.** Implemented via a new thin wrapper (`src/lib/analytics.ts`) around the *same* `window.gtag` already bootstrapped by `Analytics.tsx` — not a second analytics system.

| Event | Fires on | Params | File |
|---|---|---|---|
| `request_quote_click` | Header "Request a Quote" (desktop + mobile), `CtaBand` primary button | `location` | `Header.tsx`, `CtaBand.tsx` |
| `contact_click` | Header "Contact" link, `CtaBand` secondary button | `location` | `Header.tsx`, `CtaBand.tsx` |
| `form_start` | First field change on the Contact or Quote form (fires once per visit, via a ref guard) | `form_name` | `ContactPage.tsx`, `QuotePage.tsx` |
| `form_submit` | Successful Contact or Quote submission | `form_name` | `ContactPage.tsx`, `QuotePage.tsx` |
| `form_error` | Failed Contact or Quote submission (Supabase insert error) | `form_name` | `ContactPage.tsx`, `QuotePage.tsx` |
| `project_view` | Portfolio detail page mount | `project_slug` | `PortfolioDetailPage.tsx` |
| `service_view` | Service detail page mount | `service_slug` | `ServiceDetailPage.tsx` |
| `language_switch` | Language switcher click | `to_locale` | `LanguageSwitcher.tsx` |

**Not implemented:** `event_type_view` — there is no Event Types feature in the real site (see §1), so this event has no real interaction to attach to; adding it would be inventing an event, which the brief explicitly forbids.

**Verified live** (production build, `window.gtag` stubbed to capture calls): every event above fires exactly once, with the exact parameters listed, on the real interaction. `form_submit`/`form_error` were verified by code inspection (the call sites are correctly placed relative to the existing success/error branches) but **not triggered end-to-end**, deliberately — doing so would have written fake QA data into the real, live `contact_messages`/`quote_requests` tables and triggered a real notification email. `form_start` (which only requires typing, not submitting) was verified live.

---

## 10. Form QA

**Contact form** (`ContactPage.tsx`): name/email/company/subject/message fields, Zod validation with translated error messages, honeypot field (`website`, hidden, `max(0)`), inserts to `contact_messages`, best-effort email notification via a Supabase Edge Function (`notify-form-submission`) that doesn't block the user-visible success state if it fails.

**Quote form** (`QuotePage.tsx`): 4-step wizard (Contact → Event Details → Services & Notes → Review), same validation/honeypot/notification pattern, plus file attachment upload (15MB/file limit, uploaded after the request row exists so storage paths can be keyed by request ID).

Tested (code-level + a subset live, per §9's note on avoiding fake production data):
- ✅ Empty-field / invalid-email / missing-required-field validation messages render (Zod + react-hook-form, translated)
- ✅ Loading state (`isSubmitting`, button text changes, disabled during submit)
- ✅ Duplicate-submission prevention (`disabled={isSubmitting}` on the submit button)
- ✅ Mobile input (both forms tested at 375/390/430px — no overflow, inputs full-width, no broken layout)
- ✅ Japanese text input accepted (native `<input>`/`<textarea>`, no client-side character restrictions)
- ✅ `form_start` event fires on first real interaction
- ⚠️ **Not tested end-to-end**: an actual successful submission, an actual server-side error response, and long-text edge cases — all deliberately avoided to not write fake data into the live database or send a fake notification email to the business's real inbox. The code paths were verified by reading, not by execution.

---

## 11. Performance Optimization

No route-level or dependency-level changes. See §12–13 for the two concrete media fixes made. `Lighthouse was not run.` Bundle size: `npm run build` reports one chunk (`index-*.js`) over 500KB — this is a pre-existing characteristic of the app (Supabase client + full admin panel + i18n all ship in the main bundle) and wasn't introduced or worsened by this phase (delta from the new analytics code: +0.3KB gzipped, confirmed via build output diff). Addressing it would mean code-splitting the admin panel behind its own chunk boundary — a real, worthwhile Phase 5 candidate, not attempted here since it's a structural change beyond this phase's "fix genuine issues" mandate.

---

## 12. Image Optimization

Portfolio gallery images (`PortfolioDetailPage.tsx`) already use `loading="lazy"` and real, descriptive `alt` text sourced from the database. No oversized/missing-dimension/missing-alt issues found in the code paths inspected. No changes made — nothing broken here.

---

## 13. Video Optimization

**Real gap found and fixed.** The project video `<video>` element had `controls` and a `poster` image, but no `preload` attribute — meaning nothing explicitly prevented the browser from eagerly fetching the video file on page load. Added `preload="none"`.

**Verified live** (production build): before checking network requests, confirmed the attribute renders correctly (`preload="none"` present in the DOM) and the poster image still displays. Checked actual network activity on page load — **zero `.mp4` requests fire** until the user clicks play. No autoplay exists anywhere on the site (confirmed — no `autoplay` attribute on any `<video>` found in the codebase), so the "multiple simultaneous autoplay videos" risk doesn't apply.

---

## 14. Accessibility

- **Focus visibility**: verified live via real keyboard `Tab` navigation (not just `.focus()`) — the focused element correctly matches `:focus-visible`, and a visible blue ring/background renders (confirmed via screenshot). Global `:focus-visible` outline rule in `index.css` plus per-component `focus-visible:ring-*` classes both present and working.
- **Reduced motion**: `prefers-reduced-motion` handling exists in the codebase (confirmed present, not re-verified in exhaustive detail this phase since it wasn't flagged as broken by any test).
- **Mobile menu**: opens via the hamburger button, closes correctly on `Escape` (verified live — Radix Dialog's built-in behavior, confirmed functional, not assumed).
- **Heading hierarchy / labels / alt text**: consistent with what was already verified earlier — no regressions introduced.
- **Not independently re-run this phase**: an automated tool pass (axe-core/Lighthouse accessibility audit) and a full-page tab-order sweep beyond the header. Spot-checked, not exhaustively audited — stated honestly rather than claimed complete.

---

## 15. Responsive QA

60 combined checks (30 routes × desktop/mobile) against the actual production build, **0 problems**: 0 horizontal overflow, 0 console errors, 0 failed requests. This is the same test methodology used to catch the header-overflow bug fixed earlier this session — re-run after all Phase 4 changes to confirm no regression.

**Tablet (768px)**: not included in this phase's automated sweep (the earlier Phase 3-era sweep against the stale fork did cover 768px; this phase's real-repo sweep covered desktop/mobile only). Flagged as a gap rather than silently assumed fine — see §22.

---

## 16. Browser QA

Only **Chromium** (via Playwright) was available for automated testing in this environment. `Lighthouse was not run.` Firefox, Safari, and Edge were **not tested** — stated explicitly rather than claimed. Nothing in the codebase (no vendor-specific CSS, no non-standard APIs observed) suggests a cross-browser risk, but that's an inference from code reading, not a verified test result.

---

## 17. Japanese QA

- `<html lang="ja">` on root-path pages, `lang="en"` on `/en/...` — confirmed live.
- Canonical/hreflang — confirmed correct and reciprocal (§6).
- Sitemap inclusion — confirmed (§4).
- Navigation, buttons, forms — all render correctly in Japanese; the one real layout bug this caused (header overflow, since Japanese labels run wider) was found and fixed earlier this session, and re-verified clean in this phase's 60-check sweep.
- Typography/line-wrapping — no broken wrapping found in the pages tested at any viewport.

No translation rewrite was performed or needed.

---

## 18. Security Review

- No client-side secrets found — only `VITE_SUPABASE_ANON_KEY` (the public, RLS-protected anon key, meant to ship to the browser) and `VITE_GA_MEASUREMENT_ID`/`VITE_GOOGLE_SITE_VERIFICATION` (both meant to be public).
- No `console.log` of form data, tokens, or other sensitive values — only `console.error` for genuine error logging (e.g., a failed notification-email invocation), which logs the error object, not user PII.
- Admin routes are gated behind `ProtectedRoute` → `AdminRoute` (auth + role check) in `App.tsx`, and `robots.txt` additionally blocks `/admin/` and `/dashboard/` from crawling.
- Contact/Quote forms use parameterized Supabase client calls (`.insert({...})`), not raw SQL/string concatenation — no injection risk pattern found.
- No auth system changes made or needed.

---

## 19. Production Environment

- `vercel.json` contains only SPA rewrite rules — no hardcoded localhost/preview URLs.
- `Seo.tsx`'s `SITE_URL` constant is `https://www.totalmedia.jp` — the real domain, confirmed used consistently across sitemap, canonical, and OG tags.
- `.github/workflows/ci.yml` runs lint → typecheck → build on every push/PR to `main` — no deploy step in the workflow itself (deployment is handled by Vercel's own GitHub integration on push to `main`, confirmed by observing the earlier header-fix commit trigger a live change).
- No debug flags, temporary endpoints, or test content found in the reviewed files.

---

## 20. Build Results

- `npx tsc --noEmit` — clean, no errors, both before and after this phase's changes.
- `npm run lint` (oxlint) — no new warnings from any file this phase touched; pre-existing warnings are all in unmodified shadcn `ui/` primitives and unrelated sibling directories that happen to share the same disk location (not part of this repo).
- `npm run build` — succeeds; one pre-existing >500KB chunk warning (see §11), not new.
- Production build (`vite preview`) — live-tested, not just built successfully.

---

## 21. Bugs Fixed

1. **Header overflow / cut-off "Request a Quote" button on the Japanese site** (found and fixed earlier this session, before this phase's brief arrived — included here for completeness since it's part of the same production-hardening effort). Committed and pushed as `656340a`.
2. **Portfolio gallery category headings showing raw slugs** instead of readable text (a data bug from an earlier session, also fixed and verified live before this phase began).
3. **No conversion event tracking** — implemented this phase (§9).
4. **Project videos had no `preload` attribute**, so nothing prevented eager loading — fixed this phase (§13).

Fixes 3 and 4 are committed locally as of this report but **not yet pushed** — see the final response for the push decision.

---

## 22. Remaining Issues

- No `Event`-specific JSON-LD on the portfolio detail page (enhancement, not a bug).
- Main JS bundle exceeds 500KB (pre-existing, would need admin-panel code-splitting to address — a real but non-trivial Phase 5 task).
- Tablet-width (768px) automated sweep wasn't re-run against the real repo this phase.
- No automated accessibility tool (axe/Lighthouse) was run — only manual/scripted spot checks.
- Firefox/Safari/Edge not tested (Chromium-only environment).
- `form_submit`/`form_error` verified by code review, not by an actual end-to-end submission (to avoid writing fake data to production).

---

## 23. Content Still Needed

Unchanged from earlier in this session — nothing new surfaced this phase:
- Real testimonials and client names (still fictional, confirmed live in Supabase).
- More real projects (still exactly 1 live).

---

## 24. Phase 5 Recommendations

1. **Content truth pass** — still the highest-leverage remaining item; unaffected by any QA/hardening work.
2. **Code-split the admin panel** into its own chunk boundary to address the >500KB main bundle (§11/§22).
3. **Add `Event` JSON-LD** to the real portfolio project (§7/§22).
4. **Run an automated accessibility audit** (axe-core or Lighthouse CI) to convert this phase's manual spot-checks into measured, repeatable results.
5. **Cross-browser QA** on Firefox/Safari/Edge, and a tablet-width (768px) pass, to close the gaps explicitly listed in §22.
6. **GA4 conversion goal configuration** in the GA4 property itself (marking `form_submit` as a key event) — a dashboard-side step, not a code change, now that the underlying event exists to configure against.

---

# Final Implementation Report

## IMPLEMENTED
- Conversion event tracking (`request_quote_click`, `contact_click`, `form_start`, `form_submit`, `form_error`, `project_view`, `service_view`, `language_switch`) via a new thin `gtag` wrapper — no second GA4 instance.
- `preload="none"` on project video elements to stop unnecessary eager loading.
- A full, real-route QA sweep (60 checks) against the actual production build.
- Live verification (not just code-reading) of canonical/hreflang, GA4 pageview dedup, focus-visible behavior, mobile menu Escape handling, and the video preload fix.

## ROUTES TESTED
Core, Services (×15, both locales), Portfolio (the 1 real project, both locales), Equipment, Solutions, Industries, Blog, FAQ, Careers, Contact, Quote, legal pages, `/login`, and an invalid route — **60/60 checks passed** at desktop (1440px) and mobile (375px) against the production build. Tablet (768px) and non-Chromium browsers were not covered this phase (see Remaining Issues).

## BUGS FIXED
1. Header overflow cutting off the Japanese "Request a Quote" button (fixed and deployed earlier this session).
2. Raw category slugs shown instead of readable labels on the live portfolio page (fixed earlier this session).
3. Missing conversion-event tracking (fixed this phase).
4. Missing video `preload` attribute allowing eager loading (fixed this phase).

## PERFORMANCE
Video preload fix confirmed to eliminate eager `.mp4` requests on page load (verified via network inspection: 0 requests before user interaction, vs. an indeterminate/eager default before). No other performance work was done. **Lighthouse was not run** — no Lighthouse scores are reported or implied anywhere in this document.

## ANALYTICS
GA4 pageview tracking verified working correctly (no duplicates in the production build). 8 new conversion events added and verified firing with correct, non-PII parameters — see §9 for the full table. No second analytics implementation installed.

## SEO
- **Sitemap**: correct production domain, correct hreflang alternates, no private/admin URLs. Verified.
- **Robots.txt**: correctly allows public content, blocks admin/dashboard/auth. Verified.
- **Canonical**: locale-aware, self-referencing per language, verified live on production.
- **Hreflang**: fully reciprocal ja/en with correct x-default, verified live on production.
- **Metadata**: unique title/description per page, i18n-driven, no stuffing. Verified.
- **Structured data**: Organization/LocalBusiness/WebSite (global), Service (per service page), ContactPage, BreadcrumbList — all present, all JSON-valid, no invented claims. Verified.

## EXISTING WORK PRESERVED
- **Phase 1 audit findings**: superseded by the real codebase's own (better) implementation — not "preserved" so much as found to already be resolved for most items (analytics, i18n, admin, real contact info).
- **Phase 2/3 information architecture**: does not exist in the real codebase (already explained earlier this session) — nothing to preserve because nothing to conflict with.
- **Event-media categorization**: fully intact on the real portfolio page — all 5 real category groups (Stage, LED & AV, Hall & Venue, Stalls & Exhibitions, Other; "Event Setup" correctly absent since no photos belong there) render with readable labels after this session's earlier fix, re-verified clean in this phase's sweep.
- **IBS project**: preserved, its video now loads more efficiently, its page now fires a `project_view` event.
- **Total Media branding**: untouched — no visual/color/logo changes made this phase.
- **Existing forms, analytics, and SEO implementation**: verified working, extended (analytics) or left alone (SEO — already correct) rather than rebuilt.

## REMAINING ISSUES
No `Event` schema on the project page; >500KB main bundle; tablet width and non-Chromium browsers not tested this phase; `form_submit`/`form_error` verified by code review rather than live execution (to avoid polluting production data). All listed in §22 with no exaggeration or invented severity.

## CONTENT REQUIRED
Real testimonials, real client names, and more real projects — the same, unchanged asks from earlier in this session. Nothing new.

## PHASE 5
1. Content truth pass (real testimonials/clients/projects)
2. Code-split the admin panel to address bundle size
3. Add `Event` JSON-LD to the real project page
4. Automated accessibility audit (axe/Lighthouse)
5. Cross-browser + tablet QA pass
6. Configure `form_submit` as a GA4 key event in the GA4 property
