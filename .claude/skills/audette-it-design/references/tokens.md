# Tokens

Copied exactly from `public/css/site.css` (`:root` and the
`prefers-color-scheme: dark` block). Always use the CSS variable, never the raw
hex, so dark mode works automatically. **Don't add new colors.** If a design
seems to need one, express it with these instead (see `apps.md` for status
colors).

## Colors

| Token | Light | Dark | Use it for |
|---|---|---|---|
| `--paper` | `#FFFFFF` | `#111418` | Page background, the text on solid ink buttons |
| `--paper-2` | `#F2F4F6` | `#181C21` | Inputs, the email "addr" chip, button hover |
| `--ink` | `#1A1E23` | `#ECEFF2` | Body text, headings, the solid button background |
| `--ink-soft` | `#545D66` | `#A7B0B9` | Secondary text: ledes, descriptions, captions, footer |
| `--rule` | `#1A1E23` | `#ECEFF2` | The heavy 3px section rules and 2–3px box borders |
| `--hair` | `#D9DEE3` | `#2A3037` | 1px lines between list/table rows, input borders |
| `--blue` | `#0074A8` | `#6CC6F0` | Links, button hover, checkbox accent, wifi rings in drawings |
| `--blue-field` | `#006A9C` | `#0A4F74` | The one solid blue band per page |
| `--on-blue` | `#FFFFFF` | `#FFFFFF` | Text on `--blue-field` |
| `--on-blue-soft` | `#EAF5FB` | `#D5ECF8` | Secondary text and links on `--blue-field` |
| `--mark` | `#FFD23F` | `#FFD23F` | Highlights only: `h1 mark`, callout letters, FAQ +/−, focus ring, selection |
| `--mark-ink` | `#1A1E23` | `#1A1E23` | Text on `--mark` (always dark, in both themes) |
| `--draw` | `#1A1E23` | `#ECEFF2` | Main strokes in line illustrations |
| `--draw-soft` | `#8A949E` | `#7E8993` | Secondary strokes (furniture, door swings) |
| `--error` | `#A3261B` | `#FF8A7E` | Form errors and anything broken |

```css
:root {
  --paper: #FFFFFF; --paper-2: #F2F4F6; --ink: #1A1E23; --ink-soft: #545D66;
  --rule: #1A1E23; --hair: #D9DEE3; --blue: #0074A8; --blue-field: #006A9C;
  --on-blue: #FFFFFF; --on-blue-soft: #EAF5FB; --mark: #FFD23F; --mark-ink: #1A1E23;
  --draw: #1A1E23; --draw-soft: #8A949E; --error: #A3261B;
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root {
    --paper: #111418; --paper-2: #181C21; --ink: #ECEFF2; --ink-soft: #A7B0B9; --rule: #ECEFF2; --hair: #2A3037;
    --blue: #6CC6F0; --blue-field: #0A4F74; --on-blue: #FFFFFF; --on-blue-soft: #D5ECF8;
    --mark: #FFD23F; --mark-ink: #1A1E23; --draw: #ECEFF2; --draw-soft: #7E8993; --error: #FF8A7E;
    color-scheme: dark;
  }
}
```

### Why the blue is `#0074A8`

The brand blue from the old site, `#0090CC`, fails WCAG AA: 3.22:1 as link text
on white and 3.58:1 for white text on a blue button. `#0074A8` passes (about
4.6–5.2:1). When `#0090CC` was put back as a test, axe reported 12 contrast
failures. Don't "restore" it.

The one other allowed raw color: `.btn-solid:hover` sets `color: #FFFFFF` on
`--blue` (white on blue, both themes).

## Logo colors (inside `logo.svg` only)

`#1FA6E0` (left half of the shield), `#0B2545` (right half), `#3BB9EE`
(circuit traces), `#FFFFFF` (the "A"), `#FFC23D` (wifi arc and dot). These
belong to the logo artwork and must not be used for UI, text or backgrounds.

## Type

| Role | Font | Weight | Size (from the site) |
|---|---|---|---|
| Home hero `h1` | Red Hat Display | 900 | `clamp(2.4rem, 5.6vw, 4.4rem)`, line-height 1, letter-spacing -0.03em |
| Inner page `h1` | Red Hat Display | 900 | `clamp(2.3rem, 5vw, 3.8rem)`, line-height 1, -0.03em |
| Section `h2` (`.band-head`) | Red Hat Display | 900 | `clamp(1.9rem, 3.8vw, 2.9rem)`, line-height 1.02, -0.02em |
| Group heading (`.parts h3`) | Red Hat Display | 900 | 1.1rem, UPPERCASE, letter-spacing 0.06em, 3px rule under it |
| Small heading (`.steps h3`, `.note h3`) | Red Hat Display | 700 | 1.15–1.3rem |
| Body | Red Hat Text | 400 | 1.0625rem / 1.6 |
| Lede | Red Hat Text | 400 | 1.15rem, `--ink-soft`, max 40ch |
| Button | Red Hat Display | 700 | 1rem / 1 |
| Caption, footer | Red Hat Text | 400 | 0.85–0.92rem, `--ink-soft` |
| Monospace (sparingly: codes, IDs) | `ui-monospace, "SF Mono", Menlo, Consolas, monospace` | 400 | 0.92em |

Fallback stack: `"Segoe UI", system-ui, sans-serif`.

## Space and shape

- Content width: `.wrap { max-width: 1180px; padding-inline: clamp(16px, 4vw, 40px); }`
- Section padding: `clamp(56px, 8vw, 96px)` top and bottom, with a 3px top rule
- Radius: **6px** for boxes (figure, support box, form, inputs), **999px** for
  buttons, **50%** for round callouts and pins, 4px for the `h1 mark`
- Borders: **3px** for section rules and big boxes, **2px** for buttons, inputs
  and the figure, **1px** for hairlines
- Breakpoint: **860px**. Below it, grids stack into one column and the nav
  becomes the menu button
- Focus: `outline: 3px solid var(--mark); outline-offset: 3px`
