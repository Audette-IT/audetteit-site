# Audette IT

Personal IT help for family and friends — everything from everyday
troubleshooting to real network and Active Directory infrastructure work.
Not a registered business.

**Branch:** `dev` — integration branch for active development. The site on
`main` matches this branch (last release: PR #65, 2026-09-24). Start with
`CLAUDE.md`: it's the full handoff for new sessions.

## Branch flow

```
feature/*  →  dev  →  staging  →  main
```

- `main` — production (the Cloudflare Worker deploys from here). Live at
  https://audetteit.com.
- `staging` — pre-production, gets a Cloudflare Worker preview.
- `dev` — this branch. Integrates finished feature work before promotion.
- `feature/*` — one branch per unit of work, merged back into `dev`.

## Structure

```
/public              # everything served to visitors
  index.html         # Home (floor-plan figure)
  services.html      # Everyday help + bigger jobs               -> /services
  how-it-works.html  # Steps, in person or remote, FAQ           -> /how-it-works
  about.html         # About Michael                              -> /about
  contact.html       # Contact form (opens your email app)        -> /contact
  privacy.html       # Plain-language privacy note                -> /privacy
  *.md               # Markdown twin of each page
  llms.txt           # Index of the Markdown pages for AI agents
  llms-full.txt      # All pages in one file (generated, don't hand-edit)
  _headers           # Security + cache headers for static files
  site.webmanifest, robots.txt, sitemap.xml
  /css/site.css      # All page styles (light + dark)
  /js/site.js        # Mobile menu, floor-plan room picker, contact form
  /js/consent.js     # Cookie banner; loads Google Tag Manager only after Accept
  /css/consent.css   # Cookie banner styles
  /assets            # logo.svg (source mark), rendered logo + favicons
/worker/index.js     # Page routes only: Markdown for Accept: text/markdown
wrangler.jsonc       # Cloudflare Worker config
scripts/check-links.py  # Link + Markdown-coverage checker (run in CI)
scripts/build-llms.py   # Regenerates public/llms-full.txt
tools/               # Local helpers (not deployed): browser QA, icon renderer,
                     # Artifact preview builder, issue-tracker sync
ASSETS.md            # Where every image came from
```

## Markdown for agents

Every page has a Markdown version, three ways:

- `https://audetteit.com/services.md` (append `.md`; the homepage is `/index.md`)
- the normal URL with `Accept: text/markdown`
- `llms.txt` (index) and `llms-full.txt` (everything in one file)

When you change a page, update its `.md` twin too, then run
`python3 scripts/build-llms.py`. Adding a page means touching seven places,
all enforced by `scripts/check-links.py`: the page, its `.md` twin,
`MARKDOWN_PAGES` in `worker/index.js`, `run_worker_first` in
`wrangler.jsonc`, `sitemap.xml`, `llms.txt`, and a canonical-`Link` block in
`public/_headers` (plus `PAGES` in `scripts/build-llms.py`).

## Running locally

No build step. Run it locally exactly as deployed:

```
npx wrangler dev
```

Browser QA (all pages, phone + desktop, light + dark, accessibility):
`cd tools && npm install && node site-qa.js` while `wrangler dev` runs on
port 8795. See `tools/README.md`.

## Design direction

A "room guide" look (2026-09, issues #60/#61): Red Hat Display/Text, heavy
black rules, the site blue, yellow highlights, and a hand-drawn floor plan of a
house as the homepage figure. See `CLAUDE.md` for the details.

## Status

Live since 2026-09-23; the "room guide" redesign (#60/#61) went live on
2026-09-24. Still open: the service list will grow as more gets built out.
