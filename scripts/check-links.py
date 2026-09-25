"""Fail on broken internal links, or on a page missing from the Markdown/sitemap set.

Checks every public/*.html, *.md, and llms*.txt file. Clean URLs (/services)
map to public/services.html; "/" maps to public/index.html; absolute
https://audetteit.com/... URLs are treated as internal.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
SITE = "https://audetteit.com"
HTML_ATTR = re.compile(r'(?:href|src)="([^"#?]+)"')
MD_LINK = re.compile(r"\]\(([^)#?\s]+)\)")


def target_exists(ref: str) -> bool:
    path = ref.lstrip("/")
    if path == "":
        return (PUBLIC / "index.html").exists()
    candidate = PUBLIC / path
    return candidate.is_file() or candidate.with_suffix(".html").is_file()


broken = []
files = sorted([*PUBLIC.glob("*.html"), *PUBLIC.glob("*.md"), *PUBLIC.glob("llms*.txt")])
for page in files:
    pattern = HTML_ATTR if page.suffix == ".html" else MD_LINK
    for ref in pattern.findall(page.read_text()):
        if ref.startswith(SITE):
            ref = ref[len(SITE):] or "/"
        elif ref.startswith(("http://", "https://", "mailto:", "tel:", "data:")):
            continue
        if not target_exists(ref):
            broken.append(f"{page.name}: {ref}")

# Every HTML page needs a Markdown twin, a Worker route, and a sitemap entry.
worker = (ROOT / "worker" / "index.js").read_text()
wrangler = (ROOT / "wrangler.jsonc").read_text()
sitemap = (PUBLIC / "sitemap.xml").read_text()
llms = (PUBLIC / "llms.txt").read_text()
headers = (PUBLIC / "_headers").read_text()
# 404.html is the one exception: it's served for unknown URLs (wrangler.jsonc
# not_found_handling), so it has no route, twin, sitemap entry or canonical.
NOT_FOUND = PUBLIC / "404.html"
for page in sorted(p for p in PUBLIC.glob("*.html") if p != NOT_FOUND):
    route = "/" if page.stem == "index" else f"/{page.stem}"
    md = f"/{page.stem}.md"
    checks = {
        f"missing public{md}": (PUBLIC / md.lstrip("/")).is_file(),
        f"not in MARKDOWN_PAGES in worker/index.js": f'"{route}": "{md}"' in worker,
        f"not in run_worker_first in wrangler.jsonc": f'"{route}"' in wrangler,
        f"not in sitemap.xml": f"<loc>{SITE}{route}</loc>" in sitemap,
        f"not linked from llms.txt": f"({SITE}{md})" in llms,
        # Direct /<page>.md requests are static assets, so the canonical Link
        # header back to the HTML page has to come from public/_headers.
        f"no {md} block with a canonical Link in public/_headers":
            f'{md}\n  Content-Type: text/markdown; charset=utf-8\n  Link: <{SITE}{route}>; rel="canonical"' in headers,
    }
    broken += [f"{page.name}: {msg}" for msg, ok in checks.items() if not ok]

# Every inline <script> must be allowed by a matching CSP hash, in both
# public/_headers and worker/index.js (they set the CSP for different paths).
import base64, hashlib
INLINE = re.compile(r"<script>(.*?)</script>", re.S)
for page in sorted(PUBLIC.glob("*.html")):
    for js in INLINE.findall(page.read_text()):
        h = "'sha256-" + base64.b64encode(hashlib.sha256(js.encode()).digest()).decode() + "'"
        if h not in headers:
            broken.append(f"{page.name}: inline script hash {h} missing from public/_headers CSP")
        if h not in worker:
            broken.append(f"{page.name}: inline script hash {h} missing from worker/index.js CSP")

# Page basics (GitHub #77), so the launch polish doesn't slip back.
for page in sorted(PUBLIC.glob("*.html")):
    html = page.read_text()
    desc = re.search(r'<meta name="description" content="([^"]*)"', html)
    if not desc or not desc.group(1).strip():
        broken.append(f"{page.name}: missing meta description")
    elif len(desc.group(1)) > 160:
        broken.append(f"{page.name}: meta description is {len(desc.group(1))} characters (keep it to 160)")
    h1s = len(re.findall(r"<h1[\s>]", html))
    if h1s != 1:
        broken.append(f"{page.name}: has {h1s} <h1> elements (needs exactly 1)")
    for img in re.findall(r"<img\b[^>]*>", html):
        if not re.search(r'\balt="', img):
            broken.append(f"{page.name}: <img> without alt: {img[:60]}")
    if page == NOT_FOUND:
        if '<meta name="robots" content="noindex">' not in html:
            broken.append("404.html: needs <meta name=\"robots\" content=\"noindex\">")
        if 'rel="canonical"' in html:
            broken.append("404.html: must not have a canonical link")
    elif 'property="og:image:alt"' not in html:
        broken.append(f"{page.name}: missing og:image:alt")
if f"<loc>{SITE}/404</loc>" in sitemap:
    broken.append("sitemap.xml: 404 must not be listed")
if '"not_found_handling": "404-page"' not in wrangler:
    broken.append('wrangler.jsonc: assets.not_found_handling must be "404-page"')

# No debugging leftovers in anything that's served.
for f in sorted(PUBLIC.rglob("*")):
    if f.suffix == ".map":
        broken.append(f"{f.relative_to(ROOT)}: source map is served")
    elif f.suffix in {".js", ".css", ".html"}:
        text = f.read_text()
        if "sourceMappingURL" in text:
            broken.append(f"{f.relative_to(ROOT)}: sourceMappingURL comment")
        if f.suffix == ".js" and re.search(r"\bconsole\.(log|debug)\(|\bdebugger\b", text):
            broken.append(f"{f.relative_to(ROOT)}: console.log/debug or debugger left in")

if broken:
    print("Problems:\n  " + "\n  ".join(broken))
    sys.exit(1)
print(f"Links and Markdown coverage OK across {len(files)} files.")
