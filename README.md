# Audette IT

Personal IT help for family and friends — everything from everyday
troubleshooting to real network and Active Directory infrastructure work.
Not a registered business.

**Branch:** `staging` — pre-production. Gets a Cloudflare Pages preview
deployment for final review before promotion to `main`. See `CLAUDE.md` for
full project context.

## Branch flow

```
feature/*  →  dev  →  staging  →  main
```

This branch currently mirrors `main` — nothing has been promoted from `dev`
yet. Check `dev` (or `CLAUDE.md`) for what's actually in progress.

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
