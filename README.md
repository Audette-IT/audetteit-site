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

- `main` — production (the Cloudflare Worker deploys from here). Currently a
  maintenance page while the full rewrite is in progress.
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
  _headers           # Security + cache headers for static files
  site.webmanifest, robots.txt, sitemap.xml
  /js/site.js        # Mobile menu + contact form behavior
  /assets            # Logo, favicons
/worker/index.js     # Handles "/" only: Markdown for Accept: text/markdown
wrangler.jsonc       # Cloudflare Worker config
scripts/check-links.py  # Internal link checker (run in CI)
ASSETS.md            # Where every image came from
```

No build step. Run it locally exactly as deployed:

```
npx wrangler dev
```

## Design direction

An "ops console" visual language (IBM Plex Mono headlines, sharp corners,
hairline borders, one sparing signal-blue accent) instead of a generic
SaaS-template look. See `CLAUDE.md` for the reasoning and sources.

## Status

Not yet promoted to `staging` or `main` (both still show the maintenance
page). Still open: the service list will grow as more gets built out, and
the logo's rights need confirming (`ASSETS.md`).
