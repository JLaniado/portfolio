# Portfolio

Personal site for Jaime Laniado Cohen — career background, side projects, and hobbies. Built as
flat HTML/CSS/JS with no build step, deployed free via GitHub Pages.

## Status

Structure and content planning in progress. See `docs/`:

- [`docs/PLAN.md`](docs/PLAN.md) — site map, repo structure, deployment approach, open decisions
- [`docs/DESIGN.md`](docs/DESIGN.md) — type, color, layout, motion, and component system
- [`docs/CONTENT.md`](docs/CONTENT.md) — section-by-section copy plan, sourced from resume and
  project READMEs (items marked `[EXPAND]` are placeholders awaiting richer narrative)

## Local preview

No build step — open `index.html` directly, or serve locally to test relative paths and any
fetch-based behavior:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deployment

GitHub Pages, serving from `main` / root. Push to `main` and the live site updates automatically
once Pages is enabled in repo Settings → Pages → Source: `main` branch, `/ (root)`.

## Structure

```
index.html            single-page site
assets/css/           design tokens, base styles, layout/components
assets/js/            nav state, scroll reveals
assets/img/           profile, project, and hobby imagery
resume/                downloadable résumé PDF
docs/                  planning docs (this is where the design/content decisions live)
```
