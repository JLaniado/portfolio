# Portfolio Site — Plan

Personal site for Jaime Laniado Cohen: career narrative (a self-curated, more detailed LinkedIn)
plus a showcase of side projects and hobbies. Static HTML/CSS/JS, deployed free via GitHub Pages.
Interactive and didactic by design — visitors click/explore to reveal depth rather than reading a
wall of static text, and project sections are runnable mini-demos, not screenshots.

## Goals

1. **Look expensive, not busy.** Minimalist, editorial, confident white space. The bar is "looks
   like a well-typeset essay / a Linear or Stripe landing page," not "looks like a portfolio
   template." Good taste reads as restraint — one type pairing, one accent color, no gradients,
   no stock icons, no card-shadow soup. Interactivity has to earn this bar too: playful means
   delightful micro-interactions with restraint, not busy or gimmicky.
2. **Progressive disclosure over resume-dump.** The resume is compressed by design (one page,
   bullet fragments). The site reveals depth on interaction: a role/company shows only
   title+logo+team at rest, and expands (click/tap) into narrative, bullets, and photos. Nobody
   is forced to read everything — they choose their own depth.
3. **Projects as living demos, not case-study text.** Every project section is something a
   visitor can actually click into and use, running inside the same page — not a GitHub badge,
   not a static screenshot. See "Project demo strategy" below for how each of the 5 differs.
4. **Ship as flat HTML.** No build step, no framework, no bundler, no server. `index.html` + a
   handful of small vanilla-JS modules (one per interactive component), one CSS file. Embedded
   demos are self-contained HTML/CSS/JS using fabricated-but-realistic sample data — never a real
   backend call. This is what keeps free GitHub Pages hosting trivial — push to `main`, done.

## Non-goals (for this pass)

- No CMS, no markdown-to-HTML pipeline, no React/Vue/Svelte. If the site outgrows flat HTML later
  that's a separate decision.
- No final copy for every section yet — this pass defines structure and placeholders sourced from
  resume + repo READMEs. Deep-dive copy (expanded role narratives, photo captions, song credits)
  is a follow-up content pass.
- No photos/music files yet — hobbies section ships with clearly marked placeholder slots.
- No real backend/data connections in any embedded demo — sample data is fabricated to be
  representative of real output, clearly framed as illustrative (see Project demo strategy).

## Site map

Single-page scroll site (`index.html`) with anchored sections + sticky minimal nav. This is the
standard for personal portfolios in this style (see: Awwwards-tier individual sites) — it reads
as one considered piece rather than a multi-page maze, and it's the simplest thing that could
work for a v1 flat-HTML build.

| # | Section | Anchor | Purpose |
|---|---------|--------|---------|
| 1 | Hero | `#top` | Name, one-line positioning, subtle entrance animation, scroll cue |
| 2 | Experience | `#experience` | Interactive career timeline — click a company to expand |
| 3 | Projects | `#projects` | 5 embedded, runnable project demos |
| 4 | Hobbies | `#hobbies` | Music, photography, other interests |
| 5 | Contact | `#contact` | LinkedIn, email, resume download, footer |

Kept as one `index.html` even with embedded demos — each demo is a self-contained component
(markup + scoped JS in its own module file) mounted into a section of the single page, not a
separate route. If a specific demo's markup grows large, it can be pulled into a `<template>` or
loaded as an HTML partial fetched at runtime — decide per-component if/when one gets unwieldy, not
up front.

## Interaction model

### Experience: collapsed → expanded cards

- **At rest:** each role renders as a compact card — company logo, company name, role title,
  team/group name, dates. This is the entire "resume at a glance" — scannable in seconds, no
  narrative text visible yet.
- **On interaction (click/tap/Enter/Space):** the card expands in place (accordion-style, one open
  at a time or several — decide during build based on feel) to reveal: one-sentence narrative
  framing, the resume bullets, and a photo/logo/screenshot if available. Collapse returns it to
  the compact state.
- **Why this shape:** it mirrors how you'd actually walk someone through your career in
  person — headline first, story on request — and it's the mechanism that lets the page stay
  visually minimal at rest while still holding real depth underneath.
- **A11y:** implemented as native `<details>/<summary>` where possible (free keyboard support,
  free screen-reader semantics, works with JS disabled) with custom styling/animation layered on
  top via CSS/JS enhancement — not a from-scratch ARIA widget unless `<details>` proves too
  restrictive for the desired animation.
