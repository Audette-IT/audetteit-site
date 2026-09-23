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

This branch has the full site promoted from `dev` (Home, Services, Contact,
Privacy). `main` still shows the maintenance page until this is approved and
promoted.

## Structure

```
/public              # everything served to visitors
  index.html         # Home
  services.html      # -> /services
  contact.html       # -> /contact (form opens your email app)
  privacy.html       # -> /privacy
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
