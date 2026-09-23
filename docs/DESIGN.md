# Design System

The taste bar: this should look like it belongs next to a well-typeset editorial longform piece
or a top-tier SaaS landing page — not a "portfolio template." If in doubt, remove an element
rather than add one. Every deviation from plain text needs to earn its place.

## Reference points (mood, not literal copy)

- Editorial restraint of a Stripe or Linear landing page: one accent color, huge type confidence,
  no decoration for decoration's sake.
- The single-page personal-site genre at its best: generous negative space, a clear narrative
  scroll, type doing almost all of the work.
- Avoid: gradient mesh backgrounds, glassmorphism, emoji as icons, more than one decorative font,
  drop-shadow-heavy cards, carousel sliders, anything that screams "template."

## Type

- **Display / headings:** one serif with real character and confident weight contrast — e.g.
  `"Fraunces"`, `"Newsreader"`, or `"Source Serif 4"` (self-hosted via woff2, or Google Fonts if
  latency is acceptable — prefer self-hosted for a11y/perf discipline). Used for name, section
  titles, project titles. Large sizes, tight-ish letter spacing, generous line-height only where
  it wraps to multiple lines.
- **Body / UI:** one neutral, highly-legible sans — e.g. `"Inter"` or system-ui stack
  (`-apple-system, "Segoe UI", Helvetica, Arial, sans-serif`). System stack is the pragmatic
  choice for v1 (zero font-loading cost, still looks clean); revisit with a self-hosted variable
  font once visual direction is locked.
- **Scale:** modular scale (~1.25–1.333 ratio), fluid via `clamp()` so hero type sizes gracefully
  between mobile and desktop without separate breakpoints for font-size alone.
- **Weights:** cap at 2–3 per family (e.g. 400/500/700 for sans; 400/600 for serif). No more.

## Color

Two palette directions — pick one before first visual pass (see PLAN.md open items). Both use a
near-black/near-white base rather than pure black/white, which reads as more considered.

**Direction A — Warm minimal (paper + ink):**
- Background: `#FAF9F6` (warm off-white "paper")
- Text: `#1A1A18` (soft ink black)
- Muted text: `#6B6862`
- Accent: `#B5472B` (burnt terracotta) — used only for links, one hero underline/detail, hover
  states. Never as a background fill for large areas.
- Dark mode: background `#141311`, text `#EDEAE3`, same accent, slightly desaturated.

**Direction B — Cool minimal (mist + graphite):**
- Background: `#F7F8FA`
- Text: `#15181C`
- Muted text: `#697180`
- Accent: `#2451E0` (confident blue) or `#0F7A5E` (deep green) — pick one.
- Dark mode: background `#0E1013`, text `#EAECEF`.

Given the finance/credit-risk/quant thread running through the career content, Direction A (warm,
human, editorial) is the better contrast against all the "numbers and models" subject matter —
recommend defaulting to A unless you feel otherwise.

Both directions: accent color used for interactive/emphasis elements only, at most ~5% of visual
weight on any given screen. No secondary/tertiary accent colors — resist adding one per project.

## Spacing & layout

- 8px base spacing unit, scale: 4/8/12/16/24/32/48/64/96/128.
- Text content max-width: `65ch` (≈720px) for prose blocks — optimal reading measure.
- Wide content (project grid, experience timeline): max-width `1100–1200px`, centered, with
  fluid side padding (`clamp(1.25rem, 5vw, 4rem)`).
- Section vertical padding: large — `clamp(4rem, 12vh, 8rem)` top/bottom — this is what makes a
  minimal site feel premium rather than cramped.
- Grid: CSS Grid for project cards (auto-fit, minmax), Flexbox for everything else. No layout
  framework needed.

## Components (restrained inventory — don't grow this list without reason)

- **Nav:** fixed/sticky, minimal — name/mark on left, section anchors on right, collapses to a
  single menu affordance on mobile. Transparent over hero, solid background on scroll.
- **Hero:** name (large serif), one-line positioning (sans, muted), scroll-down cue. Optional
  subtle entrance fade/slide, respecting `prefers-reduced-motion`.
- **Experience timeline:** vertical rhythm list, not a boxed table — company/role/dates as a
  compact header row, narrative paragraph, resume bullets as a tight supporting list, subtle
  vertical connecting line as the only "timeline" decoration.
- **Project card:** title, one-line problem statement, 3–5 line outcome-focused description,
  tags (tech/domain), links (Live demo / Case study / — no "View Code" for the two private
  repos), optional thumbnail with consistent treatment (see Imagery below).
- **Hobbies block:** mixed layout — short text intro, photo grid slot (consistent aspect ratio,
  e.g. 4:5 or 1:1), Spotify embed slot (uses Spotify's official oEmbed iframe when tracks are
  supplied — no custom audio player needed).
- **Footer/contact:** name, LinkedIn, email (as mailto, or an anti-scrape-obfuscated display if
  preferred), resume download button, small print.
- **Buttons/links:** one primary button style (accent fill or accent outline — pick one direction
  and use consistently), text links get an understated underline treatment (not the browser
  default), never more than one visual button style per screen.

## Imagery treatment

- Consistent aspect ratio per context (project thumbnails all same ratio, photography grid all
  same ratio) — mismatched ratios are the #1 thing that makes a portfolio look amateur.
  Recommend `4:3` for project screenshots, `1:1` or `4:5` for a photography grid.
- Consider a subtle consistent treatment (e.g. a hairline border, or a slight desaturation on
  thumbnails that saturates on hover) to unify assets that will arrive from very different
  sources (app screenshots vs. photography vs. a press photo) once real images are added.

## Motion

- Section/element entrance: fade + small upward slide (~16–24px) on scroll into view, using
  `IntersectionObserver` — no scroll-jacking, no parallax gimmicks. Runs once per element; does
  not wait for user gesture.
- All motion wrapped in `@media (prefers-reduced-motion: no-preference)`.
- Hover states: opacity/color transitions only (150–200ms ease), no bouncy easing.

## Accessibility & performance baseline

- Semantic HTML throughout (`<nav>`, `<main>`, `<section>`, `<article>` per project/role, proper
  heading hierarchy — one `<h1>`, sections as `<h2>`).
- Color contrast AA minimum for body text against background in both light/dark.
- All images require `alt` text — placeholder slots ship with a clear `alt="[placeholder: ...]"`
  so gaps are obvious during the content pass, not silently broken.
- No layout shift from font loading (system stack for v1 sidesteps this entirely).
- Lighthouse targets once built: Performance 95+, Accessibility 100, Best Practices 100 — realistic
  for a static hand-built site with no heavy JS.
