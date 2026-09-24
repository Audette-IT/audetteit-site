# Using the style beyond the marketing site

For web apps (the self-hosted help desk, dashboards, admin screens, status
pages), **audetteit.net**, and non-web pieces (email, print, social images).

The goal: someone who has seen audetteit.com should recognize anything else
Audette IT makes as coming from the same place. Keep the **tokens, type, rules,
pill buttons, yellow-only-for-highlights and the voice**. Adapt the layout to
the job.

Contents: setup · app patterns · status without new colors · charts ·
audetteit.net and other properties · frameworks · beyond the web

---

## Setup for any web project

1. Copy `assets/room-guide.css` (the whole site design system) and, for apps,
   `assets/app-extras.css` (panels, data tables, status, stats, alerts, empty
   states, side nav, selects, dialog). Load `room-guide.css` first.
2. Load the fonts:
   `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@500;700;900&family=Red+Hat+Text:wght@400;500;700&display=swap">`
   For an offline or self-hosted app, download the two families (SIL OFL, OK to
   bundle) and serve them yourself. The fallbacks are `"Segoe UI", system-ui`.
3. Copy `assets/logo.svg` and use `<img src="logo.svg" alt="" width="40" height="44">`
   in the `.brand` link.
4. Start from `assets/templates/standalone-page.html`.
5. JS goes in external files. It's a good habit that keeps a strict CSP
   (`script-src 'self'`) possible, the same as on the site.

## App patterns (classes from `app-extras.css`)

**App shell.** Reuse `header.site` with the same brand block. Change the
`<small>` descriptor to name the app (for example "Help desk"). Put the
signed-in user or a "Sign out" link in `.nav-links`. Sections of the app go in
a `.side-nav` (hairline list, current page marked with a yellow underline)
inside `.app-layout`. Don't add a dark sidebar or a colored top bar: the page
stays paper-white with black rules.

```html
<div class="wrap app-layout">
  <nav class="side-nav" aria-label="Sections">
    <a href="/requests" aria-current="page">Requests</a>
    <a href="/devices">Devices</a>
    <a href="/settings">Settings</a>
  </nav>
  <main id="main-content">
    <div class="panel">
      <div class="panel-head"><h2>Open requests</h2><p>3 waiting on you</p></div>
      <div class="table-scroll">
        <table class="data-table">
          <thead><tr><th>Request</th><th>From</th><th>Status</th><th class="num">Opened</th></tr></thead>
          <tbody>
            <tr><td>Printer won't connect to wifi</td><td>Jane</td><td><span class="status status-attention">Needs you</span></td><td class="num">Sep 24</td></tr>
            <tr><td>New laptop setup</td><td>Sam</td><td><span class="status status-info">Scheduled</span></td><td class="num">Sep 22</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</div>
```

**Grouping.** Use `.panel` (a titled block under a 3px rule) instead of cards.
If you think you need a grid of cards, you probably want a `.data-table`, a
`.parts` list or `.notes`.

**Numbers.** `.stats` > `.stat` gives a big Red Hat Display 900 number with a
plain label under a 3px rule. Only show numbers that are real and live. Never
use placeholder numbers that look like real data.

**Messages.** Use `.alert` (bordered, with an optional yellow `.callout` letter
or "!") for notices, and `.alert-problem` for errors. Write the text in
Michael's voice: say what happened and what to do.

**Empty states.** Use `.empty`: a heading plus one line saying what happens
next.

**Forms.** Use the site's `.field`, `.contact-form` and `.form-error`
unchanged. Selects are styled in `app-extras.css`. For toggles, use a real
checkbox with `accent-color: var(--blue)`.

**Dialogs.** Use a native `<dialog class="dlg">` with a 3px rule border and
pill buttons in `.actions`.

**Loading.** Show the text "Loading…" in `--ink-soft`, or a static
`--paper-2` block. Avoid shimmer animations and spinners that spin forever.

## Status without new colors

The palette has no green or orange, and it shouldn't get them. Status is shown
with a **word plus a shape**, so it also works for color-blind users and in
print:

| Meaning | Class | Looks like |
|---|---|---|
| Working / done | `.status-ok` | filled ink dot + word |
| In progress / scheduled / waiting on someone else | `.status-info` | hollow blue dot + word |
| Needs attention / waiting on you | `.status-attention` | yellow pill (the one place yellow sits behind a word) |
| Broken / failed | `.status-problem` | `--error` diamond + word |
| Unknown / not checked | `.status-off` | hollow grey dot + word |

