# Content Plan

Section-by-section content architecture. Where the resume's bullet-fragment style is the only
source available, that's marked `[EXPAND]` — a placeholder ready for you to supply richer
narrative color in a later pass. Nothing here is final copy; it's the skeleton the HTML gets
built against.

Sources: `Jaime_Laniado_Cohen_Resume.pdf` (Sep-26 version, ground truth for dates/titles/metrics),
GitHub READMEs for the five projects, LinkedIn profile (public page is auth-gated — used only for
directional confirmation, not verbatim copy).

---

## 1. Hero (`#top`)

- **Name:** Jaime Laniado Cohen
- **Positioning line** — draft options (pick one or merge, later pass):
  1. "Credit risk & FP&A professional building AI-native financial tools."
  2. "I build data and AI systems that make lending decisions faster and better."
  3. "MBA candidate at Tepper. Ex-Nubank, Klar, Kontempo. Building where finance meets AI."
- **Sub-line:** current role/context — "FP&A MBA Intern at NVIDIA · MBA Candidate, Tepper School
  of Business" (update each time current role changes — this is the one piece of hero copy with
  a shelf life).
- **Primary CTA:** "View Résumé" (downloads PDF) or scroll cue to Experience.
- **Secondary CTA:** LinkedIn icon/link.
- Photo slot: optional editorial-style portrait, or hero can stay type-only (recommend type-only
  for v1 — a strong type-driven hero is more "expensive" than a mediocre photo; add photo once a
  good one exists).

## 2. Experience (`#experience`)

Reverse-chronological, per the resume. Interactive collapsed→expanded cards (see PLAN.md
"Interaction model" and DESIGN.md "Experience card"). Each card's **collapsed state** shows only:
company logo, company name, role title, team/group, dates — the "resume at a glance." Clicking
expands to reveal: one-sentence narrative framing (`[EXPAND]` — resume bullets compressed for
space, real narrative is richer), the resume bullets, and a photo if available.

