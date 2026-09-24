# tools/

Local helpers for working on audetteit.com. Nothing in this folder is deployed:
the Worker only serves `public/`. Output goes to `tools/qa-out/`, which is
git-ignored.

| Tool | What it does | Run it |
|---|---|---|
| `site-qa.js` | Browser QA on every page in `wrangler.jsonc` → `run_worker_first`: horizontal overflow, CSP and JS errors, axe accessibility, phone + desktop × light + dark, plus the cookie banner, mobile menu, room picker, form validation and FAQ. Saves screenshots. Exits 1 on any failure. | Start the Worker from the repo root with `npx wrangler@4 dev --port 8795 --ip 127.0.0.1`, then `cd tools && npm install && node site-qa.js` |
| `render-icons.js` | Re-renders every favicon, `logo-mark.png`, the Apple touch icon and `public/favicon.ico` from `public/assets/logo.svg`, plus large logo PNGs for the owner in `qa-out/logo/`. | `cd tools && npm install && node render-icons.js` |
| `build-preview.py` | Bundles all pages into one HTML file for a private Claude Artifact preview (no GTM, no cookie banner). | `python3 tools/build-preview.py`, then publish `tools/qa-out/preview.html` with the Artifact tool |
| `sync-tracker.py` | Refreshes the Issue Tracker artifact's data from GitHub (exact issue text and comments). | Read the tracker artifact to get its file, run `python3 tools/sync-tracker.py <file>` (needs `GITHUB_TOKEN`), then republish to the same URL |

## Notes

- **Browser:** Playwright is pinned to 1.56.1 to match the Chromium build
  that Claude Code cloud sessions pre-install (`/opt/pw-browsers/chromium-1194`).
  Don't run `playwright install`. If a different Chromium is needed, set
  `CHROMIUM_PATH` to its executable.
- **Fonts:** Google Fonts are unreachable from cloud sessions, so screenshots
  there use fallback fonts. Real fonts only show on the Cloudflare preview or
  the live site.
- The repo's own checks (`scripts/check-links.py`, `scripts/build-llms.py
  --check`, htmlhint and `wrangler deploy --dry-run`) are listed in `CLAUDE.md`
  and `.github/workflows/ci.yml`. Run them too, before any push.
