# Audette IT

Personal IT help for family and friends — everything from everyday
troubleshooting to real network and Active Directory infrastructure work.
Not a registered business.

**Branch:** `main` — production. Live at https://audetteit.com, deployed by
Cloudflare Workers Builds on every push. Changes arrive by pull request from
`staging`. See `CLAUDE.md` for full project context.

## Branch flow

```
feature/*  →  dev  →  staging  →  main
```

## Structure

```
/public              # everything served to visitors
  index.html         # Home
  services.html      # -> /services
  contact.html       # -> /contact (form opens your email app)
  privacy.html       # -> /privacy
  index.md, services.md, contact.md, privacy.md  # Markdown twin of each page
  llms.txt           # Index of the Markdown pages for AI agents
  llms-full.txt      # All pages in one file (generated, don't hand-edit)
  _headers           # Security + cache headers for static files
  favicon.ico, site.webmanifest, robots.txt, sitemap.xml
  /js/site.js        # Mobile menu + contact form behavior
  /assets            # Logo, favicons
/worker/index.js     # Page routes only: Markdown for Accept: text/markdown
wrangler.jsonc       # Cloudflare Worker config
scripts/check-links.py  # Link + Markdown-coverage checker (run in CI)
scripts/build-llms.py   # Regenerates public/llms-full.txt
ASSETS.md            # Where every image came from
```

No build step. Run it locally exactly as deployed:

```
npx wrangler dev
```