- **Logos:** need a small logo asset per company (NVIDIA, Kontempo.io, Nubank, Klar) — see Open
  Items. Placeholder monogram/wordmark treatment until real logos are sourced (official brand
  logos are fine to use for "worked at" attribution — standard portfolio/resume practice).

### Projects: embedded runnable demos, strategy per project

Two different techniques depending on whether a live deployed app already exists:

| Project | Technique | Why |
|---|---|---|
| Parents Are Human | Inline `<iframe>` of the live GitHub Pages deploy | Already a polished, live, public web app — embed it directly, full fidelity, zero rebuild cost. |
| H1B / PERM Sponsorship Explorer | Inline `<iframe>` of the live GitHub Pages dashboard | Same — already live and public. |
| Gael | Hand-built interactive HTML/CSS/JS mockup of the dashboard using fabricated sample portfolio data | No browser-runnable form exists (Electron + FastAPI + SQLite) — proof-of-concept for this technique; see "Gael demo spec" below. |
| Underwriting Policy Optimization Framework | Hand-built interactive mockup: adjustable rule thresholds against a fixed fabricated dataset, showing FPD/approval-rate trade-off update live | Notebook-based, not browser-runnable — the interesting part (trade-off curves respond to rule choices) translates well to a small JS-driven chart. |
| Optimal-Portfolio-CTGAN | Hand-built interactive mockup: a small allocation/rebalancing calculator using fabricated sample output (target weights, buy/sell instructions in MXN/USD) | Notebook-based, not browser-runnable — demo the *output artifact* (a rebalancing plan) rather than the CTGAN training process itself, which isn't meaningfully visualizable interactively. |

