---
name: audette-it-design
description: Audette IT's visual and writing style ("room guide"), taken from audetteit.com. Use whenever you make or edit anything for Audette IT or Michael's tech help, including web pages, web apps and dashboards, the help desk, audetteit.net, emails and replies to customers, flyers, social posts, Google Business Profile text, and documents. It keeps everything matching the site: Red Hat type, heavy black rules, #0074A8 blue, yellow highlights, floor-plan illustrations, and first-person plain-English copy from Michael. Use it even when the request only says "match my site", "on brand" or "Audette IT style", or names an Audette IT app without mentioning design.
---

# Audette IT design: "room guide"

audetteit.com looks like a **printed quick-start guide for a house**: white paper,
heavy black rules between sections, a floor plan drawn as "Fig. 1", yellow
lettered callouts, pill buttons, and one solid blue band. The copy sounds like
Michael talking: first person, plain, short.

Everything Audette IT makes should feel like another page from the same guide.
The owner rejected two earlier looks as "AI slop" and "not professional". This
style was chosen after four drafts, so **follow it rather than reinventing it**.

## Who this is (get this right first)

- Audette IT is **one person, Michael** (first name only), doing tech help
  **in person around Las Vegas, or remotely from anywhere**. It's not a company,
  an MSP or a registered business. Write "I", never "we" or "our team".
- **Paid, with a quote before any work.** Never state prices, rates or hours.
- **Computers and laptops:** hardware work is OK (swapping a drive, adding memory).
- **Phones and tablets:** digital help only (setup, settings, apps, parental
  controls). **No physical repairs** (no screens, no batteries).
- **In scope:** TVs and smart home, plus the "bigger jobs" (network design,
  Active Directory, self-hosted services, security hardening).
- **The only contact detail is** `michael.audette@audetteit.com`. No phone
  number, street address, last name, reviews, credentials or certifications.
  If a piece seems to need one of those, leave it out or leave a clearly marked
  `[TODO: ask Michael]` placeholder. Don't make one up.

The full service list and example copy are in `references/voice.md`.

## Voice in one breath

First person, casual, plain English, short sentences. Say what's wrong and
what happens next. Explain, don't sell: no "solutions", "seamless",
"cutting-edge", "peace of mind", "one-stop shop" or exclamation-mark hype.
It's fine to say no (for example to phone screen repairs), kindly, and to offer
what Michael *can* do instead.

## Visual rules

1. **Type:** Red Hat Display for headings (weight 900 for big headings, 700 for
   small ones), Red Hat Text for body (400/500/700). Google Fonts:
   `family=Red+Hat+Display:wght@500;700;900&family=Red+Hat+Text:wght@400;500;700`.
   Big headings are tight: `line-height: 1`, `letter-spacing: -0.03em`.
2. **Structure comes from rules, not boxes:** 3px `--rule` lines between
   sections and under group headings, and 1px `--hair` lines between list rows.
   Bordered boxes (2–3px, 6px radius) are only for the figure, the support box
   and forms.
3. **Buttons are pills** (`border-radius: 999px`, 2px border). Solid ink for
   the main action, outlined for the others.
4. **Blue** (`--blue`) is for links and hover states. At most **one** solid
   `--blue-field` band per page.
5. **Yellow** `#FFD23F` (`--mark`) is only for highlights: the `<mark>` in a
   heading, lettered callouts/pins, the FAQ +/−, focus rings and text selection.
   Never use it for backgrounds of whole areas or for body text.
6. **Light and dark themes both work.** Use the tokens, never raw hex, so dark
   mode comes for free.
7. **Illustration is line drawing:** black-line floor plans or diagrams (thin
   strokes, dashed wifi rings in blue, small uppercase labels), labeled like a
   manual ("Fig. 1: ..."). Icons are simple 24px stroke icons (2.2px stroke,
   `currentColor`), used sparingly.

**Light-mode blue is `#0074A8`, never the brand `#0090CC`.** `#0090CC` fails WCAG
AA as link text (3.22:1) and as white text on a button (3.58:1). The logo keeps
its own colors; the UI never borrows them.

All tokens (light and dark) are in `references/tokens.md`.

## Don'ts (these are what got rejected)

- No icon-in-a-rounded-square card grids, no gradients, no glassmorphism, no
  drop-shadow-heavy cards.
- No emoji as bullets or decoration.
- No big "01 / 02 / 03" markers unless it really is a sequence (the three
  "How it works" steps are the one real sequence on the site).
- No chat bubbles or text-message motifs.
- No "ops console" look: no monospace-everything, fake terminals, fake uptime
  or "All systems operational" panels.
- No stock photos, no decorative circuit art.
- Nothing slick or "too modern": no parallax, no scroll-jacking, no animated
  gradients. Motion is limited to small hover/press feedback.

## Accessibility (non-negotiable)

Skip link, visible `:focus-visible` rings (3px yellow), AA contrast in both
themes, a real `<label>` on every field, `aria-pressed` on toggle buttons such
as room pins, `aria-expanded` on menus, `aria-hidden="true"` on decorative SVG,
and errors announced with `role="alert"`.

## Which file to read next

| You're making... | Read |
|---|---|
| Anything with colors | `references/tokens.md` |
| An HTML page or a component (header, buttons, hero, floor plan, tables, steps, FAQ, form, footer) | `references/components.md`, then start from a template in `assets/templates/` |
| A web app, dashboard, admin screen, help desk, status page or **audetteit.net** | `references/apps.md` (it extends the system for app UI without adding new colors) |
| Email, flyer, print, social post, business profile | `references/voice.md` and the "Beyond the web" section of `references/apps.md` |
| A change **inside the audetteit.com repo** (new page, head block, CSP) | `references/website.md` (the repo has hard rules: Markdown twins, CSP, GTM) |

## Assets

- `assets/room-guide.css`: the site's full stylesheet (tokens and every
  component). Any Audette IT web project can link or copy it and use the class
  names from `components.md` as-is.
- `assets/logo.svg`: the master logo (40×44 viewBox). Use it as-is. Don't
  recolor it, stretch it or add effects. Put 12px or more of space around it.
- `assets/templates/site-page.html`: an empty audetteit.com page with the
  exact head block (consent, GTM, meta, fonts).
- `assets/templates/standalone-page.html`: the same look for projects outside
  audetteit.com (no GTM or consent script), with the CSS linked from a relative path.

## Check your work

Run `python3 scripts/check_design.py <files or folders...>` on what you
produced (add `--site` for audetteit.com pages, where the GTM snippet is
allowed). It flags colors outside the palette, `#0090CC`, gradients, shadows,
emoji, inline scripts, missing fonts, company-speak ("our team"), phone numbers
and prices. Then do one read-through for the voice and the facts above. The
script can't judge tone.

If the live site's design changes, this skill has to be regenerated from
`public/css/site.css` and the pages so the two don't drift apart.