**Team/group** field is new relative to the resume (which doesn't name teams) — flagged
`[EXPAND]` per role below; supply the actual team/org name where you have one, otherwise the
field can be omitted for that card rather than guessed.

### NVIDIA — FP&A MBA Intern
**Santa Clara, CA · May 2026 – Aug 2026**
**Team:** [EXPAND: which team/org within FP&A]
- [EXPAND] One-sentence framing of what this internship is really about beyond the two bullets
  below — what team, what the forecasting model actually touches, why it mattered to the org.
- Deployed a production forecasting model using hierarchical time-series reconciliation to
  project quarterly GPU revenue and product-mix across 17 enterprise verticals, covering ~15% of
  NVIDIA's ~$280B Data Center business.
- Replaced a yearly manual planning process with a fully automated, monthly pipeline, enabling
  the FP&A team to refresh long-range forecasts with no additional headcount.

### Kontempo.io — Credit Manager
**Mexico City, Mexico · Aug 2024 – Jun 2025**
*Early-stage fintech pioneering the B2B BNPL market. Raised US$32.7M.*
- [EXPAND] This is probably the single richest story on the resume (multi-agent LLM underwriting
  workflow going from 25 to 4 minutes of CEO review time) — worth a fuller case-study treatment:
  what the old process looked like, why a multi-agent architecture specifically, what "consensus"
  meant in practice.
- Engineered a multi-agent LLM underwriting workflow (specialist agents plus an agentic CRO
  reaching consensus) to parse unstructured SME financials, cutting CEO review time from 25 to 4
  minutes per company.
- Built a credit scorecard combining decision-tree-optimized cutoffs with logistic regression,
  achieving a 0.78 AUC.
- Enabled $6M monthly B2B financing, reducing defaults 9% YoY while sustaining 300% annual
  portfolio growth.
- Partnered with CEO and Finance to forecast profitability and unit economics (loss rates,
  funding costs, fees), shaping capital strategy and future funding needs.
- Leveraged analytics to refine pricing, collections strategy, and monitoring cadence, increasing
  credit fee revenue 5x YoY.

### Nubank — Credit Risk Management Senior Analyst
**Remote · Jul 2023 – Jul 2024**
*Most valuable digital bank in the world. 5th largest financial institution in LatAm.*
- [EXPAND] Context on scale — "informing four quarterly earnings reports" for a 100M+ customer
  base is a strong credibility signal; worth naming what kind of decisions these models actually
  drove.
- Built financial performance and cohort models and driver analyses informing four quarterly
  earnings reports and leadership decisions across a 100M+ customer base; partnered with Finance
  & IR on earnings-call narratives for investors and analysts.
- Refactored Scala data queries on Databricks (Apache Spark) into modular, unit-tested functions,
  automating reporting infrastructure, cutting manual hours 92%, and enabling real-time
  performance tracking.
- Built the data infrastructure and analytics behind monthly Risk Appetite Statement KPIs
  reviewed by the CRO and senior leadership.

### Klar — Analyst, promoted from Jr. Analyst
**Mexico City, Mexico · Jul 2022 – Jul 2023**
*Mexico's largest independent digital bank. Raised ~US$350M, 3M customers in 4 years.*
- [EXPAND] The promotion itself is a signal worth a half-sentence — what changed in scope.
- Built ETL pipelines in SQL and dbt, storing curated tables in Amazon S3 and Redshift, to
  support a valuation-based credit underwriting framework approving ~1M customers.
- Trained a clustering model for credit segmentation; separately, built risk and financial
  analyses presented to institutional lenders, securing a $100M credit facility.
- Built pricing and credit-limit elasticity curves from A/B test results, using DCF-based
  optimization to maximize Risk-Adjusted Margin across allocation scenarios.

### Nubank — Business Analyst Intern
**Mexico City, Mexico · Oct 2020 – Jan 2022**
- Developed first-generation credit risk model underwriting 3M+ customers, strengthening
  decision accuracy.
- Evaluated results of a foundational A/B test extending credit offers to previously rejected
  applicants, driving 16% portfolio growth and 4.8% margin improvement.

### Education (can live in Experience timeline or a small separate strip)
- **Carnegie Mellon University, Tepper School of Business** — MBA (STEM Designated), May 2027.
  Concentrations: Finance, Business Analytics, Strategy. President of Adam Smith Society,
  Graduate Finance Association, Business and Technology Club. MBA Merit Scholarship, LunaCap
  Foundation Scholar.
- **Tecnológico de Monterrey** — BA Economics and Finance, Dec 2022.

## 3. Projects (`#projects`)

Five embedded, runnable demo frames (see PLAN.md "Project demo strategy" for the iframe-vs-
hand-built-mockup technique per project, and the Gael demo spec for the build-order proof of
concept). Each frame: title, one-line problem statement, short outcome-focused write-up, tags,
the live embed itself, and — for the two private repos — no "View Code" link. Order below is
suggested (most visually/narratively striking first) — reorder freely.

### Gael — Personal Wealth Tracker
*Private repo — interactive mockup embedded inline, no code link (per your decision on
private-repo handling). Build proof of concept — see PLAN.md "Gael demo spec."*
- **One-liner:** A local-first wealth tracker that reconstructs your entire portfolio — cost
  basis, P&L, drift — from an append-only transaction ledger, across Mexican and US markets.
- **Tags:** Python · FastAPI · React/TypeScript · Electron · SQLite · Personal Finance
- **Write-up direction:** Electron desktop app + FastAPI/SQLite backend. Nothing is stored
  directly — every number (positions, cost basis, P&L, time-weighted return) is computed on
  demand from the transaction ledger, which is what makes corporate actions (stock splits) and
  FIFO cost-basis rules stay correct without ever rewriting history. Handles dual-currency
  (MXN/USD), multi-strategy rebalancing (including cross-strategy share netting before touching
  the market), and benchmarks against SPY/IPC. Single-user, local-only — no auth layer needed
  because nothing leaves the machine except read-only market-data lookups.
- **Why it's impressive:** this is a full-stack, tested (pytest suite covering the money math —
  FIFO lots, splits, TWR, P&L reconciliation), packaged desktop application, not a script.
