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
- **Live site (`main`): the full redesign went live on 2026-09-23** — the
  maintenance page is gone. Launched at the user's request ("we need everything
  from stage to main and the site needs to go live no maintenance") by
  promoting `staging` → `main` through PR #49
  (https://github.com/Audette-IT/audetteit-site/pull/49, merge commit
  `915d16e`; branch `launch` = `staging` + `main` merged in with `-s ours` +
  a production README). `dev` and `staging` were then synced with `main`,
  each keeping its own README. Live pages:
  Home, Services, Contact, Privacy, with Markdown twins, `llms.txt`,
  `llms-full.txt`, security headers, sitemap, and `favicon.ico`. A second
  release the same day added Google Tag Manager behind the cookie consent
  banner (#30/#38) and a `www` → apex redirect. `www.audetteit.com` works
  (Cloudflare Redirect Rule + proxied DNS record; see "Site architecture"). Not verified
  from here: outbound requests to audetteit.com are blocked in these sessions,
  so the owner should load the site once and check the Cloudflare production
  build.
- **Repo:** `Audette-IT/audetteit-site` on GitHub, default branch `main`.
- **Correction (found this session):** `main` (and `staging`, before the
  promotion) contained `functions/index.js`,
  but that is a *Pages Functions* convention and this project is a
  static-assets-only Worker (the dashboard literally says "Worker that only has
  static assets") — so it has **never run**. Earlier notes/tracker entries that
  called the Markdown-for-Agents stand-in "live" were wrong; it was never
  verified (outbound network to audetteit.com is blocked from these sessions).
  `functions/` was removed from `main` on 2026-09-23 and replaced with a real
  Worker (`wrangler.jsonc` + `worker/index.js`).
- `public/robots.txt`, `public/sitemap.xml`, `llms.txt`, and `llms-full.txt`
  are live.
- Logo/favicons were recropped tight to the actual shield glyph (`public/assets/
  logo-mark.png`, `favicon-32.png`, `favicon-16.png`, `apple-touch-icon.png`,
  `faviconlogo.png`) — no more CSS `scale()`/`transform-origin` cropping hacks.

- **Next release, on `dev` (2026-09-24), not live:** the "room guide"
  redesign for #60/#61, with six pages, a new logo and new favicons. Promote
  `dev` → `staging` → `main` only after asking the owner.

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
  saying what was done). #37 was already closed. All of it went live with the
  2026-09-23 launch.
- **Closed 2026-09-23 after live verification** (via Firecrawl, since
  audetteit.com itself is unreachable from these sessions): #31 (securityheaders.com
  grade **A+**), #34 (favicon/manifest served), #30 (GTM + GA4 + Clarity via
  GTM), #38 (consent banner).
- **Still open, and why** (each has a progress comment on GitHub):
  - #23 copy: waiting on the owner's tone/voice review.
  - #25 SEO: everything is served and was confirmed live. The owner will verify
    with Search Console and a link-preview debugger in a few days (indexing
    lag), then close it. Don't close it before that.
  - #32 CI: the workflow is registered and active, but GitHub Actions has
    **never run it**. After the owner enabled Actions in repo settings, a push
    still produced no run, and a direct `workflow_dispatch` via the API
    returned **"Actions has been disabled for this user."** That's an
    account/org-level block (billing/payment issue or GitHub restricting a new
    account), not the repo toggle. The owner needs to check the Audette-IT org
    Actions policy and billing, or contact GitHub Support.
  - #39 asset rights: owner must confirm rights to the shield logo, then update
    `ASSETS.md`.
  - #43 Markdown for Agents: Pro-plan feature; the Worker stand-in covers
    every page, plus `.md` twins and `llms.txt`/`llms-full.txt`.
  - #44 self-hosted help desk: standing reminder.
  - **#60** (owner-created 2026-09-24, no milestone): fix spelling, grammar
    and tone across site copy, casual and plain-language. Overlaps #23.
    **Done on `dev` (2026-09-24), not live yet:** all copy was rewritten in
    the "I" voice as part of the #61 redesign (see "Design direction").
  - **#61** (owner-created 2026-09-24, no milestone): make the design more
    professional and strip remaining "AI slop" patterns, suggesting the
    `/grill-me` and `/impeccable` skills. The owner's comment adds: redesign
    the logo, update the favicons, and hand the new logo files to the owner.
    **Done on `dev` (2026-09-24), not live yet:** the "room guide" redesign,
    six pages, new logo and favicons, logo files handed to the owner in
    chat. Close #60/#61 once it's promoted to `main` and the owner signs off.
