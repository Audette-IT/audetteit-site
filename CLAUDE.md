# Audette IT site — context for Claude

> **Maintenance rule — read this first:** This file is the standing source of truth
> for project state. **Any agent (Claude or otherwise) that makes a meaningful
> change to this repo must update this file in the same session as part of that
> change** — not as a separate later cleanup. That includes: pushing code/content
> to `main`, changing what's live vs. drafted, creating/closing/editing GitHub
> issues, publishing or updating either Artifact linked below, resolving an open
> question in the list below, or changing the design direction. Stale sections
> (dead links, outdated status, resolved "open questions" left unresolved on paper)
> are a bug — fix them in the same commit as the change that caused them, don't
> defer it. If you're an agent reading this and about to make such a change,
> plan the CLAUDE.md update as part of that change up front, not as an afterthought.

## What this actually is

Audette IT is **personal/family IT help, not a licensed or registered business.** The
owner is more advanced than typical "family tech support" — capable of real
infrastructure work (network design, Active Directory/domain setups, self-hosted
services, security hardening) in addition to everyday troubleshooting (wifi, slow
computers, printers, locked accounts, parental controls on kids' devices).

This matters for every future decision: don't reintroduce corporate-MSP framing,
fabricated business details, formal legal boilerplate, or "enterprise" language.
Copy should read as one capable person, not a company.

## Current live state

- **Hosting:** a Cloudflare **Worker with static assets** named `audetteit-site`
  (not classic Pages — migrated off Vercel; Vercel is irrelevant now, don't touch
  that connector). Deploys come from Workers Builds on git push.
- **Live site (`main`):** currently a single maintenance page (`public/index.html`)
  — dark theme, brand blue accent, "We'll be right back" notice. This is
  intentional; the real multi-page redesign is on **`dev`** and was promoted to
  **`staging`** (for a Cloudflare preview), but has **not** been promoted to
  `main` yet — don't confuse branches when checking what's actually live vs. in
  progress.
- **Repo:** `Audette-IT/audetteit-site` on GitHub, default branch `main`.
- **Correction (found this session):** `main` (and `staging`, before the
  promotion) contained `functions/index.js`,
  but that is a *Pages Functions* convention and this project is a
  static-assets-only Worker (the dashboard literally says "Worker that only has
  static assets") — so it has **never run**. Earlier notes/tracker entries that
  called the Markdown-for-Agents stand-in "live" were wrong; it was never
  verified (outbound network to audetteit.com is blocked from these sessions).
  It's fixed properly on `dev` (see "Site architecture" below) and becomes real
  once `dev` is promoted.
- `public/robots.txt` and `public/sitemap.xml` are live.
- Logo/favicons were recropped tight to the actual shield glyph (`public/assets/
  logo-mark.png`, `favicon-32.png`, `favicon-16.png`, `apple-touch-icon.png`,
  `faviconlogo.png`) — no more CSS `scale()`/`transform-origin` cropping hacks.

## GitHub project tracking

- **Milestone:** "Full Site Launch" (#1) —
  https://github.com/Audette-IT/audetteit-site/milestone/1
- The GitHub connector's Issues permission was broken for most of the first session
  (`403 Resource not accessible by integration`) until the user re-authorized it via
  claude.ai connector settings. If issue writes fail again with that error, that's
  the fix — a connector-level permission problem, not something fixable in-session.
- **The user often can't see GitHub issues rendering in their browser** (root cause
  never fully diagnosed — data was always confirmed correct via the API). Because of
  this, the canonical place to read full issue details is the **Issue Tracker
  artifact** (link below), which embeds the exact, verbatim body text pulled
  straight from the GitHub API for every issue — not a paraphrase. When adding or
  editing issues, keep that artifact in sync and keep bodies word-for-word accurate.
- Current issue numbering: originals #4–#20 were recreated as #21–#37 early on (don't
  be confused if old numbers are referenced anywhere) and closed as duplicates. Test
  issue #3 is closed. Treat #21 onward as the real set.
- #41 and #42 (business registration details, formal legal/compliance review) are
  **closed as not planned** — not applicable without a registered business.
- #27 was simplified from "Privacy Policy + Terms of Service" to just a short
  informal privacy note.
- **Build-out on `dev` (commit f113b4b) closed as completed:** #21, #22, #24,
  #26, #27, #28, #29, #33, #35, #36, #40 (each has a closing comment on GitHub
  saying what was done). #37 was already closed. The work is on `dev` only, not
  live: closing an issue means the code is done, not deployed.
