// Renders the Audette IT desktop/phone/tablet wallpapers: draft B, "the mark"
// (the owner's pick, 2026-09-26; drafts in tools/wallpaper.html).
//   cd tools && npm install && node render-wallpaper.js
// Writes brand/wallpapers/<device>/audette-it-<name>-<w>x<h>-<light|dark>.png
// (42 files: 21 sizes x light/dark). Fonts come from @fontsource
// (Google Fonts is blocked in cloud sessions).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'brand', 'wallpapers');
const logo = fs.readFileSync(path.join(ROOT, 'public', 'assets', 'logo.svg'), 'utf8')
  .replace(' role="img" aria-label="Audette IT"', ' aria-hidden="true"');
const font = (pkg, w) => 'file://' + path.join(__dirname, 'node_modules', '@fontsource', pkg, 'files', `${pkg}-latin-${w}-normal.woff2`);
const faces = [['Red Hat Display', 'red-hat-display', [900]], ['Red Hat Text', 'red-hat-text', [400]]]
  .flatMap(([f, pkg, ws]) => ws.map(w => `@font-face{font-family:"${f}";font-weight:${w};src:url("${font(pkg, w)}") format("woff2")}`)).join('\n');

// [folder, name, width, height]
const SIZES = [
  ['desktop', 'hd', 1920, 1080], ['desktop', 'qhd', 2560, 1440], ['desktop', '4k', 3840, 2160],
  ['desktop', '5k', 5120, 2880], ['desktop', 'laptop', 1366, 768],
  ['desktop', '16x10', 1920, 1200], ['desktop', '16x10-large', 2560, 1600],
  ['mac', 'macbook-air-13', 2560, 1664], ['mac', 'macbook-air-15', 2880, 1864],
  ['mac', 'macbook-pro-14', 3024, 1964], ['mac', 'macbook-pro-16', 3456, 2234],
  ['ultrawide', 'uwqhd', 3440, 1440], ['ultrawide', 'super-ultrawide', 5120, 1440],
  ['phone', 'iphone', 1179, 2556], ['phone', 'iphone-max', 1320, 2868],
  ['phone', 'android', 1080, 2400], ['phone', 'android-qhd', 1440, 3200],
  ['tablet', 'ipad', 1640, 2360], ['tablet', 'ipad-pro-11', 1668, 2420],
  ['tablet', 'ipad-pro-13', 2064, 2752], ['tablet', 'android-tablet', 1600, 2560],
];
const THEMES = {
  light: { bg: '#F2F4F6', fg: '#1A1E23', soft: '#545D66', rule: '#1A1E23' },
  dark: { bg: '#111418', fg: '#ECEFF2', soft: '#A7B0B9', rule: '#ECEFF2' },
};

function html(w, h, t) {
  const s = Math.min(w, h) / 1080;            // design scale: 1080 px short side = 1
  const portrait = h > w;
  // Keep clear of the dock/taskbar (landscape) and the lock-screen clock (portrait).
  const shift = portrait ? Math.round(h * 0.04) : -Math.round(30 * s);
  return `<!doctype html><meta charset="utf-8"><style>${faces}
  html,body{margin:0}
  .wp{width:${w}px;height:${h}px;background:${t.bg};color:${t.fg};display:flex;flex-direction:column;align-items:center;justify-content:center;transform:translateY(${shift}px)}
  .wp svg{width:${220 * s}px;height:${242 * s}px}
  .rule{width:${360 * s}px;border-top:${Math.max(2, Math.round(4 * s))}px solid ${t.rule};margin:${44 * s}px 0 ${30 * s}px}
  b{font:900 ${72 * s}px/1 "Red Hat Display",sans-serif;letter-spacing:-0.03em}
  span{margin-top:${16 * s}px;font:400 ${26 * s}px/1.2 "Red Hat Text",sans-serif;color:${t.soft}}
  </style><body style="background:${t.bg}"><div class="wp">${logo}<div class="rule"></div><b>Audette IT</b><span>Tech help for every room</span></div>`;
}

(async () => {
  const launch = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};
  const browser = await chromium.launch(launch);
  const files = [];
  for (const [dir, name, w, h] of SIZES) {
    for (const [theme, t] of Object.entries(THEMES)) {
      const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
      // Load from a file:// URL so the page may read the local @fontsource files.
      const tmp = path.join(__dirname, '.wallpaper-tmp.html');
      fs.writeFileSync(tmp, html(w, h, t));
      await page.goto('file://' + tmp);
      await page.evaluate(() => document.fonts.ready);
      const ok = await page.evaluate(() => document.fonts.check('900 20px "Red Hat Display"') && document.fonts.check('400 20px "Red Hat Text"'));
      if (!ok) throw new Error('Red Hat fonts did not load (run npm install in tools/)');
      const file = path.join(OUT, dir, `audette-it-${name}-${w}x${h}-${theme}.png`);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      await page.screenshot({ path: file, clip: { x: 0, y: 0, width: w, height: h } });
      files.push(path.relative(OUT, file));
      await page.close();
    }
  }
  fs.rmSync(path.join(__dirname, '.wallpaper-tmp.html'), { force: true });
  await browser.close();
  console.log(`Wrote ${files.length} wallpapers to ${path.relative(ROOT, OUT)}/`);
})().catch(e => { console.error(e); process.exit(1); });
