// Renders the link-preview image (public/assets/share.png, 1200x630) from
// tools/share-image.html. The owner picked draft B, the floor plan (GitHub #77).
//   cd tools && npm install && node render-share-image.js [a|b|c]
// Google Fonts is blocked in cloud sessions, so the Red Hat fonts are loaded
// from the @fontsource npm packages (SIL OFL) instead.
const { chromium } = require('playwright');
const path = require('path');

const card = (process.argv[2] || 'b').toLowerCase();
const out = path.join(__dirname, '..', 'public', 'assets', 'share.png');
const font = (pkg, file) => 'file://' + path.join(__dirname, 'node_modules', '@fontsource', pkg, 'files', file);
const faces = [
  ['Red Hat Display', 'red-hat-display', [500, 700, 900]],
  ['Red Hat Text', 'red-hat-text', [400, 500, 700]],
].flatMap(([family, pkg, weights]) => weights.map(w =>
  `@font-face { font-family: "${family}"; font-weight: ${w}; src: url("${font(pkg, `${pkg}-latin-${w}-normal.woff2`)}") format("woff2"); }`)).join('\n');

(async () => {
  const launch = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};
  const browser = await chromium.launch(launch);
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto('file://' + path.join(__dirname, 'share-image.html'));
  await page.addStyleTag({ content: faces });
  // Show only the chosen card, at the top-left corner, unscaled.
  await page.evaluate(id => {
    const c = document.getElementById(id);
    document.body.replaceChildren(c);
    document.body.style.cssText = 'margin:0;background:#FFFFFF';
    c.style.cssText = 'position:static;transform:none';
  }, 'card-' + card);
  await page.evaluate(() => document.fonts.ready);
  const missing = await page.evaluate(() => ['900 20px "Red Hat Display"', '400 20px "Red Hat Text"'].filter(f => !document.fonts.check(f)));
  if (missing.length) throw new Error('Fonts did not load: ' + missing.join(', '));
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  console.log('Wrote ' + out + ' (card ' + card.toUpperCase() + ')');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
