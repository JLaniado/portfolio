# Portfolio Site — Plan

Personal site for Jaime Laniado Cohen: career narrative (a self-curated, more detailed LinkedIn)
plus a showcase of side projects and hobbies. Static HTML/CSS/JS, deployed free via GitHub Pages.

## Goals

1. **Look expensive, not busy.** Minimalist, editorial, confident white space. The bar is "looks
   like a well-typeset essay / a Linear or Stripe landing page," not "looks like a portfolio
   template." Good taste reads as restraint — one type pairing, one accent color, no gradients,
   no stock icons, no card-shadow soup.
2. **Career depth without resume-dump.** The resume is compressed by design (one page, bullet
   fragments). The site can breathe — short narrative framing per role, the resume bullets as
   supporting detail, not the headline.
3. **Projects as case studies, not repo links.** Each project gets a short "problem → approach →
   outcome" treatment, not just a GitHub badge. Two projects (Gael, Optimal-Portfolio-CTGAN) stay
   private repos — write-up + screenshots only, no "View Code" link for those two.
4. **Ship as flat HTML.** No build step, no framework, no bundler. `index.html` + a few section
   partials or a single long page (see Site Map below), one CSS file, minimal JS for
   interactions (scroll reveals, nav state, theme toggle if any). This is what makes free GitHub
   Pages hosting trivial — push to `main`, done.

## Non-goals (for this pass)

- No CMS, no markdown-to-HTML pipeline, no React/Vue/Svelte. If the site outgrows flat HTML later
  that's a separate decision.
- No final copy for every section yet — this pass defines structure and placeholders sourced from
  resume + repo READMEs. Deep-dive copy (expanded role narratives, photo captions, song credits)
  is a follow-up content pass.
- No photos/music files yet — hobbies section ships with clearly marked placeholder slots.

## Site map

Single-page scroll site (`index.html`) with anchored sections + sticky minimal nav. This is the
standard for personal portfolios in this style (see: Awwwards-tier individual sites) — it reads
as one considered piece rather than a multi-page maze, and it's the simplest thing that could
work for a v1 flat-HTML build.

| # | Section | Anchor | Purpose |
|---|---------|--------|---------|
| 1 | Hero | `#top` | Name, one-line positioning, subtle entrance animation, scroll cue |
| 2 | Experience | `#experience` | Career timeline: NVIDIA → Kontempo.io → Nubank → Klar → Nubank |
| 3 | Projects | `#projects` | 5 project case-study cards |
| 4 | Hobbies | `#hobbies` | Music, photography, other interests |
| 5 | Contact | `#contact` | LinkedIn, email, resume download, footer |

If content volume later demands it, Projects can split into a `/projects/<slug>.html` detail page
per project (linked from the card "Read more"), keeping the main page a fast-scanning index. Not
needed for v1 — see CONTENT.md for what each card holds.

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
│   │   └── main.css            layout + component styles
│   ├── js/
│   │   └── main.js             nav state, scroll reveals, theme toggle
│   └── img/
│       ├── profile/            headshot/hero image
│       ├── projects/           per-project screenshots/thumbnails
│       └── hobbies/            photography samples, band/press photo
├── resume/
│   └── Jaime_Laniado_Cohen_Resume.pdf   downloadable resume (synced from source of truth)
├── docs/
│   ├── PLAN.md                 this file
│   ├── DESIGN.md               design system spec
│   └── CONTENT.md              section-by-section content plan + copy sources
├── .github/workflows/
│   └── pages.yml                (optional — plain Pages deploy from /root or /docs, TBD below)
├── .nojekyll                   disables Jekyll processing (safe default for a hand-built site)
└── README.md                   repo overview + local preview instructions
```

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