- **Still open, and why** (each has a progress comment on GitHub):
  - #23 copy: waiting on the owner's tone/voice review.
  - #25 SEO, #31 headers, #34 icons: done on `dev`, left open only for the
    post-launch check (link-preview debugger, header scanner, favicon checker).
  - #32 CI: workflow exists on `dev` but hasn't run on GitHub yet (only runs
    once it reaches a PR or `main`).
  - #30 analytics: needs the owner to choose; recommended Cloudflare Web
    Analytics (cookieless). Enabling it needs the CSP in both `public/_headers`
    and `worker/index.js` updated in the same change.
  - #38 cookie banner: unnecessary while the site sets no cookies.
  - #39 asset rights: owner must confirm rights to the shield logo, then update
    `ASSETS.md`.
  - #43 Markdown for Agents: Pro-plan feature; the Worker stand-in now covers
    every page, plus `.md` twins and `llms.txt`/`llms-full.txt`.
  - #44 self-hosted help desk: standing reminder.
- The Issue Tracker artifact was re-synced from the API after these changes
  (14 done / 7 in progress / 3 open).

## Design direction (already decided — don't restart from scratch)

First redesign attempt used a generic hero + icon-card-grid + numbered-steps
layout and was correctly called out as "AI slop" (this is literally the most common
default template AI tools produce — see research trail in conversation history).

**Current direction, deliberately different:** an "ops console" visual language,
grounded in the fact that Audette IT actually monitors/self-hosts real
infrastructure:
- Headline type set in **IBM Plex Mono** at real display size (not just for labels)
- Body in **IBM Plex Sans**
- Sharp corners (2–4px radius), hairline borders, no soft `rounded-2xl` + shadow
  treatment
- One signal accent color (blue) used sparingly — status dots, links, one blinking
  cursor — not decorative icon-in-rounded-square badges everywhere. **Light-mode
  signal is `#0074A8`, not the brand `#0090CC`**: `#0090CC` measured 3.22:1 as
  link text and 3.58:1 for white-on-button, failing WCAG AA; `#0074A8` is the
  closest blue that passes everywhere (4.65–5.17:1). Dark mode keeps `#2FD1FF`
  (11:1). Don't "fix" it back.
- Services shown as a dense manifest/spec list with status tags, not icon cards
- Process shown as a connected pipeline diagram (nodes + line), not numbered cards
- A static example "monitoring console" panel as the hero's visual anchor, clearly
  labeled "example only" — not a giant repeated logo or decorative circuit art

Sources consulted for the anti-slop direction (worth re-reading before further
design work): the `funboy322/avoid-ai-design` checklist, Vercel's
`web-interface-guidelines` repo, and the "Anti-Slop Framework" article — search
history has the exact URLs if needed again.

## Homepage redesign — now real files, not just an artifact

The redesign (Home / Services / Contact / Privacy) is implemented for real in
`public/`. It's merged into **`dev`** (built on `feature/homepage-redesign`,
which still exists but is no longer where changes should land — edit `dev`
directly now). Promoted to `staging`; not yet to `main`.

The Claude Artifact versions (below) were the design/review draft that this was
built from — the repo files are now the source of truth going forward, not the
artifacts. Keep the artifacts around for reference/history, but **edit the real
files on `dev` for any further changes**, not the artifacts.

- **Homepage redesign artifact** (original draft, now superseded by the real
  files above) — https://claude.ai/artifact/Vj8Pvwbi5uY8SZEhKSFpxq
  - Services split into two honest tiers: **Everyday help** (wifi, slow computers,
    printers, accounts, parental controls) and **Infrastructure & advanced**
    (network design, Active Directory/domains, self-hosted services, security
    hardening) — same split carried into the real files.
  - Contact page shows the real email (`michael.audette@audetteit.com`) only —
    phone, city, and the footer "run by ___" name were deliberately removed,
    not left as placeholders. Re-add only if the user actually asks.
  - The artifact's contact form was a non-functional mock; the real one on `dev`
    works (see "Site architecture").
- **Issue tracker artifact** (still the canonical live source — this one is NOT
  superseded, keep using it) — https://claude.ai/artifact/MXvC5hYXLAz4ged3ufUYQy
  - Every issue's full body is the exact GitHub text (verified byte-for-byte),
    grouped by area, expandable, with status pills strictly tied to actual
    open/closed GitHub state (never invent a "Done" status without actually
    closing the issue).

## Site architecture (on `dev`)