Always write the word ("Down", "Needs you", "Working"), and never rely on the
dot alone.

**Status pages** (for example for the help desk, #44) must show real checks
with a "last checked" time. The old site had a hard-coded "All systems
operational" panel, and it was removed for being fake. If there's no real
monitoring yet, don't build the page.

## Charts

Few series and flat marks. Map series to `--ink`, `--blue` and `--draw-soft`,
with `--mark` for a single highlighted value only. Use hairline gridlines
(`--hair`) and labels in Red Hat Text `--ink-soft`. No gradients, 3D or
shadows. If the `dataviz` skill is available, follow its method and swap its
palette for these tokens.

## audetteit.net and other properties

audetteit.net and future Audette IT sites or apps are **siblings of
audetteit.com**: same header brand block, tokens, type and voice. Things to
decide per project, and to ask Michael about if unclear:

- **What it is for.** Don't assume. The site so far only says Audette IT is
  Michael's tech help. Don't invent a product, portal or service it offers.
- **The descriptor** under "Audette IT" in the brand block.
- **Whether it links back** to audetteit.com (usually yes, in the footer).
- **Tracking.** GTM, the consent banner and the privacy page are
  audetteit.com's setup. A new property only gets analytics if Michael asks,
  and then it needs its own consent banner and privacy note.

The hero floor plan belongs to audetteit.com. Another property can use its own
Fig. 1 line illustration (a network diagram, a single room) in the same style,
but shouldn't copy the house plan as decoration.

## Frameworks (React, Tailwind, etc.)

Keep the CSS variables as the source of truth and point the framework at them:

```js
// tailwind.config.js (theme.extend)
colors: {
  paper: 'var(--paper)', 'paper-2': 'var(--paper-2)', ink: 'var(--ink)', 'ink-soft': 'var(--ink-soft)',
  rule: 'var(--rule)', hair: 'var(--hair)', blue: 'var(--blue)', 'blue-field': 'var(--blue-field)',
  'on-blue': 'var(--on-blue)', 'on-blue-soft': 'var(--on-blue-soft)', mark: 'var(--mark)',
  'mark-ink': 'var(--mark-ink)', error: 'var(--error)',
},
fontFamily: {
  display: ['"Red Hat Display"', '"Segoe UI"', 'system-ui', 'sans-serif'],
  sans: ['"Red Hat Text"', '"Segoe UI"', 'system-ui', 'sans-serif'],
},
borderRadius: { box: '6px', pill: '999px' },
```

Include the `:root` token blocks from `tokens.md` in the global CSS. If you use
a component library (shadcn/ui and so on), restyle it to match: square-ish 6px
boxes, 2–3px ink borders, pill buttons, no shadows, no gradients.

## Beyond the web

**HTML email.** Email clients don't support CSS variables or web fonts
reliably, so use the **light** hex values inline (`#1A1E23` text, `#545D66`
secondary, `#0074A8` links, `#D9DEE3` hairlines), `"Red Hat Text", "Segoe UI",
Arial, sans-serif`, and a 600px single column. Put a 3px `#1A1E23` rule under the
header and above the footer. Make the button a pill with `#1A1E23` fill and
`#FFFFFF` text, and the logo a PNG (`logo-mark.png`). Plain-text replies to
customers don't need any of this: just the voice.

**Flyers and print** (letter or A4). White paper, the logo and "Audette IT"
top left, one big Red Hat Display 900 headline with a yellow `mark` on the key
words, a lede in `--ink-soft`, 3px black rules between blocks, the Everyday /
Bigger jobs lists with hairlines, one line "In person around Las Vegas, or
remotely from anywhere. Quote before any work.", and the email address large
at the bottom. It's fine to leave out the blue band. Black, grey and yellow
alone print well. No QR code unless asked. Don't add a phone number.

**Social images and profile art.** Paper background, the logo, and a short
headline in Red Hat Display 900 with one yellow `mark`. Optionally a
line-drawing fragment (a room, a router with dashed wifi rings). No stock
photos.

**Documents (quotes, write-ups).** Red Hat Display headings, Red Hat Text body,
a 3px rule under the title, tables with hairlines, and the first-person voice.
A quote document never shows a price that Michael hasn't given you.
