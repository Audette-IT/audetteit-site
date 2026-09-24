#!/usr/bin/env python3
"""Check HTML/CSS/SVG/Markdown files against the Audette IT "room guide" rules.

    python3 check_design.py file.html [more files or folders...] [--site]

It catches the mechanical mistakes (tone and facts still need a human read):
  - hex colors outside the room-guide palette (logo colors are allowed only inside the logo SVG)
  - the old brand blue #0090CC
  - gradients, and heavy box-shadows
  - emoji used in the copy
  - inline <script> blocks without src (the site's CSP blocks them); JSON-LD is fine.
    The one allowed inline script is audetteit.com's GTM snippet, and only with --site.
  - HTML pages that don't load the Red Hat fonts
  - company-speak like "our team" or "we provide" (Audette IT is one person)
  - a phone number or a "$" price in the copy
Exit code 1 if anything is flagged.
"""
import pathlib
import re
import sys

PALETTE = {
    # light
    "#FFFFFF", "#F2F4F6", "#1A1E23", "#545D66", "#D9DEE3", "#0074A8", "#006A9C",
    "#EAF5FB", "#FFD23F", "#8A949E", "#A3261B",
    # dark
    "#111418", "#181C21", "#ECEFF2", "#A7B0B9", "#2A3037", "#6CC6F0", "#0A4F74",
    "#D5ECF8", "#7E8993", "#FF8A7E",
}
LOGO_ONLY = {"#1FA6E0", "#0B2545", "#3BB9EE", "#FFC23D"}
SHORT_OK = {"#FFF", "#000"}  # tolerated in shorthand; #000 is flagged below as not ink

HEX = re.compile(r"#[0-9A-Fa-f]{3}(?:[0-9A-Fa-f]{3})?(?:[0-9A-Fa-f]{2})?\b")
EMOJI = re.compile("[\U0001F300-\U0001FAFF\U00002600-\U000027BF\U0001F000-\U0001F2FF]")
# Company-speak only: "we pick a time" (Michael and the customer) is fine.
WE = re.compile(r"\b(our team|our company|our staff|our technicians|our experts|we offer|we provide|we specialize|we are a|we're a)\b", re.I)
PHONE = re.compile(r"(?<!\d)(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}(?!\d)")
PRICE = re.compile(r"\$\s?\d")
GTM_ID = "GTM-TKBJX8F5"  # audetteit.com's container; its exact snippet is hashed in the site CSP


def text_only(html):
    """Visible text of an HTML/SVG doc, roughly (drops tags, scripts, styles, comments)."""
    html = re.sub(r"<!--.*?-->", " ", html, flags=re.S)
    html = re.sub(r"<(script|style)\b.*?</\1>", " ", html, flags=re.S | re.I)
    return re.sub(r"<[^>]+>", " ", html)


def check(path, site):
    raw = path.read_text(encoding="utf-8", errors="replace")
    out = []
    ext = path.suffix.lower()
    is_logo = ext == ".svg" and "ait-shield" in raw
    code = re.sub(r"<!--.*?-->|/\*.*?\*/", " ", raw, flags=re.S)

    if ext in {".html", ".htm", ".css", ".svg"}:
        for m in HEX.finditer(code):
            h = m.group(0).upper()
            if h == "#0090CC":
                out.append(f"{h}: the old brand blue fails WCAG AA. Use var(--blue) (#0074A8).")
            elif h in PALETTE or h in SHORT_OK and h != "#000":
                continue
            elif h in LOGO_ONLY:
                if not is_logo:
                    out.append(f"{h} is a logo-only color. Use the UI tokens instead.")
            else:
                out.append(f"{h} is not in the room-guide palette (see references/tokens.md).")
        if re.search(r"(linear|radial|conic)-gradient\(", code):
            out.append("Gradient found. The style is flat: use a token color, a rule or nothing.")
        for m in re.finditer(r"box-shadow\s*:\s*([^;}{]+)", code):
            if m.group(1).strip() not in {"none", "0"}:
                out.append(f"box-shadow '{m.group(1).strip()}': structure comes from rules and borders, not shadows.")

    if ext in {".html", ".htm"}:
        for m in re.finditer(r"<script\b([^>]*)>(.*?)</script>", raw, flags=re.S | re.I):
            attrs, body = m.group(1), m.group(2)
            if "src=" in attrs or not body.strip() or "ld+json" in attrs:
                continue
            if GTM_ID in body and "googletagmanager.com/gtm.js" in body:
                if not site:
                    out.append("GTM snippet found. It belongs only on audetteit.com (use --site there); other projects add analytics only if Michael asks.")
                continue
            out.append("Inline <script> found. Move it to an external .js file (the CSP is script-src 'self').")
        if "<html" in raw.lower() and "Red+Hat" not in raw and "Red Hat" not in raw:
            out.append("Page doesn't load the Red Hat Display / Red Hat Text fonts.")

    if ext in {".html", ".htm", ".md", ".txt", ".svg"}:
        visible = text_only(raw) if ext != ".md" and ext != ".txt" else raw
        for m in EMOJI.finditer(visible):
            out.append(f"Emoji '{m.group(0)}' in the copy. No emoji as bullets or decoration.")
            break
        for m in WE.finditer(visible):
            out.append(f"'{m.group(0)}': Audette IT is one person. Write in the first person singular.")
            break
        if PHONE.search(visible):
            out.append("Looks like a phone number. The only contact detail is michael.audette@audetteit.com.")
        if PRICE.search(visible):
            out.append("Looks like a price. Prices are never published: it's a quote before any work.")
    return out


def main(argv):
    site = "--site" in argv
    targets = [a for a in argv if a != "--site"]
    if not targets:
        print(__doc__)
        return 2
    files = []
    for t in targets:
        p = pathlib.Path(t)
        if p.is_dir():
            files += [f for f in p.rglob("*") if f.suffix.lower() in {".html", ".htm", ".css", ".svg", ".md", ".txt"}]
        else:
            files.append(p)
    bad = 0
    for f in sorted(files):
        for problem in check(f, site):
            bad += 1
            print(f"{f}: {problem}")
    print(f"{len(files)} file(s) checked, {bad} problem(s).")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
