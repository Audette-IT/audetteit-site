# Audette IT

Personal IT help for family and friends — everything from everyday
troubleshooting to real network and Active Directory infrastructure work.
Not a registered business.

**Branch:** `feature/homepage-redesign` — active work-in-progress rebuild of the
site (replaces the old AI-generated placeholder page). See `CLAUDE.md` for full
project context, current status, and open questions.

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

This branch is not yet merged to `main` (still the maintenance page — see
`CLAUDE.md` for the full branch/deploy flow: `feature/*` → `dev` → `staging` →
`main`). Placeholders still open: real business/service list still being
built out (see `services.html`), contact form not wired to a backend yet
(tracked as GitHub issue #24).
