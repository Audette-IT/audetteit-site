# Audette IT

Personal IT help for family and friends — everything from everyday
troubleshooting to real network and Active Directory infrastructure work.
Not a registered business.

**Branch:** `dev` — integration branch for active development. Feature
branches merge in here before being promoted to `staging` and eventually
`main`. See `CLAUDE.md` for full project context.

## Branch flow

```
feature/*  →  dev  →  staging  →  main
```

- `main` — production (Cloudflare Pages deploys from here). Currently a
  maintenance page while the full rewrite is in progress.
- `staging` — pre-production, gets a Cloudflare Pages preview deployment.
- `dev` — this branch. Integrates finished feature work before promotion.
- `feature/*` — one branch per unit of work, merged back into `dev`.

## Current status

The homepage/services/contact redesign is implemented and ready for review on
`feature/homepage-redesign`, but **not yet merged into `dev`**. Check that
branch (or `CLAUDE.md`) for the latest work-in-progress state.

## Structure

```
/public
  index.html      # Currently the maintenance page (mirrors main)
  robots.txt
  sitemap.xml
  /assets         # Logo, favicons
/functions
  index.js        # Cloudflare Pages Function — serves Markdown on `/`
                    when requested with `Accept: text/markdown`
```

No build step — plain static HTML/CSS/JS, deployed via Cloudflare Pages.
