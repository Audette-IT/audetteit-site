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
for page in sorted(PUBLIC.glob("*.html")):
    route = "/" if page.stem == "index" else f"/{page.stem}"
    md = f"/{page.stem}.md"
    checks = {
        f"missing public{md}": (PUBLIC / md.lstrip("/")).is_file(),
        f"not in MARKDOWN_PAGES in worker/index.js": f'"{route}": "{md}"' in worker,
        f"not in run_worker_first in wrangler.jsonc": f'"{route}"' in wrangler,
        f"not in sitemap.xml": f"<loc>{SITE}{route}</loc>" in sitemap,
        f"not linked from llms.txt": f"({SITE}{md})" in llms,
    }
    broken += [f"{page.name}: {msg}" for msg, ok in checks.items() if not ok]

if broken:
    print("Problems:\n  " + "\n  ".join(broken))
    sys.exit(1)
print(f"Links and Markdown coverage OK across {len(files)} files.")
