# Audette IT

Personal IT help for family and friends — everything from everyday
troubleshooting to real network and Active Directory infrastructure work.
Not a registered business.

**Branch:** `staging` — pre-production. Pushes here build a Cloudflare Worker
preview (meant to sit behind Cloudflare Access) for a final look before
promotion to `main`. Start with `CLAUDE.md`: it's the full handoff for new
sessions.

## Branch flow

```
feature/*  →  dev  →  staging  →  main
```

Promotions so far: the launch (PR #49, 2026-09-23) and the "room guide"
redesign (PR #65, 2026-09-24), both live. Next time: merge `dev` in, review
the preview, then open a release PR to `main` (steps in `CLAUDE.md`).

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
tools/               # Local helpers (not deployed): browser QA, icons,
                     # Artifact preview, issue-tracker sync
ASSETS.md            # Where every image came from
```

Every page also has a Markdown version: `/<page>.md`, the normal URL with
`Accept: text/markdown`, and `llms.txt` / `llms-full.txt`. See the `dev`
README for how to keep them in sync.

No build step. Run it locally exactly as deployed:

```
npx wrangler dev
```