- **Comment authorship:** the GitHub connector posts as the owner's account
  (`mjaudettejr`), so Claude's comments and the owner's look the same on
  GitHub. Claude's comments end with the "Generated by Claude Code" footer;
  anything without it is the owner's.
- The Issue Tracker artifact was last re-synced from the API on 2026-09-24
  02:05 UTC: 26 issues (#21–#44, #60, #61), 18 done / 5 in progress / 3 open.
  Updated 02:56 UTC: #60/#61 are now "in progress" and show the new
  progress comments (18 done / 7 in progress / 1 open).
  It now shows **every comment verbatim** under each issue, labeled "You"
  or "Claude" by that footer. #60/#61 sit in a "Post-launch polish" group.
  Source: scratchpad `tracker.html`, rebuilt by `rebuild_tracker.py` from
  per-issue API fetches. The `/issues` list endpoint only returns 3 items for
  this token, so fetch issues one by one.

## Design direction (already decided — don't restart from scratch)

**Current direction: the "room guide" (draft D), approved by the owner on
2026-09-24** ("i really like it especially the logo i just think we should
have separate pages tho"). Built on `dev` as six separate pages. It replaced
the "ops console" look, which the owner found not professional enough (#61).

How we got here (via `/grill-me` and four drafts):
- Brief: warm and personal, competent and precise, modern but not flashy.
  "I" voice. Keep the blue. Light and dark mode.
- Draft A ("floor plan") was built in full and rejected as "too modern".
  It's parked on branch `wip/redesign-a-floor-plan`, not pushed further.
  Draft C was also too modern, and the owner dislikes a chat/text-thread
  motif. The owner liked A (the floor plan) and B ("quick start" guide
  feel). D combines them.
- Draft artifacts (reference only, the repo is the source of truth): A
  https://claude.ai/artifact/VGNK2aqvB6sSYLTPXQvRSw, B
  https://claude.ai/artifact/AuSs6Fp4zf374FJ8dufRyv, C
  https://claude.ai/artifact/MLct3zL3WuK81UTvc5wL8Y, **D (approved)**
  https://claude.ai/artifact/7cKQaJZ3nnvpAsfyn3FqhC.
- **Built-site preview artifact** (all six `dev` pages in one page, the menu
  switches between them; GTM/consent stripped, since it's a preview):
  https://claude.ai/artifact/A279VNAj3QAxTAv9axKF2x. It's a snapshot of
  commit `4f66c61`; rebuild it from `public/` if the pages change before
  review.

What D is (all in `public/css/site.css`):
- **Type:** Red Hat Display (headings, weight 900 for big ones) and Red Hat
  Text (body), from Google Fonts.
- **Look of a printed quick-start guide:** heavy 3px black rules between
  sections, white paper, thin hairlines inside lists, pill buttons. The
  "How it works" band is a solid blue field.
- **Color:** ink `#1A1E23`, site blue `#0074A8` (light) for links and the
  blue field, yellow `#FFD23F` highlights (`h1 mark`, room letters, FAQ
  +/−). **Light-mode blue stays `#0074A8`, not the brand `#0090CC`**:
  `#0090CC` fails WCAG AA as link text (3.22:1) and white-on-button
  (3.58:1). Don't "fix" it back. Dark mode has its own tokens.
- **Homepage figure:** "Fig. 1", a black-line floor plan of a house with
  yellow lettered room pins A–F (living room, kitchen, office, kids' room,
  hall closet/router, garage). Clicking a letter shows what I help with in
  that room (`public/js/site.js`, `rooms` object). It's labeled
  "Illustration".
- **Services** as two plain tables/lists ("Everyday" and "Bigger jobs"), not
  icon cards. "Good to know" notes: where, devices, cost.
- **Logo:** `public/assets/logo.svg`, a redraw that keeps the original's
  split blue/navy shield, white "A" and circuit traces, plus a yellow wifi
  arc. All favicons are rendered from it (see `ASSETS.md`).

Facts the owner confirmed for copy (don't invent more): first name Michael
only; in person around Las Vegas or remote from anywhere (don't name the
remote tool); paid, with a quote before any work; computers and laptops get
hardware work too; phones and tablets get digital help only (setup,
settings, apps, parental controls), no physical repairs; TVs and smart home
are in scope.

Anti-slop sources worth re-reading before more design work: the
`funboy322/avoid-ai-design` checklist, Vercel's `web-interface-guidelines`,
and the "Anti-Slop Framework" article.

## Homepage redesign — now real files, not just an artifact

> **Superseded on `dev` (2026-09-24):** this section describes the first
> (ops-console) redesign that is live on `main`. `dev` now has the "room
> guide" redesign with six pages (Home, Services, How it works, About,
> Contact, Privacy); see "Design direction". Edit the HTML files directly,
> since they are the source of truth now (the drafts were generated by a
> throwaway script).

The redesign (Home / Services / Contact / Privacy) is implemented for real in
`public/`. It's merged into **`dev`** (built on `feature/homepage-redesign`,
which still exists but is no longer where changes should land — edit `dev`
directly now). Live on `main` since the 2026-09-23 launch.

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

## Site architecture (live on `main`)

- **`wrangler.jsonc`** — explicit Worker config (previously there was none, and
  Cloudflare auto-detected a static-assets-only setup). `assets.directory` is
  `./public` so repo files (CLAUDE.md, README, etc.) are never served;
  `run_worker_first` lists the page routes (on `dev`: `/`, `/services`,
  `/how-it-works`, `/about`, `/contact`, `/privacy`), so only those run
  through code.
- **Markdown for every page (user requirement: "in all deployments we need
  markdown for all pages then detailed docs and the sitemap and index").**
  Each page has a hand-written twin in `public/` (`index.md`, `services.md`,
  `contact.md`, `privacy.md`, plus `how-it-works.md` and `about.md` on
  `dev`), served three ways: directly at `/<page>.md`,
  via `Accept: text/markdown` on the normal URL (Worker), and bundled in
  `public/llms-full.txt` (the "detailed docs", generated by
  `scripts/build-llms.py`, never hand-edited). `public/llms.txt` is the index.
  HTML pages link their twin with `<link rel="alternate" type="text/markdown">`;
  Markdown responses send `Link: rel="canonical"` back to the HTML so search
  engines don't treat them as duplicates. **When page copy changes, update the
  `.md` twin in the same change and rerun `build-llms.py`** — CI fails if
  `llms-full.txt` is stale or any page lacks its twin/route/sitemap/llms entry.
- **`worker/index.js`** — runs for the page routes only
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
- **`www` → apex: working since 2026-09-23 (confirmed by the owner).** It's
  handled at Cloudflare's edge, not in the repo:
  - **Redirect Rule** (zone `audetteit.com` → Rules → Redirect Rules,
    "Redirect from WWW to root" template), named `Redirect www to root`:
    wildcard `https://www.audetteit.com/*` → `https://audetteit.com/${1}`,
    301, preserve query string. It covers every path, static assets included.
  - **DNS:** `A www 192.0.2.1`, **proxied** (orange cloud). That's a
    discard placeholder: the rule answers at the edge, so the IP is never
    contacted. It must stay proxied, or `www` stops working.
  - `worker/index.js` also 301s `www.audetteit.com` to the apex, but only as
    a backup. With the rule in place, `www` requests never reach the Worker.
  - The domains were deliberately **not** put under `routes` in
    `wrangler.jsonc`: wrangler replaces the Worker's whole custom-domain set
    on deploy, which could detach `audetteit.com`. If domains ever move into
    `wrangler.jsonc`, list the apex **and** `www`, and remove the `www` DNS
    record first (a custom domain can't be created over an existing record).
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
- **`public/privacy.html`** — short plain-language note (#27). Discloses the
  opt-in Google Analytics/Tag Manager setup, its `_ga` cookies, the
  localStorage consent record, Google Fonts, and Cloudflare. **Any new
  tracking or cookie-setting embed must be added here (and to `privacy.md`)
  in the same change.**
- **Google Tag Manager + cookie consent (#30, #38)** — Consent Mode
  **"advanced"** (owner's choice, 2026-09-23, so Google's "Test your website"
  checker and Tag Assistant detect the tag). Every page's `<head>` starts
  with `<script src="/js/consent.js">`, which sets all Consent Mode signals to
  `denied` (and to `analytics_storage: granted` if the visitor accepted
  before), then Google's **exact** GTM snippet for `GTM-TKBJX8F5`. The
  `<noscript>` GTM iframe comes right after `<body>`. GTM loads for everyone,
  but GA sets no cookies until the visitor clicks Accept. Before that it only
  sends cookieless pings, and `privacy.html`/`privacy.md` say so. The banner is
  built by `consent.js` and styled by `public/css/consent.css`. The choice
  lives in localStorage key `audetteit-consent`, and the footer "cookie
  settings" button (`data-cookie-settings`) reopens the banner. Decline pushes
  `analytics_storage: denied` and clears `_ga*` cookies. GA4 itself is
  configured inside the GTM container, not in the repo.
  **Microsoft Clarity** (project `ymzkuz40tm`) is also loaded **by GTM**, as a
  tag in the container, not by a snippet in the repo. The owner explicitly
  cancelled the direct inline snippet. `consent.js` defines the `window.clarity`
  queue and sends `clarity('consentv2', {ad_Storage:'denied',
  analytics_Storage: <choice>})` at startup and again on window `load` (in
  case the GTM template replaced the queue), plus on every banner click.
  Decline also clears `_clck`/`_clsk`. For this to hold outside the EEA, the
  Clarity project's **Settings → Setup → Cookies** must be **off** (consent
  mode). The banner and privacy page name both GA and Clarity.
  **CSP:** the inline snippet is allowed by its hash
  (`'sha256-UyV5Au11KVQu7NJLru7rrbyHqm2Q7abUOBcVvlNvgFo='`), not
  `'unsafe-inline'`, plus `https://*.googletagmanager.com` (script/img/connect),
  `https://*.google-analytics.com` and `https://*.analytics.google.com`
  (img/connect), `https://*.clarity.ms` (script/img/connect) and
  `https://c.bing.com` (img/connect) for Clarity, and
  `frame-src https://www.googletagmanager.com` (noscript).
  All of this is in **both** `public/_headers` and `worker/index.js`. **If the
  snippet changes by even one character, the hash changes.**
  `scripts/check-links.py` (CI) fails when any inline script's hash is missing
  from either CSP. A GTM "Custom HTML" tag would be blocked by the CSP, so
  stick to built-in tag types.
- **Cloudflare Google Tag Gateway: ON (owner wants it), allowed by CSP
  hashes (PR #57, live 2026-09-23 21:32 UTC).** Cloudflare injects two fixed inline scripts at the very top of
  every page's `<head>`, *after* the Worker runs (the Worker can't remove or
  reorder them, and there's no per-path exclusion): one pushes `GTM-TKBJX8F5`
  into `window.google_tags_first_party`; the other pushes
  `set developer_id.dY2E1Nz` and async-loads GTM first-party from `/epez/`
  (same origin, so `'self'` covers it and its collection calls). Their CSP
  hashes are `'sha256-L7128Ucn8Uz1AVKkbXZh64Cp6i4V2MW7KQbAv84MBq0='` and
  `'sha256-l6WiYX1ug7tDF6hFBAEd08DFrf7YxBn+kEWIYJDSnLI='`, in both CSPs. They
  were computed from the live injected text (2026-09-23) and verified by
  simulating the injection in Chromium. **If Cloudflare ever changes the
  injected text** (new measurement path, tag ID, or developer ID), those
  hashes stop matching and browsers silently block the gateway. Re-scrape the
  live page (Firecrawl `rawHtml`, `maxAge: 0`) and recompute them.
  `check-links.py` can't catch this because the scripts aren't in the repo.
  **Consent ordering:** the gateway's loader runs before `consent.js`, so GTM
  could start before the site's "denied" defaults. That's solved **inside the
  GTM container** (published by the owner 2026-09-23, version "Consent
  defaults in GTM"), so it no longer matters which script loads first. See
  "GTM container configuration" below. Keep `consent.js` either way: it
  runs the banner, the Accept/Decline updates, and Clarity's consent API.
- **GTM container configuration (`GTM-TKBJX8F5`, lives in Google Tag
  Manager, not the repo):**
  - **Template:** "Consent Mode (Google + Microsoft tags)" by
    gtm-templates-simo-ahava (Community Template Gallery). Also
    "Microsoft Clarity - Official".
  - **Variable `LS - audetteit-consent`** (Custom JavaScript): returns
    `localStorage.getItem('audetteit-consent')` (null if storage is blocked).
    **If the localStorage key in `consent.js` is ever renamed, update this
    variable too.**
  - **Trigger `Consent Init - accepted before`:** Consent Initialization,
    fires when `LS - audetteit-consent` equals `granted`.
  - **Tag `Consent - Default`** (Consent Mode template, command Default):
    `ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`
    = denied, "wait for update" 500 ms, Microsoft Consent Mode off. Trigger:
    **Consent Initialization - All Pages**.
  - **Tag `Consent - Update (accepted before)`** (command Update):
    `analytics_storage` = granted only, Microsoft Consent Mode off. Trigger:
    `Consent Init - accepted before`. **Never attach it to "Consent
    Initialization - All Pages"**: that would grant analytics to every
    visitor, including people who declined.
  - **Tag `Audette IT Website`** (Google tag / GA4) on Initialization - All
    Pages, relying on built-in consent checks. **Tag `Microsoft Clarity -
    Official`** on All Pages, with no extra consent requirement, because
    Clarity gets the choice from `consent.js` via `consentv2`. Microsoft
    Consent Mode stays off in the template so Clarity doesn't get two sets of
    signals.
- **`public/site.webmanifest`** — icons for home-screen shortcuts (#34).
- **`public/favicon.ico`** — at the site root because Google Search (and
  browsers that ignore `<link>` tags) request `/favicon.ico` directly. Holds
  16/32/48px generated from `logo-mark.png`; Google needs 48px or a multiple of
  it. Linked first on every page with `sizes="48x48"`.
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
- **`staging`** — has its own README. Promoted to `main` on 2026-09-23
  (launch). Next promotion: merge `dev` in, review the preview, then PR to
  `main`. The site is deployed as
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
- **Finished branches to delete** (all merged; the git proxy here returns 403
  on branch deletes, so the owner deletes them in GitHub → Branches):
  `release/main-markdown` (PR #46), `docs/main-after-46` (PR #47), `launch`
  (PR #49), `release/analytics-www` (PR #50), `docs/after-50` (PR #51),
  `release/gtm-advanced` (PR #52), `docs/after-52` (PR #53),
  `docs/www-live` (PR #54), `release/clarity` (PR #55), `docs/after-55`
  (PR #56), `release/tag-gateway` (PR #57), `docs/after-57`. `feature/homepage-redesign` and
  the two `cloudflare/workers-autoconfig*` branches are also stale.
- **`release/main-markdown`** — merged into `main` via PR #46 (Markdown for
  the maintenance page, `favicon.ico`, first real `wrangler.jsonc` on
  production). Superseded by the launch. The user asked to delete it, but the
  git proxy returns 403 on branch deletes and no GitHub tool here deletes
  branches. The owner has to delete it (e.g. "Delete branch" on PR #46).
- **PR #47** (CLAUDE.md docs update for `main`) — merged by Claude on
  2026-09-23 at the user's request ("merge 47"), merge commit `4c44fe2`. `main`'s
  CLAUDE.md matches `dev`'s as of that merge, minus this bullet.
- **`claude/stoic-gates-w5906b`** (harness branch) — synced with `main` after
  PR #47 (merged `main` in, kept `main`'s README; files identical to `main` at
  `4c44fe2`). Re-sync it the same way whenever `main` changes.
- **`dev`** — active development branch. Everything on it as of 2026-09-23 is
  live. New work: feature branch → `dev` → `staging` → PR to `main`.
- **Feature branches** — branch off `dev`, merge back into `dev`.
- **Local dev hosting** — `npx wrangler dev` from the repo root runs the real
  Worker + assets exactly as deployed (the old `wrangler pages dev` advice was
  wrong for a Worker). No build step. Doing this locally instead of pushing
  feature branches avoids burning Cloudflare build minutes.

**Verified 2026-09-23 via PR #48's checks:** the Cloudflare "Workers Builds:
audetteit-site" preview build of `dev` succeeded, so the new `wrangler.jsonc` +
Worker setup builds on Cloudflare. **GitHub Actions CI has never run.** The
cause is an account/org-level block ("Actions has been disabled for this
user"); see #32 under "GitHub project tracking".

**PR #48** (`dev` → `main`, opened from the Claude Code UI and mislabeled as
"to staging") was closed on 2026-09-23 at the user's request; launch went
`staging` → `main` instead. When `main` has commits a branch lacks (merge
commits, docs), `git merge -s ours origin/main` on that branch clears the
conflict only if `main`'s side has nothing new. Check `git diff` first.

**Deploy timing (learned 2026-09-23):** Workers Builds runs one build at a
time, and preview builds from pushes to `dev`/`staging`/other branches queue
ahead of production. It also skips superseded commits: the PR #50 merge got no
build of its own because PR #51 merged 48s later, and #51's build (which
included #50) went live at 20:49 UTC, several minutes after the merge. To see
what production is really running, fetch the deployed code with the
Cloudflare MCP `workers_get_worker_code` (`audetteit-site`) or read the
"Workers Builds" check run on the `main` commit. Avoid a burst of branch
pushes right before a release.

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
- Confirming rights to the shield logo (#39).
- **GitHub Pages is publishing `staging`.** Its `pages-build-deployment`
  workflow ran on `staging` on 2026-09-23 (triggered by the `audetteit`
  account), so the Pages source appears to have been switched to `staging`.
  That publishes staging publicly on github.io, outside Cloudflare Access.
  Recommended: turn GitHub Pages off in Settings → Pages. The site is served by
  the Cloudflare Worker, not GitHub Pages.

## Project skills (`.claude/skills/`, on every branch)

On `main` via PR #63, and synced to `staging`, `dev` and
`claude/stoic-gates-w5906b`, so any new session on this repo loads them.
Installed 2026-09-24 for issue #61 (the owner named them in the issue), copied
from upstream, not written here:
- **`grill-me`** + **`grilling`** from `mattpocock/skills` (MIT, commit
  `c55ee46`). `grill-me` is user-invoked only (`/grill-me`) and just hands off
  to `grilling`, which interviews the owner in numbered rounds of questions
  with recommended answers.
- **`impeccable`** from `pbakaus/impeccable` `plugin/skills/impeccable`
  (Apache-2.0, v4.3.1, commit `e0881d2`). This is the skill folder only: its
  **edit hook was deliberately not installed** (no `settings.local.json`
  changes). Its `scripts/impeccable` launcher downloads a prebuilt binary from
  the project's GitHub releases on first run. Don't run it unless the owner
  agrees; the skill documents a fallback (read PRODUCT.md/DESIGN.md directly)
  when the launcher isn't used.
- When using `impeccable` here, the existing "Design direction" section and
  the owner's answers from `/grill-me` are the brief. Don't let its
  "go bold" defaults override decisions already made.
- To update: re-copy from upstream and bump the commit hashes above.

## Working conventions established this session

- **Never push to `main` without asking the user first — no exceptions.** This
  supersedes the earlier "push directly to main" convention from this same
  session; that convention is retired. Commit locally / stage the change, then
  explicitly ask before running `git push origin ... main`. This applies to
  every kind of change (content, assets, config, docs) — none of it is exempt
  just because it seems small or low-risk.
- Draft anything content/design-significant (new page layouts, copy) for review
  first (Artifact or the `staging` preview) — don't push unreviewed design
  changes to the live site. Republishing an Artifact is not a `main` push and doesn't
  need to wait on approval — it's a separate, private preview channel.
- Also push to `claude/stoic-gates-w5906b` alongside `main` once approved, to
  keep it in sync (harness convention from the original task setup).
