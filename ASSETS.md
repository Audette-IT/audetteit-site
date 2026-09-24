# Asset provenance

Every image the site ships, where it came from, and whether rights are confirmed.
Update this whenever an asset is added or replaced (GitHub issue #39).

| File (in `public/assets/`) | Source | Rights |
|---|---|---|
| `logo.svg` | The "roofline A" mark: an A drawn as a house roof with a wifi arc and dot inside. Designed from scratch in the 2026-09-24 redesign session (#61); hand-written SVG, no third-party artwork. | Original work made for the owner. The old shield logo is no longer used. |
| `logo-mark.png` | Rendered from `logo.svg` at 512×512 (used for Open Graph and the web manifest). | Follows `logo.svg`. |
| `favicon.ico` (in `public/`, served at `/favicon.ico`) | Rendered from `logo.svg`: 16, 32, and 48px in one file. Google Search needs a favicon at the site root, 48px or a multiple of it. | Follows `logo.svg`. |
| `favicon-32.png`, `favicon-16.png` | Rendered from `logo.svg`. | Follows `logo.svg`. |
| `apple-touch-icon.png` | Rendered from `logo.svg` at 180×180. | Follows `logo.svg`. |
| `faviconlogo.png` | Rendered from `logo.svg` at 192×192, used by `site.webmanifest`. | Follows `logo.svg`. |

No stock photos, icon packs, or other third-party imagery are used. The floor
plan on the homepage and the small menu and map-pin icons are inline SVG drawn
in the HTML.

Fonts (Schibsted Grotesk and Atkinson Hyperlegible Next) load from Google Fonts under the SIL Open
Font License, which permits commercial use.
