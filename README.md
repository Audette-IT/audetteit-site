# Audette IT

Personal IT help for family and friends — everything from everyday
troubleshooting to real network and Active Directory infrastructure work.
Not a registered business.

**Branch:** `staging` — pre-production. Pushes here build a Cloudflare Worker
preview (meant to sit behind Cloudflare Access) for a final look before
promotion to `main`. See `CLAUDE.md` for full project context.

## Branch flow

```
feature/*  →  dev  →  staging  →  main
```

This branch was promoted to `main` on 2026-09-23 (PR #49). It now also has
the "room guide" redesign from `dev` (#60/#61, staged 2026-09-24), which isn't
live yet. Next: review the preview, then open a PR to `main`.

## Structure

```
/public              # everything served to visitors
  index.html         # Home (floor-plan figure)
  services.html      # -> /services
  how-it-works.html  # -> /how-it-works (steps + FAQ)
  about.html         # -> /about
  contact.html       # -> /contact (form opens your email app)
  privacy.html       # -> /privacy
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
ASSETS.md            # Where every image came from
```

Every page also has a Markdown version: `/<page>.md`, the normal URL with
`Accept: text/markdown`, and `llms.txt` / `llms-full.txt`. See the `dev`
README for how to keep them in sync.

No build step. Run it locally exactly as deployed:

```
npx wrangler dev
```