- **Demo:** hand-built interactive Dashboard-tab mockup using fabricated sample portfolio data,
  with at least one live client-side control (e.g. MXN/USD toggle) — see PLAN.md "Gael demo
  spec." Proof-of-concept build for the interactive-demo pattern.
- **Links:** none (private) — consider "Available on request" language, per open item in PLAN.md.

### H-1B / PERM Sponsorship Explorer
- **One-liner:** An interactive dashboard mining 400K+ federal visa-sponsorship filings so
  international MBA students can target employers with realistic odds of sponsorship.
- **Tags:** Python · Pandas · Data Pipeline · GitHub Pages · Dashboard
- **Demo:** inline `<iframe>` embed of the live deployed dashboard (already a polished, public
  web app — no mockup needed).
- **Write-up direction:** Built on DOL OFLC disclosure data (H-1B/LCA and PERM filings). The real
  engineering problem was data hygiene, not analysis — DOL ships inconsistent formats release to
  release (some years one cumulative CSV, others four quarterly XLSX files), with corrupted text
  cells that silently broke classification for an entire quarter until traced and fixed. Built a
  consolidation pipeline that normalizes all of it into clean, deduplicated, gzip-compressed
  master files, distributed via GitHub Release since the raw data alone runs over 1GB. Output:
  a live filterable dashboard — filter by occupation, industry, state, wage level; see a ranked
  employer leaderboard with certification rate and H-1B→green-card pipeline status.
- **Why it's impressive:** real public-interest utility for a concrete audience (Tepper's
  international students), plus non-trivial ETL/data-engineering rigor under the hood.
- **Links:** Live dashboard — https://jlaniado.github.io/h1b_analysis/ · View Code (public repo)

### Underwriting Policy Optimization Framework
- **One-liner:** A reusable framework that mines interpretable, plain-language credit rules from
  a decision tree to cut First Payment Default while minimizing applicant loss.
- **Tags:** Python · Credit Risk · Decision Trees · Policy Optimization
- **Write-up direction:** Goes beyond one-off analysis — a repeatable process: train a shallow
  decision tree over the pre-application population, translate each leaf into a plain-language
  rule (e.g. `acquisition_uw_score <= 0.597 & apps_installed_count < 360`), then rank rules by
  efficiency (FPD reduction per % of population removed) and simulate their impact individually
  and cumulatively. Demonstrated result: six recommended rules cut overall FPD from 25.0% to
  22.9% while keeping 93% of applicants (vs. discarding volume indiscriminately).
- **Why it's impressive:** this is the "make ML decisions defensible to a credit committee"
  problem — interpretability and auditability as first-class design goals, not an afterthought.
- **Demo:** hand-built interactive mockup — adjustable rule thresholds against a fixed fabricated
  applicant dataset, with a chart (FPD vs. applicants removed) that updates live as thresholds
  change. Built after Gael, reusing its component patterns.
- **Links:** View Code (public repo) — the live demo is the interactive mockup above, not the
  notebook itself.

### Parents Are Human (fan recreation)
- **One-liner:** A bilingual connection-card web game — an unofficial, fan-built recreation of
  the Parents Are Human card deck, designed to spark deep conversation with the people who raised
  you.
- **Tags:** React · TypeScript · Vite · vanilla-extract · GitHub Actions
- **Demo:** inline `<iframe>` embed of the live deployed game (already a polished, public web
  app — no mockup needed).
- **Write-up direction:** 70 cards (50 questions, 20 actions) transcribed with English/Spanish
  text, category, and depth level (1–2 chili peppers). Four independent shuffled decks that
  persist history as you toggle level/actions. Mobile-first — built to actually be handed across
  a table during a real conversation, not browsed on a laptop. Deployed via GitHub Actions on
  every push. Includes original content (an "Adulthood" category) written for this fork, clearly
  separated from the original creators' material with proper attribution.
- **Why it's impressive:** it's the most personal/values-driven project on the list — shows
  craft (bilingual, accessible, mobile-first) applied to something that isn't a resume line, and
  a genuinely playable live demo people can click into during a portfolio visit.
