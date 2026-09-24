# Working inside the audetteit.com repo

These rules only apply to the `Audette-IT/audetteit-site` repo. Its `CLAUDE.md`
is the authority and has more detail. Read it before changing anything there.

## Adding a page (7 places, enforced by `scripts/check-links.py`)

1. `public/<page>.html`: start from `assets/templates/site-page.html`
2. `public/<page>.md`: the Markdown twin, with the same copy in plain Markdown
3. `MARKDOWN_PAGES` in `worker/index.js`
4. `run_worker_first` in `wrangler.jsonc`
5. `public/sitemap.xml`
6. `public/llms.txt`
7. a block in `public/_headers` for `/<page>.md` (`Content-Type: text/markdown`
   plus the canonical `Link`)

Also add it to `PAGES` in `scripts/build-llms.py`, then run
`python3 scripts/build-llms.py` to regenerate `public/llms-full.txt`. Add the
page to the header nav and footer if it belongs there.

**Whenever copy changes, update the `.md` twin in the same change.**

## The `<head>` block (copy exactly)

Order matters:
1. `<script src="/js/consent.js"></script>` comes first.
2. Google's GTM snippet for `GTM-TKBJX8F5`, **byte for byte**. Its SHA-256
   hash is in the CSP. Changing one character (even whitespace) makes browsers
   block it.
3. Meta tags, the favicon links (`/favicon.ico` first), the canonical (clean
   URL), `rel="alternate" type="text/markdown"`, the OG/Twitter tags (image
   `logo-mark.png`), the manifest, `theme-color #0074A8`, Google Fonts,
   `site.css`.
4. `consent.css`.
5. After `<body>`: the GTM `<noscript>` iframe, then the skip link.

`assets/templates/site-page.html` has all of this ready to fill in.

## Other rules

- **No inline scripts.** The CSP is `script-src 'self'` plus three hashes. Page
  JS goes in `public/js/site.js` (or another external file). Inline `style=""`
  is allowed (the room pins use it), but prefer classes.
- **Clean URLs** everywhere: `/services`, never `/services.html` (the `.html`
  forms redirect).
- **Only `public/` is served.**
- **Any new tracking, cookie or third-party embed** needs the privacy page (and
  its twin) updated in the same change, and its hosts added to the CSP in
  *both* `public/_headers` and `worker/index.js` (they must stay identical).
- **Don't bring back** the fake status block, the employee portal button or the
  Zammad chat widget.
- **Before pushing:** run the checks in `CLAUDE.md` section 8.2. Before a copy
  or design change goes live, run the browser QA (`tools/site-qa.js`) and show
  the owner a preview artifact (`tools/build-preview.py`).
- **Never push or merge to `main` without the owner's OK.**
