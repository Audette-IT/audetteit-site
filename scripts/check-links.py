"""Fail if any page links to an internal path or asset that doesn't exist in public/.

Clean URLs (/services) map to public/services.html; "/" maps to public/index.html.
"""
import pathlib
import re
import sys

PUBLIC = pathlib.Path(__file__).resolve().parent.parent / "public"
ATTR = re.compile(r'(?:href|src)="([^"#?]+)"')

def target_exists(ref: str) -> bool:
    path = ref.lstrip("/")
    if path == "":
        return (PUBLIC / "index.html").exists()
    candidate = PUBLIC / path
    return candidate.is_file() or candidate.with_suffix(".html").is_file()

broken = []
for page in sorted(PUBLIC.glob("*.html")):
    for ref in ATTR.findall(page.read_text()):
        if ref.startswith(("http://", "https://", "mailto:", "tel:", "data:")):
            continue
        if not target_exists(ref):
            broken.append(f"{page.name}: {ref}")

if broken:
    print("Broken internal links:\n  " + "\n  ".join(broken))
    sys.exit(1)
print(f"Internal links OK across {len(list(PUBLIC.glob('*.html')))} pages.")
