# Asset provenance

Every image the site ships, where it came from, and whether rights are confirmed.
Update this whenever an asset is added or replaced (GitHub issue #39).

| File (in `public/assets/`) | Source | Rights |
|---|---|---|
| `logo.svg` | The shield mark, redrawn from scratch as SVG in 2026-09 for issue #61. Keeps the original logo's elements (split blue/navy shield, white "A", circuit traces) and adds a yellow wifi arc. No outside artwork was used. | Original drawing. It's based on the owner's earlier shield logo, so rights still follow that design: **unconfirmed** until the owner confirms it (#39). |
| `logo-mark.png` | Rendered from `logo.svg` at 512×512, transparent background. Also the Open Graph/Twitter image. | Follows `logo.svg`. |
| `favicon.ico` (in `public/`, served at `/favicon.ico`) | Rendered from `logo.svg`: 16, 32 and 48px in one file. Google Search needs a favicon at the site root, 48px or a multiple of it. | Follows `logo.svg`. |
| `favicon-32.png`, `favicon-16.png` | Rendered from `logo.svg`. | Follows `logo.svg`. |
| `apple-touch-icon.png` | Rendered from `logo.svg` at 180×180 on white. | Follows `logo.svg`. |
| `faviconlogo.png` | Rendered from `logo.svg` at 192×192 (used by `site.webmanifest`). | Follows `logo.svg`. |

No stock photos, icon packs, or other third-party imagery are used. The floor-plan
illustration, the menu icon and the small note icons are inline SVGs drawn in
the HTML.

Fonts (Red Hat Display / Red Hat Text) load from Google Fonts under the SIL Open
Font License, which permits commercial use.
