# Asset provenance

Every image the site ships, where it came from, and whether rights are confirmed.
Update this whenever an asset is added or replaced (GitHub issue #39).

| File (in `public/assets/`) | Source | Rights |
|---|---|---|
| `logo.svg` | The shield mark, redrawn from scratch as SVG in 2026-09 for issue #61. Keeps the original logo's elements (split blue/navy shield, white "A", circuit traces) and adds a yellow wifi arc. No outside artwork was used. | **Confirmed.** Original drawing, based on the owner's earlier shield logo. The owner confirmed they hold the rights to that design (2026-09-24, #39). |
| `logo-mark.png` | Rendered from `logo.svg` at 512×512, transparent background. | Follows `logo.svg`. |
| `share.png` | The Open Graph/Twitter link-preview image, 1200×630 (#77). Draft B from `tools/share-image.html` (the owner picked it on 2026-09-25): the logo, the homepage headline and the homepage's own floor-plan drawing. Rendered with `tools/render-share-image.js` using Red Hat fonts from the `@fontsource` npm packages (SIL OFL). | Follows `logo.svg`; everything else is original. |
| `favicon.ico` (in `public/`, served at `/favicon.ico`) | Rendered from `logo.svg`: 16, 32 and 48px in one file. Google Search needs a favicon at the site root, 48px or a multiple of it. | Follows `logo.svg`. |
| `favicon-32.png`, `favicon-16.png` | Rendered from `logo.svg`. | Follows `logo.svg`. |
| `apple-touch-icon.png` | Rendered from `logo.svg` at 180×180 on white. | Follows `logo.svg`. |
| `faviconlogo.png` | Rendered from `logo.svg` at 192×192 (used by `site.webmanifest`). | Follows `logo.svg`. |

No stock photos, icon packs, or other third-party imagery are used. The floor-plan
illustration, the menu icon and the small note icons are inline SVGs drawn in
the HTML.

Fonts (Red Hat Display / Red Hat Text) load from Google Fonts under the SIL Open
Font License, which permits commercial use.
