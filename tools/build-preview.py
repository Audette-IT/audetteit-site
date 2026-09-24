"""Bundle every page into one self-contained HTML file for a Claude Artifact preview.

The owner reviews designs as a private Artifact (a link that opens in the Claude
app), not on the Cloudflare preview. This inlines site.css, site.js and the logo,
turns the page links into in-page tabs, and leaves out GTM and the cookie banner
so the preview sends no analytics. The live site is not affected.

Usage, from the repo root:
    python3 tools/build-preview.py [output.html]
Default output: tools/qa-out/preview.html. Publish that file with the Artifact tool
(republish to the same URL, https://claude.ai/artifact/A279VNAj3QAxTAv9axKF2x,
to keep the link the owner already has).
"""
import base64
import json
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
out_path = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "tools" / "qa-out" / "preview.html"

# Page order and routes come from wrangler.jsonc, like the Worker's.
wrangler = (ROOT / "wrangler.jsonc").read_text()
routes = json.loads(re.search(r'"run_worker_first"\s*:\s*(\[[^\]]*\])', wrangler).group(1))
pages = [("index" if r == "/" else r.strip("/"), "home" if r == "/" else r.strip("/")) for r in routes]
anchor = {r: "#" + key for r, (_, key) in zip(routes, pages)}

branch = subprocess.run(["git", "rev-parse", "--abbrev-ref", "HEAD"], cwd=ROOT, capture_output=True, text=True).stdout.strip()
commit = subprocess.run(["git", "rev-parse", "--short", "HEAD"], cwd=ROOT, capture_output=True, text=True).stdout.strip()

# Artifacts can be switched to light or dark by the viewer, so the dark tokens
# also need a [data-theme] copy, and the media query must yield to an explicit light choice.
css = (PUBLIC / "css" / "site.css").read_text()
m = re.search(r"@media \(prefers-color-scheme: dark\) \{\n  :root \{(.*?)\n  \}\n\}", css, re.S)
dark = m.group(1)
css = css.replace(m.group(0),
    '@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {' + dark + "\n  }\n}\n"
    ':root[data-theme="dark"] {' + dark + "\n}")
js = (PUBLIC / "js" / "site.js").read_text()
logo = "data:image/svg+xml;base64," + base64.b64encode((PUBLIC / "assets" / "logo.svg").read_bytes()).decode()


def fix(h):
    h = re.sub(r'href="(/[a-z-]*)"', lambda m: f'href="{anchor.get(m.group(1), m.group(1))}"', h)
    return h.replace('src="/assets/logo.svg"', f'src="{logo}"')


home = (PUBLIC / "index.html").read_text()
header = fix(re.search(r'<header class="site">.*?</header>', home, re.S).group(0)).replace(' aria-current="page"', "")
footer = fix(re.search(r'<footer class="site">.*?</footer>', home, re.S).group(0))
footer = footer.replace('<button type="button" class="linklike" data-cookie-settings>Cookie settings</button>',
                        "<span>Cookie settings (live site only)</span>")
mains = ""
for f, key in pages:
    html = (PUBLIC / f"{f}.html").read_text()
    body = re.search(r'<main id="main-content">\n(.*?)</main>', html, re.S).group(1)
    label = re.search(r"<title>(.*?)</title>", html).group(1)
    hidden = "" if key == "home" else " hidden"
    mains += f'<section class="pv-page" data-page="{key}" aria-label="{label}"{hidden}>\n{fix(body)}</section>\n'

out = f"""<title>Audette IT Room Guide</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@500;700;900&family=Red+Hat+Text:wght@400;500;700&display=swap">
<style>
{css}
.pv-bar {{ background: var(--mark); color: var(--mark-ink); font: 700 0.85rem/1.4 "Red Hat Text", system-ui, sans-serif; padding: 8px 16px; text-align: center; }}
</style>
<div class="pv-bar">Preview of <code>{branch}</code> (commit {commit}). Use the menu to switch pages.</div>
{header}
<main id="main-content">
{mains}</main>
{footer}
<script>
{js}
(function () {{
  var pages = document.querySelectorAll('.pv-page');
  var navLinks = document.querySelectorAll('header.site a[href^="#"]');
  function show() {{
    var key = (location.hash || '#home').slice(1);
    if (!document.querySelector('.pv-page[data-page="' + key + '"]')) key = 'home';
    pages.forEach(function (p) {{ p.hidden = p.getAttribute('data-page') !== key; }});
    navLinks.forEach(function (a) {{
      if (a.getAttribute('href') === '#' + key) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    }});
    var t = document.querySelector('header.site .menu-toggle');
    if (t && t.getAttribute('aria-expanded') === 'true') t.click();
    window.scrollTo(0, 0);
  }}
  document.addEventListener('click', function (e) {{
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var key = a.getAttribute('href').slice(1);
    if (!document.querySelector('.pv-page[data-page="' + key + '"]')) return;
    e.preventDefault();
    location.hash = key; show();
  }});
  window.addEventListener('hashchange', show);
  show();
}})();
</script>
"""
out_path.parent.mkdir(parents=True, exist_ok=True)
out_path.write_text(out)
print(f"Wrote {out_path} ({len(out):,} bytes, {len(pages)} pages, {branch} @ {commit})")
