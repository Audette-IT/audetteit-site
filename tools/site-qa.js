// Browser QA for every page: horizontal overflow, CSP errors, JS errors and
// axe accessibility checks, at phone and desktop width in light and dark mode,
// plus the interactive bits (consent banner, mobile menu, floor-plan room
// picker, contact form validation, FAQ).
//
// Run the real Worker first, from the repo root:
//   npx wrangler@4 dev --port 8795 --ip 127.0.0.1
// then, from tools/:
//   npm install && node site-qa.js
//
// Screenshots land in tools/qa-out/ (git-ignored). Exits 1 if anything fails.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.env.QA_BASE || 'http://127.0.0.1:8795';
const OUT = path.join(__dirname, 'qa-out');
const axePath = require.resolve('axe-core/axe.min.js');

// Page list comes from wrangler.jsonc so new pages are checked automatically.
const wrangler = fs.readFileSync(path.join(__dirname, '..', 'wrangler.jsonc'), 'utf8');
const pages = JSON.parse(wrangler.match(/"run_worker_first"\s*:\s*(\[[^\]]*\])/)[1]);

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const launch = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};
  const b = await chromium.launch(launch);
  const R = { pages, overflow: [], axe: [], csp: [], errors: [] };

  for (const scheme of ['light', 'dark']) for (const [w, h] of [[390, 844], [1366, 900]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    p.on('console', m => { if (/Content Security Policy|Refused to/i.test(m.text())) R.csp.push(m.text().slice(0, 160)); });
    p.on('pageerror', e => R.errors.push(String(e)));
    for (const route of pages) {
      await p.goto(BASE + route, { waitUntil: 'load' });
      // Hide the cookie banner so it doesn't cover the screenshots.
      await p.evaluate(() => { try { localStorage.setItem('audetteit-consent', 'denied'); } catch (e) {} });
      await p.reload({ waitUntil: 'load' });
      const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (ov) R.overflow.push({ scheme, w, route, ov });
      const name = route === '/' ? 'home' : route.slice(1);
      await p.screenshot({ path: path.join(OUT, `${name}-${w}-${scheme}.png`), fullPage: true });
    }
    await ctx.close();
  }

  // axe is injected, so this pass bypasses the CSP.
  for (const scheme of ['light', 'dark']) {
    const ctx = await b.newContext({ viewport: { width: 1366, height: 900 }, colorScheme: scheme, bypassCSP: true });
    const p = await ctx.newPage();
    for (const route of pages) {
      await p.goto(BASE + route, { waitUntil: 'load' });
      await p.addScriptTag({ path: axePath });
      const v = await p.evaluate(async () => (await axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] },
      })).violations.map(x => x.id + ' :: ' + x.nodes.slice(0, 2).map(n => n.target.join(' ')).join(' | ')));
      if (v.length) R.axe.push({ scheme, route, v });
    }
    await ctx.close();
  }

  // Interactions at phone width.
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto(BASE + '/', { waitUntil: 'load' });
  R.bannerShown = await p.isVisible('section.consent');
  await p.click('[data-consent="denied"]');
  R.menuHiddenBefore = !(await p.isVisible('#primary-nav a[href="/services"]'));
  await p.click('.menu-toggle');
  R.menuOpen = await p.isVisible('#primary-nav a[href="/services"]');
  await p.click('.menu-toggle');
  await p.click('.room-pin[data-room="kids"]');
  R.room = await p.textContent('#room-name');
  await p.goto(BASE + '/contact', { waitUntil: 'load' });
  await p.click('#contact-form button[type=submit]');
  R.formError = await p.textContent('#form-error');
  await p.goto(BASE + '/how-it-works', { waitUntil: 'load' });
  await p.click('.faq summary >> nth=2');
  R.faqOpen = await p.isVisible('.faq details:nth-child(3) p');
  await b.close();

  console.log(JSON.stringify(R, null, 1));
  const ok = !R.overflow.length && !R.axe.length && !R.csp.length && !R.errors.length &&
    R.bannerShown && R.menuHiddenBefore && R.menuOpen && R.room && R.formError && R.faqOpen;
  console.log(ok ? 'QA passed.' : 'QA FAILED.');
  process.exit(ok ? 0 : 1);
})();
