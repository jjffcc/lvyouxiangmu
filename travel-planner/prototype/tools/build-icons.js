// Vendor selected, unmodified Tabler outline icons for an offline-capable UI.
// Run only when updating the local icon bundle; the website needs no build step.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const version = '3.48.0';
const names = [
  'luggage', 'route', 'compass', 'map-pin', 'map', 'tools-kitchen-2',
  'book', 'clipboard-text', 'ticket', 'coins', 'users', 'checklist',
  'sun', 'photo', 'settings', 'plus', 'copy', 'star', 'sparkles',
  'arrows-exchange', 'lock', 'lock-open', 'arrow-up', 'arrow-down',
  'history', 'git-compare', 'check', 'crosshair', 'navigation',
  'arrow-left', 'upload', 'edit', 'clipboard', 'file-type-pdf', 'x',
  'device-floppy', 'receipt', 'receipt-refund', 'circle-check',
  'user-plus', 'user-minus', 'shield-lock', 'template', 'calendar',
  'cloud-rain', 'ban', 'refresh', 'download', 'share', 'trash',
  'adjustments-horizontal', 'bell', 'building-bank', 'mountain',
  'fish', 'world', 'building', 'train', 'car', 'bus', 'walk', 'plane',
  'calendar-event', 'coffee', 'soup', 'moon', 'cookie', 'layout-grid',
  'pepper', 'leaf', 'mood-kid', 'package', 'arrow-right', 'search',
  'info-circle', 'file-description', 'sunrise', 'sunset', 'sailboat',
  'stairs', 'plant', 'clock', 'printer'
];

async function main() {
  const icons = {};
  let archive = null;
  if (process.argv[2]) {
    const reader = 'import json,sys,tarfile; t=tarfile.open(sys.argv[1]); names=json.loads(sys.argv[2]); result={n:t.extractfile("package/icons/outline/"+n+".svg").read().decode("utf-8") for n in names}; result["LICENSE"]=t.extractfile("package/LICENSE").read().decode("utf-8"); print(json.dumps(result))';
    archive = JSON.parse(execFileSync('python', ['-c', reader, process.argv[2], JSON.stringify(names)], { encoding: 'utf8' }));
  }
  let cursor = 0;
  async function worker() {
    while (cursor < names.length) {
      const name = names[cursor++];
      const url = `https://raw.githubusercontent.com/tabler/tabler-icons/v${version}/icons/outline/${name}.svg`;
      let svg;
      if (archive) svg = archive[name];
      else {
        const res = await fetch(url, { signal: AbortSignal.timeout(25000) });
        if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
        svg = await res.text();
      }
      const body = svg.match(/<svg\b[^>]*>([\s\S]*?)<\/svg>/);
      if (!body) throw new Error(`Invalid SVG: ${name}`);
      icons[name] = body[1].trim();
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));
  let license;
  if (archive) license = archive.LICENSE;
  else {
    const licenseRes = await fetch(`https://raw.githubusercontent.com/tabler/tabler-icons/v${version}/LICENSE`, {
      signal: AbortSignal.timeout(25000)
    });
    if (!licenseRes.ok) throw new Error(`License: HTTP ${licenseRes.status}`);
    license = await licenseRes.text();
  }
  const sorted = Object.fromEntries(names.map(name => [name, icons[name]]));
  const js = `/* Tabler Icons v${version}, MIT. See TABLER-LICENSE.txt. */\n` +
    `(function () {\n  "use strict";\n  window.TravelIcons = ${JSON.stringify(sorted)};\n` +
    `  window.travelIcon = function (name) {\n` +
    `    var body = window.TravelIcons[name] || window.TravelIcons['arrow-right'];\n` +
    `    return '<svg class="ui-icon" data-icon="' + (window.TravelIcons[name] ? name : 'arrow-right') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + body + '</svg>';\n` +
    `  };\n})();\n`;
  const assets = path.join(__dirname, '..', 'assets');
  fs.writeFileSync(path.join(assets, 'icons.js'), js, 'utf8');
  fs.writeFileSync(path.join(assets, 'TABLER-LICENSE.txt'), license, 'utf8');
  console.log(`Saved ${names.length} Tabler icons v${version} and MIT license.`);
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