- **Links:** Live demo — https://jlaniado.github.io/parents-are-human/ · View Code (public repo)

### Optimal-Portfolio-CTGAN
*Private repo — interactive mockup embedded inline, no code link (per your decision on
private-repo handling).*
- **One-liner:** A personal portfolio optimizer that recreates a published CTGAN-based asset
  allocation research paper to replace a 1%-AUM robo-advisor fee with a self-run, twice-yearly
  rebalancing notebook.
- **Tags:** Python · CTGAN · Portfolio Optimization · Jupyter · Quantitative Finance
- **Write-up direction:** Replicates Fintual's published methodology ("A Modified CTGAN-Plus-
  Features Based Method for Optimal Asset Allocation," Peña et al. 2024) — using a CTGAN to
  generate synthetic return scenarios, extended with Dalio-style All Weather principles and
  dual-currency (MXN/USD) awareness. Outputs concrete buy/sell rebalancing instructions in both
  currencies. The pitch is explicit and quantified: on a $100K portfolio over 20 years at 8%
  CAGR, a 1% AUM fee compounds to $45K+ in lost wealth — this is a rigorous, free substitute for
  annual rebalancing on a personal portfolio. Frame it as a modernization of Markowitz mean-
  variance optimization using synthetic-data-augmented return distributions.
- **Why it's impressive:** implementing a research paper end-to-end, with a genuinely quantified
  real-world financial outcome, is a rare combination of academic rigor and personal utility.
- **Demo:** hand-built interactive rebalancing calculator using fabricated sample allocation
  output — target weights and buy/sell instructions in MXN/USD, recomputed as sample inputs
  change. Demos the output artifact, not the CTGAN training process itself.
- **Links:** none (private) — consider "Available on request" language, per open item in PLAN.md.

## 4. Hobbies (`#hobbies`)

Lighter section, tonal shift from the career/project density above — this is where the site earns
"personally managed LinkedIn" instead of just "LinkedIn." Per your decision, ships as structural
placeholders now; real media added in a later pass.

- **Music:** Co-founder and songwriter, indie rock band with 10K+ fans (per resume). Placeholder
  slot for 1–3 embedded Spotify tracks (Spotify oEmbed iframe — no custom player needed once
  links are supplied) plus a short band bio `[EXPAND: band name, your role, a sentence on the
  sound/story]`.
- **Photography:** Placeholder photo grid slot (consistent aspect ratio per DESIGN.md — recommend
  4:5 or 1:1), `[EXPAND: what you shoot — travel, street, portraits — and how you got into it]`.
- **Other texture (optional, light-touch, not full sections):** Padel tennis; reading The
  Economist/FT/WSJ; freelance credit-strategy consulting (30+ advisory sessions for fintechs and
  hedge funds); languages (Spanish, English, Portuguese, Hebrew) and citizenships (Mexican, EU);
  Birthright Excel Fellow; volunteered in Poland with Ukrainian war refugees. These can live as a
  short closing list/strip rather than individual cards — texture, not another set of case
  studies.

## 5. Contact / Footer (`#contact`)

- LinkedIn: https://www.linkedin.com/in/jaimelan/
- Email: `[EXPAND: preferred public-facing contact email]` — recommend a dedicated address or
  obfuscated mailto rather than jlaniado@tepper.cmu.edu if you'd rather keep the school address
  off a public page.
- Resume download (PDF, synced from `resume/Jaime_Laniado_Cohen_Resume.pdf`).
- Small print: © year, "Built by Jaime Laniado Cohen."

---

## Copy tone guide

- First person, confident, plain. No "passionate about leveraging synergies" — the resume bullets
  already prove competence with numbers; the narrative prose should add *why*, not more *what*.
- Short sentences. Let the metrics do the bragging; the prose stays understated.
- Present the private-repo projects (Gael, Optimal-Portfolio-CTGAN) with the same confidence as
  the public ones — "private repo" should read as a normal, unremarkable fact, not an apology.