- **`wrangler.jsonc`** — explicit Worker config (previously there was none, and
  Cloudflare auto-detected a static-assets-only setup). `assets.directory` is
  `./public` so repo files (CLAUDE.md, README, etc.) are never served;
  `run_worker_first: ["/"]` means only the homepage runs through code.
- **Markdown for every page (user requirement: "in all deployments we need
  markdown for all pages then detailed docs and the sitemap and index").**
  Each page has a hand-written twin in `public/` (`index.md`, `services.md`,
  `contact.md`, `privacy.md`), served three ways: directly at `/<page>.md`,
  via `Accept: text/markdown` on the normal URL (Worker), and bundled in
  `public/llms-full.txt` (the "detailed docs", generated by
  `scripts/build-llms.py`, never hand-edited). `public/llms.txt` is the index.
  HTML pages link their twin with `<link rel="alternate" type="text/markdown">`;
  Markdown responses send `Link: rel="canonical"` back to the HTML so search
  engines don't treat them as duplicates. **When page copy changes, update the
  `.md` twin in the same change and rerun `build-llms.py`** — CI fails if
  `llms-full.txt` is stale or any page lacks its twin/route/sitemap/llms entry.
- **`worker/index.js`** — runs for the four page routes only
  (`run_worker_first` in `wrangler.jsonc` must match `MARKDOWN_PAGES`):
  returns the page's `.md` twin when `Accept: text/markdown`, otherwise the
  static HTML. Sets the security headers itself and
  `Vary: Accept`, because `public/_headers` is **not** applied to responses that
  pass through Worker code. Its `SECURITY_HEADERS` must stay in sync with the
  `/*` block in `public/_headers`.
- **`public/_headers`** — CSP (`script-src 'self'`, no inline scripts allowed),
  nosniff, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy, HSTS
  (deliberately *without* `includeSubDomains`, so a future HTTP-only self-hosted
  subdomain isn't broken). `/assets/*` cached 1 day (not fingerprinted).
- **Clean URLs.** Workers serves `/services`, `/contact`, `/privacy`; the
  `.html` forms 307-redirect. All links, canonicals, `og:url`s, and the sitemap
  use clean URLs — don't reintroduce `.html` links.
- **`public/js/site.js`** — all page JS (mobile menu toggle, contact form),
  external because the CSP forbids inline scripts. Lives in `/js/`, not
  `/assets/`, so it isn't caught by the 1-day asset cache.
- **Contact form** — no backend. Validates name/email/message/consent, has a
  honeypot field, then opens the visitor's email app via `mailto:` pre-filled to
  `michael.audette@audetteit.com`. Honest about that on the page. A real
  server-side send would need an email API + secret (not available here).
- **`public/privacy.html`** — short plain-language note (#27). States there's no
  analytics and no cookies — **if analytics (#30) or any cookie-setting embed is
  ever added, update this page first.** Also discloses Google Fonts + Cloudflare.
- **`public/site.webmanifest`** — icons for home-screen shortcuts (#34).
- **SEO** — canonical, Open Graph, Twitter card on every page; `WebSite` JSON-LD
  on the homepage only. Deliberately no `Person`/`Organization` schema — the
  user removed their name from the site, and it's not a registered business.
- **Accessibility** — skip link, visible `:focus-visible` rings, `aria-hidden`
  on decorative elements, working mobile menu with `aria-expanded` (before this,
  the hamburger had no JS and mobile visitors couldn't navigate at all).
- **CI** — `.github/workflows/ci.yml`: htmlhint, `scripts/check-links.py`
  (internal links + Markdown coverage), `build-llms.py --check`,
  manifest/sitemap validation, `wrangler deploy
  --dry-run`. All pass locally.
- **`ASSETS.md`** — asset provenance (#39). Logo rights are still **unconfirmed**
  — needs the user.
- **Verified locally** with `npx wrangler dev` + Playwright/Chromium: 4 pages ×
  phone/desktop × light/dark, zero horizontal overflow, no CSP violations,
  mobile menu and form validation exercised end to end.

## Branch structure

Feature branch(es) &rarr; `dev` &rarr; `staging` &rarr; `main`, matching the
promotion flow the user specified:
- **`main`** — production, protected. Should be locked down with GitHub branch
  protection (require PRs, no direct pushes) — **not yet configured**: the GitHub
  App lacks the "Administration" permission needed to set this via API (same
  `403 Resource not accessible by integration` pattern as the Issues permission
  originally did). Either grant that permission the same way Issues was granted,
  or the user sets it manually in GitHub Settings &rarr; Branches. Recommended
  rule: require PR before merging, require status checks once CI exists (#32),
  don't allow bypassing even for admins.
- **`staging`** — has its own README. **`dev` was merged in** (the full site),
  so a staging preview now shows the real redesign rather than the maintenance
  page. The site is deployed as
  a Cloudflare **Worker** named `audetteit-site` (account
  `b7a46df8571aa32900c3155b464416ab`, worker ID
  `c8969d22263a484bae64aa2436af8e93`) — not classic Pages — so it uses Workers
  Builds preview behavior, not Pages preview deployments. Every push to a
  non-production branch auto-builds a Preview by default once Preview Builds
  are enabled; no per-branch config needed as long as `main` stays the
  Production branch. **Two manual dashboard steps still needed** (no tool in
  this session can touch Worker/Pages project or Access settings —
  Cloudflare tools here are scoped to D1/R2/KV/Workers-code/Hyperdrive only):
  1. **Workers & Pages → `audetteit-site` → Settings → Build → Branch
     control**: confirm Production branch = `main`, Enable Preview Builds is
     on. Optionally restrict which branches get previews to just `staging` if
     `dev`/feature branches firing previews too is unwanted.
  2. **Lock previews behind Cloudflare Access**: same Worker → **Access** tab
     → Protect this Worker behind Access → scope **Previews only** (not "All
     traffic", which would also lock production) → set an authentication
     policy → Apply Access. API equivalent (needs a real
     `CLOUDFLARE_API_TOKEN`, not available in this session):
     ```
     curl "https://api.cloudflare.com/client/v4/accounts/b7a46df8571aa32900c3155b464416ab/access/apps" \
       --request POST \
       --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
       --json '{
         "type": "self_hosted",
         "name": "Access for audetteit-site previews",
         "destinations": [{ "type": "preview_worker", "worker_id": "c8969d22263a484bae64aa2436af8e93" }],
         "policies": [{ "decision": "allow", "include": [{ "email": { "email": "michael.audette@audetteit.com" } }] }]
       }'
     ```
- **`dev`** — active development branch. Has diverged from `main`: carries the
  merged-in homepage redesign (real `index.html`/`services.html`/`contact.html`,
  not just the maintenance page). Promoted to `staging`; not yet to `main`.
- **Feature branches** — branch off `dev`, merge back into `dev`.
- **Local dev hosting** — `npx wrangler dev` from the repo root runs the real
  Worker + assets exactly as deployed (the old `wrangler pages dev` advice was
  wrong for a Worker). No build step. Doing this locally instead of pushing
  feature branches avoids burning Cloudflare build minutes.

**Cloudflare project settings still need manual verification in the dashboard**
(none of this is scriptable from here): confirm **Production branch** is `main`,
confirm `staging` actually produces a preview deployment once something is
pushed to it, and decide on a custom domain alias for staging if wanted.

## Open questions for the user (don't guess these)

- Whether/when to build the self-hosted help desk (issue #44 — standing reminder,
  no deadline) to replace the third-party Zammad widget at `help.audetteit.net`.
- Full list of services beyond what's drafted — more will likely get added as
  they're built out (noted as a placeholder on the Services page).
- Tone/voice sign-off on the rewritten copy (#23).
- Whether to add analytics, and which tool (#30).
- Confirming rights to the shield logo (#39).
- When to promote `staging` → `main` (only with explicit approval) — after
  reviewing the staging preview.
- **GitHub Pages is publishing `staging`.** Its `pages-build-deployment`
  workflow ran on `staging` on 2026-09-23 (triggered by the `audetteit`
  account), so the Pages source appears to have been switched to `staging`.
  That publishes staging publicly on github.io, outside Cloudflare Access.
  Recommended: turn GitHub Pages off in Settings → Pages. The site is served by
  the Cloudflare Worker, not GitHub Pages.

## Working conventions established this session

- **Never push to `main` without asking the user first — no exceptions.** This
  supersedes the earlier "push directly to main" convention from this same
  session; that convention is retired. Commit locally / stage the change, then
  explicitly ask before running `git push origin ... main`. This applies to
  every kind of change (content, assets, config, docs) — none of it is exempt
  just because it seems small or low-risk.
- Draft anything content/design-significant (new page layouts, copy) as a Claude
  Artifact for review first — don't push an unreviewed redesign over the live
  maintenance page. Republishing an Artifact is not a `main` push and doesn't
  need to wait on approval — it's a separate, private preview channel.
- Also push to `claude/stoic-gates-w5906b` alongside `main` once approved, to
  keep it in sync (harness convention from the original task setup).