All fabricated sample data must be clearly representative of real behavior (grounded in the real
README's described outputs/metrics) and should carry a small, honest "illustrative sample data"
label in the demo UI itself — didactic, not deceptive. This is a portfolio demonstrating how you
think and build, not a claim that the live numbers are real.

**Build sequencing (per your direction):** build the Experience interaction pattern plus one full
project demo (Gael) first as a proof of concept, review quality/feel together, then extend the
same patterns to the remaining four projects. Iframe embeds (Parents Are Human, H1B) are low
effort and can follow immediately after Gael is approved, then the two remaining hand-built
mockups (Underwriting, CTGAN) last since they reuse patterns established by Gael.

### Gael demo spec (proof of concept)

Rebuilt as static HTML/CSS/JS, no backend:
- A tab or card-switcher UI mirroring the real app's Dashboard / Strategies / Transactions areas
  (start with **Dashboard** only for the proof of concept — total value, cost basis, realized/
  unrealized P&L, a simple SPY/IPC benchmark comparison stat, 2–3 "action item" style alerts).
  Extend to a second tab (Strategies, showing fund-allocation vs. stock-direct target weights)
  once the Dashboard tab is approved.
- Sample data: a fabricated but realistic portfolio (a handful of MXN/USD positions across a
  couple of strategies) hardcoded in a small JS data file — not fetched from anywhere.
- Interaction: clicking between tabs/cards swaps the visible panel; at least one control (e.g. a
  USD/MXN toggle, matching the real app's UI) actually recomputes displayed numbers client-side,
  so it's genuinely interactive rather than a static image with tab chrome.
- Framed with a short caption: "Interactive recreation of Gael's dashboard, using sample data —
  the real app is a local-first Electron/FastAPI tool that runs entirely on my machine."

## Design system (see DESIGN.md for full detail)

- **Type:** one serif display face for headings (editorial, confident) + one neutral sans for
  body/UI. System-first font stack or a single self-hosted variable font — no more than 2
  families, no more than 3 weights each.
- **Color:** near-black / near-white base (true minimalism, not pure #000/#fff — soft off-black
  ink on warm off-white paper), one accent color used sparingly (links, highlights, one hero
  detail). Dark mode supported via `prefers-color-scheme` + manual toggle.
- **Layout:** generous vertical rhythm, content capped at a readable max-width (~720–840px for
  text, wider for project grids), asymmetric hero, no boxed "cards everywhere" aesthetic —
  projects use restrained dividers/whitespace rather than heavy shadowed cards.
- **Motion:** subtle, purposeful only — fade/slide-in on scroll for section entrances, nothing
  gimmicky, respects `prefers-reduced-motion`.
- **Imagery:** treated consistently (consistent aspect ratio, consistent duotone/treatment if any)
  so placeholder gaps don't look broken later.

## Content architecture

See CONTENT.md for the full section-by-section copy plan, sourced from:
- Resume: `Resume/Sep-26/Jaime_Laniado_Cohen_Resume.pdf` (ground truth for dates/titles/metrics)
- Project repos: READMEs pulled directly from GitHub (`JLaniado/h1b_analysis`,
  `JLaniado/parents-are-human`, `JLaniado/underwriting_policy_optimization_framework`,
  `JLaniado/Gael`, `JLaniado/Optimal-Portfolio-CTGAN`)
- LinkedIn (`linkedin.com/in/jaimelan`): public page is auth-gated, so only used for the base
  narrative arc, not verbatim copy. Richer per-role narrative to be supplied by Jaime in a later
  pass — flagged inline in CONTENT.md as `[EXPAND: ...]`.

## Repo structure

```
AIPortfolioDemo/
├── index.html                 single-page site
├── assets/
│   ├── css/
│   │   ├── tokens.css          design tokens: color, type, spacing scales
│   │   ├── base.css            reset + base element styles
│   │   ├── main.css            layout + component styles
│   │   └── demos.css           shared styling for embedded project demo components
│   ├── js/
│   │   ├── main.js             nav state, scroll reveals, theme toggle
│   │   ├── experience.js       expand/collapse interaction for role cards
│   │   └── demos/
│   │       ├── gael.js               Gael dashboard mockup: sample data + interactions
│   │       ├── underwriting.js       Underwriting rule-threshold mockup
│   │       └── ctgan.js              Portfolio rebalancing calculator mockup
│   ├── data/
│   │   ├── gael-sample.js            fabricated sample portfolio data for the Gael demo
│   │   ├── underwriting-sample.js    fabricated sample population/rule data
│   │   └── ctgan-sample.js           fabricated sample allocation output data
│   └── img/
│       ├── profile/            headshot/hero image
│       ├── logos/              company logos for experience cards (NVIDIA, Kontempo.io, Nubank, Klar)
│       ├── projects/           per-project screenshots/thumbnails
│       └── hobbies/            photography samples, band/press photo
├── resume/
│   └── Jaime_Laniado_Cohen_Resume.pdf   downloadable resume (synced from source of truth)
├── docs/
│   ├── PLAN.md                 this file
│   ├── DESIGN.md               design system spec
│   └── CONTENT.md              section-by-section content plan + copy sources
├── .nojekyll                   disables Jekyll processing (safe default for a hand-built site)
└── README.md                   repo overview + local preview instructions
```

Each embedded demo is one JS module (state + render logic) + one sample-data module, kept
separate so the "fabricated sample data" boundary is always obvious and auditable in the source —
never interleaved with real content logic.

## Deployment

GitHub Pages, serving from the `main` branch root (Settings → Pages → Deploy from a branch →
`main` / `/root`). No GitHub Action required for a static site with no build step — simplest
possible setup. `.nojekyll` included so any files/folders starting with `_` aren't swallowed by
Jekyll's default processing.

## Open items / decisions deferred to you

- [ ] Confirm final wording of the one-line positioning statement in the hero (draft options in
      CONTENT.md).
- [ ] Supply richer per-role narrative color beyond resume bullets, where you want more depth than
      the compressed resume phrasing (marked `[EXPAND]` in CONTENT.md).
- [ ] Supply headshot / hero image, project screenshots, photography samples, Spotify track
      links/embeds when ready — placeholders are wired into the structure now.
- [ ] Confirm whether Gael and Optimal-Portfolio-CTGAN sections should eventually get "Request
      access" / "Available on request" language instead of just omitting a code link entirely.
- [ ] Pick accent color (see DESIGN.md options) once first visual pass is up.
- [ ] Company logos for Experience cards (NVIDIA, Kontempo.io, Nubank, Klar) — using official
      logos for "worked at" attribution is standard practice; source clean SVG/PNG versions
      (company press/brand pages usually provide these) or confirm a simpler wordmark-only
      treatment is fine for v1.
- [ ] Review the Gael demo (Experience interaction + Projects proof of concept) once built, before
      the same interaction patterns are extended to Underwriting and CTGAN, and before the two
      live iframe embeds (Parents Are Human, H1B) are wired in.
