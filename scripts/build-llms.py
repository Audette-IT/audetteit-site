"""Build public/llms-full.txt from the per-page Markdown files.

Run after editing any public/*.md page. `--check` exits non-zero if the
committed file is stale (CI uses this).
"""
import pathlib
import sys

PUBLIC = pathlib.Path(__file__).resolve().parent.parent / "public"
OUT = PUBLIC / "llms-full.txt"
PAGES = [
    ("index.md", "https://audetteit.com/"),
    ("services.md", "https://audetteit.com/services"),
    ("contact.md", "https://audetteit.com/contact"),
    ("privacy.md", "https://audetteit.com/privacy"),
]

HEADER = """# Audette IT — full site content

> Every page of audetteit.com in one file, for AI agents and anyone who wants plain text. Generated from the per-page Markdown files; the HTML pages are the canonical versions.

## How this site serves Markdown

- Each page has a Markdown twin: `/` is `/index.md`, `/services` is `/services.md`, and so on.
- Requesting any page URL with `Accept: text/markdown` returns the same Markdown with `Content-Type: text/markdown`. Those responses send `Vary: Accept`.
- Markdown responses carry a `Link: <...>; rel="canonical"` header pointing at the HTML page.
- Index of pages: https://audetteit.com/llms.txt
- XML sitemap: https://audetteit.com/sitemap.xml
"""


def shift_headings(md: str) -> str:
    """Demote every heading one level so each page nests under its own H2."""
    lines = []
    for line in md.splitlines():
        lines.append("#" + line if line.startswith("#") else line)
    return "\n".join(lines)


def build() -> str:
    parts = [HEADER]
    for name, url in PAGES:
        body = (PUBLIC / name).read_text().strip()
        parts.append(f"---\n\nSource: {url}\n\n{shift_headings(body)}\n")
    return "\n".join(parts)


if __name__ == "__main__":
    content = build()
    if "--check" in sys.argv:
        if not OUT.exists() or OUT.read_text() != content:
            print("public/llms-full.txt is stale: run python3 scripts/build-llms.py")
            sys.exit(1)
        print("llms-full.txt is up to date.")
    else:
        OUT.write_text(content)
        print(f"Wrote {OUT.relative_to(PUBLIC.parent)}")
