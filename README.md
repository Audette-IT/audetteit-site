# Audette IT

Personal IT help for family and friends — everything from everyday
troubleshooting to real network and Active Directory infrastructure work.
Not a registered business.

**Branch:** `dev` — integration branch for active development. Everything
here as of 2026-09-23 is live on `main` (PR #49). See `CLAUDE.md` for full
project context.

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
  index.html         # Home
  services.html      # Everyday help + infrastructure/advanced   -> /services
  contact.html       # Contact form (opens your email app)        -> /contact
  privacy.html       # Plain-language privacy note                -> /privacy
  index.md, services.md, contact.md, privacy.md  # Markdown twin of each page
  llms.txt           # Index of the Markdown pages for AI agents
  llms-full.txt      # All pages in one file (generated, don't hand-edit)
  _headers           # Security + cache headers for static files
  site.webmanifest, robots.txt, sitemap.xml
  /js/site.js        # Mobile menu + contact form behavior
  /assets            # Logo, favicons
/worker/index.js     # Page routes only: Markdown for Accept: text/markdown
wrangler.jsonc       # Cloudflare Worker config
scripts/check-links.py  # Link + Markdown-coverage checker (run in CI)
scripts/build-llms.py   # Regenerates public/llms-full.txt
ASSETS.md            # Where every image came from
```

## Markdown for agents

Every page has a Markdown version, three ways:

- `https://audetteit.com/services.md` (append `.md`; the homepage is `/index.md`)
- the normal URL with `Accept: text/markdown`
- `llms.txt` (index) and `llms-full.txt` (everything in one file)

When you change a page, update its `.md` twin too, then run
`python3 scripts/build-llms.py`. Adding a page means adding it in five places,
all enforced by `scripts/check-links.py` in CI: the `.md` twin,
`MARKDOWN_PAGES` in `worker/index.js`, `run_worker_first` in
`wrangler.jsonc`, `sitemap.xml`, and `llms.txt` (plus `PAGES` in
`scripts/build-llms.py`).

## Running locally

No build step. Run it locally exactly as deployed:

```
npx wrangler dev
```

## Design direction

An "ops console" visual language (IBM Plex Mono headlines, sharp corners,
hairline borders, one sparing signal-blue accent) instead of a generic
SaaS-template look. See `CLAUDE.md` for the reasoning and sources.

## Status

Live since 2026-09-23. Still open: the service list will grow as more gets
built out, and the logo's rights need confirming (`ASSETS.md`).
