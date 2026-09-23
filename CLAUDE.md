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

- **Hosting:** Cloudflare Pages (migrated off Vercel — Vercel is no longer relevant to
  this project at all; don't touch the Vercel connector for this repo).
- **Live site:** currently a single maintenance page (`public/index.html`) — dark
  theme, brand blue accent, "We'll be right back" notice. This is intentional; the
  real multi-page redesign has **not** been pushed live yet, only drafted (see below).
- **Repo:** `Audette-IT/audetteit-site` on GitHub, default branch `main`.
- `functions/index.js` — a Cloudflare Pages Function that serves a Markdown version
  of the homepage when a request sends `Accept: text/markdown` (a free-tier stand-in
  for Cloudflare's paid "Markdown for Agents" zone feature — see issue #43).
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
  cursor — not decorative icon-in-rounded-square badges everywhere
- Services shown as a dense manifest/spec list with status tags, not icon cards
- Process shown as a connected pipeline diagram (nodes + line), not numbered cards
- A static example "monitoring console" panel as the hero's visual anchor, clearly
  labeled "example only" — not a giant repeated logo or decorative circuit art

Sources consulted for the anti-slop direction (worth re-reading before further
design work): the `funboy322/avoid-ai-design` checklist, Vercel's
`web-interface-guidelines` repo, and the "Anti-Slop Framework" article — search
history has the exact URLs if needed again.

## Live drafts (not yet merged into the repo)

Two Claude Artifacts hold the current work-in-progress. **Read these before
redoing any design or issue-tracking work** — don't regenerate from scratch.

- **Homepage redesign** (multi-page: Home / Services / Contact) —
  https://claude.ai/artifact/Vj8Pvwbi5uY8SZEhKSFpxq
  - Real nav between actual pages, not anchor scrolling.
  - Services split into two honest tiers: **Everyday help** (wifi, slow computers,
    printers, accounts, parental controls) and **Infrastructure & advanced**
    (network design, Active Directory/domains, self-hosted services, security
    hardening).
  - Every unverified fact (email, phone, city, footer name) is marked
    `[placeholder]` — deliberately not fabricated. Get real values from the user
    before shipping.
  - Not wired to a backend yet (contact form) — that's issue #24.
- **Issue tracker** —
  https://claude.ai/artifact/MXvC5hYXLAz4ged3ufUYQy
  - Every issue's full body is the exact GitHub text (verified byte-for-byte),
    grouped by area, expandable, with status pills strictly tied to actual
    open/closed GitHub state (never invent a "Done" status without actually
    closing the issue).

## Open questions for the user (don't guess these)

- Real contact email/phone/city for the site.
- Name to show in the footer ("run by ___").
- Whether/when to build the self-hosted help desk (issue #44 — standing reminder,
  no deadline) to replace the third-party Zammad widget at `help.audetteit.net`.
- Full list of services beyond what's drafted — more will likely get added as
  they're built out (noted as a placeholder on the Services page).

## Working conventions established this session

- Push directly to `main` for real infra/asset changes (favicons, robots.txt,
  maintenance page) since Cloudflare Pages deploys straight from it — there's no
  separate staging step in this project.
- Draft anything content/design-significant (new page layouts, copy) as a Claude
  Artifact for review first — don't push an unreviewed redesign over the live
  maintenance page.
- Also push to `claude/stoic-gates-w5906b` alongside `main` to keep it in sync
  (harness convention from the original task setup).
