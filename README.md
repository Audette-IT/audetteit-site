# Audette IT

Personal IT help for family and friends — everything from everyday
troubleshooting to real network and Active Directory infrastructure work.
Not a registered business.

**Branch:** `dev` — integration branch for active development. The
homepage/services/contact redesign is merged here. Not yet promoted to
`staging` or `main` (which still shows the maintenance page). See
`CLAUDE.md` for full project context.

## Branch flow

```
feature/*  →  dev  →  staging  →  main
```

- `main` — production (Cloudflare Pages deploys from here). Currently a
  maintenance page while the full rewrite is in progress.
- `staging` — pre-production, gets a Cloudflare Pages preview deployment.
- `dev` — this branch. Integrates finished feature work before promotion.
- `feature/*` — one branch per unit of work, merged back into `dev`.

## Structure

```
/public
  index.html      # Home
  services.html   # Everyday help + infrastructure/advanced capabilities
  contact.html    # Contact form + real contact info
  robots.txt
  sitemap.xml
  /assets         # Logo, favicons
/functions
  index.js        # Cloudflare Pages Function — serves Markdown on `/`
                    when requested with `Accept: text/markdown`
```

No build step — plain static HTML/CSS/JS, deployed via Cloudflare Pages.

## Design direction

An "ops console" visual language (IBM Plex Mono headlines, sharp corners,
hairline borders, one sparing signal-blue accent) instead of a generic
SaaS-template look. See `CLAUDE.md` for the reasoning and sources.

## Status

Not yet promoted to `staging` or `main` (both still show the maintenance
page). Placeholders still open: real business/service list still being
built out (see `services.html`), contact form not wired to a backend yet
(tracked as GitHub issue #24).
