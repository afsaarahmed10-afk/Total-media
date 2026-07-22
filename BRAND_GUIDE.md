# TOTAL MEDIA — Brand Guide

## Logo

The mark is four signal/equalizer bars forming an asymmetric peak, with the
tallest bar rendered in the accent "Signal Blue." It reads simultaneously as:

- **A broadcast/audio signal** — the company's technical production core
- **A peak** — a restrained nod to Japanese landscape without being literal
- **A single point of transmission** — the accent bar marks where signal
  becomes broadcast, echoing "total" coverage across every event

Two forms:

- **Mark** (`public/brand/logo-mark.svg`) — the glyph alone, for tight
  spaces (favicons, app icons, social avatars, mobile nav)
- **Lockup** (`Logo` React component, `src/components/brand/Logo.tsx`) —
  mark + "TOTAL MEDIA" wordmark, for the site header, footer, and documents

There is no boxed/badged version of the mark for general use — it stands on
its own, the way most premium marks (Sony, Apple) do not sit in a container.
The one exception is the app-icon tile (`logo-mark-tile.svg`) required by
platforms that mandate a filled square/rounded-square icon.

## Color Variants

| Variant | Bars | Accent bar | Use on |
|---|---|---|---|
| Full color (light) | Navy `#0B1F3A` | Signal Blue `#2F6FEA` | White / light gray backgrounds |
| Full color (dark) | White `#FFFFFF` | Signal Blue `#2F6FEA` | Navy / charcoal backgrounds |
| Monochrome | `currentColor` | `currentColor` | Single-color print, embossing, watermarks — `logo-mark-mono.svg` |

Use the `Logo` component's `tone` prop (`"navy" | "white"`) to switch
between light/dark contexts; never recolor the accent bar.

## Clearspace & Minimum Size

- Clearspace on all sides ≥ the height of one bar-gap unit (the mark's own
  internal rhythm) — in practice, don't let text or edges sit closer than
  ~25% of the mark's height on any side.
- Minimum size: 20px height for the mark alone (favicon-safe down to 16px),
  120px width for the full lockup. Below that, use the mark only.

## Typography

Inter (self-hosted, `@fontsource/inter`), weights 400–800. "TOTAL" sets in
Extrabold (800) tight-tracked; "MEDIA" sets in Medium (500) with wider
letter-spacing as a counterweight — this pairing is specific to the wordmark
and is not used elsewhere in the UI.

## Misuse

- Don't recolor the bars outside the two defined tones
- Don't rotate, skew, or add drop shadows/gradients/outlines to the mark
- Don't change the relative bar heights or which bar carries the accent
- Don't place the un-boxed mark on busy photographic backgrounds — use the
  tile variant or a solid-color placement instead

## Assets

Generated via `node scripts/generate-brand-assets.mjs` from the two source
SVGs in `public/brand/`. Regenerate after any change to those source files.

- `public/favicon.svg`, `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`
- `public/apple-touch-icon.png`, `icon-192.png`, `icon-512.png`
- `public/og-default.png` — default social share image (1200×630)
