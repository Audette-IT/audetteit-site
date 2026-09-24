// Re-render every icon from the master logo, public/assets/logo.svg.
// Run after changing the logo, from tools/:  npm install && node render-icons.js
//
// Writes (sizes and padding match what is live):
//   public/assets/favicon-16.png, favicon-32.png   transparent, no padding
//   public/assets/faviconlogo.png                  192px, transparent (web manifest)
//   public/assets/logo-mark.png                    512px, transparent (Open Graph image)
//   public/assets/apple-touch-icon.png             180px on white
//   public/favicon.ico                             16 + 32 + 48px, PNG entries
// and hand-off files for the owner in tools/qa-out/logo/:
//   mark-1024.png, logo-1000x1100.png (full shield, native 40:44 aspect)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ASSETS = path.join(ROOT, 'public', 'assets');
const HANDOFF = path.join(__dirname, 'qa-out', 'logo');
const svg = fs.readFileSync(path.join(ASSETS, 'logo.svg'), 'utf8');

// An .ico file whose entries are plain PNGs (supported by every current browser).
function ico(pngs) {
  const header = Buffer.alloc(6 + 16 * pngs.length);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    header.writeUInt8(size >= 256 ? 0 : size, e); header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt8(0, e + 2); header.writeUInt8(0, e + 3);
    header.writeUInt16LE(1, e + 4); header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(data.length, e + 8); header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...pngs.map(p => p.data)]);
}

(async () => {
  fs.mkdirSync(HANDOFF, { recursive: true });
  const launch = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};
  const b = await chromium.launch(launch);

  // Square icon: the 40x44 shield centered on an s x s canvas, `pad` of the height on each side.
  const square = async (s, bg, pad) => {
    const p = await (await b.newContext({ viewport: { width: s, height: s } })).newPage();
    const h = Math.round(s * (1 - 2 * pad)), w = Math.round(h * 40 / 44);
    await p.setContent(`<html><body style="margin:0;width:${s}px;height:${s}px;display:grid;place-items:center;background:${bg}">${svg.replace('width="40" height="44"', `width="${w}" height="${h}"`)}</body></html>`);
    return p.screenshot({ omitBackground: bg === 'transparent', clip: { x: 0, y: 0, width: s, height: s } });
  };

  const mark = {};
  for (const s of [16, 32, 48, 192, 512, 1024]) mark[s] = await square(s, 'transparent', s <= 48 ? 0 : 0.04);
  fs.writeFileSync(path.join(ASSETS, 'favicon-16.png'), mark[16]);
  fs.writeFileSync(path.join(ASSETS, 'favicon-32.png'), mark[32]);
  fs.writeFileSync(path.join(ASSETS, 'faviconlogo.png'), mark[192]);
  fs.writeFileSync(path.join(ASSETS, 'logo-mark.png'), mark[512]);
  fs.writeFileSync(path.join(ASSETS, 'apple-touch-icon.png'), await square(180, '#FFFFFF', 0.12));
  fs.writeFileSync(path.join(ROOT, 'public', 'favicon.ico'), ico([16, 32, 48].map(size => ({ size, data: mark[size] }))));
  fs.writeFileSync(path.join(HANDOFF, 'mark-1024.png'), mark[1024]);

  const p = await (await b.newContext({ viewport: { width: 1000, height: 1100 } })).newPage();
  await p.setContent(`<html><body style="margin:0">${svg.replace('width="40" height="44"', 'width="1000" height="1100"')}</body></html>`);
  fs.writeFileSync(path.join(HANDOFF, 'logo-1000x1100.png'), await p.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: 1000, height: 1100 } }));
  await b.close();
  console.log('Icons written to public/assets/ and public/favicon.ico; owner hand-off files in tools/qa-out/logo/.');
})();
