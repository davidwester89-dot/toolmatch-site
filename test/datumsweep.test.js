// Datumsweep 30-10: datums op een pagina spreken elkaar niet tegen (intro, kaarten, bronnenlijst, byline).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const pages = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    if (['node_modules', '.git', '_site', 'scripts', 'test'].includes(f)) continue;
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p); else if (f === 'index.html') pages.push(p);
  }
})('.');
const read = (p) => readFileSync(p, 'utf8');

test('datumsweep: geen algemene "nagelezen op 26 oktober" meer voor alle prijzen', () => {
  for (const p of pages) {
    const h = read(p);
    assert.doesNotMatch(h, /Nagelezen op 26 oktober 2026/, p);
    assert.doesNotMatch(h, /de prijzen hebben we op 26 oktober 2026 opnieuw nagelezen/, p);
  }
});

test('datumsweep: een kaart met een later bekeken bron noemt die datum, net als de bronnenlijst', () => {
  let n = 0;
  for (const p of pages) {
    const h = read(p);
    const lijst = h.split('<ul class="bronnen">')[1]?.split('</ul>')[0] || '';
    const laat = new Map([...lijst.matchAll(/<a href="([^"]+)"[^>]*>[^<]*<\/a>, NL-pagina van de aanbieder, bekeken op (\d+ oktober 2026)<\/li>/g)].map((m) => [m[1], m[2]]));
    for (const kaart of h.split('<article class="res tool"').slice(1)) {
      const src = kaart.split('<p class="src">')[1]?.split('</p>')[0];
      if (!src) continue;
      const kaartdatum = src.match(/gecontroleerd op (\d+ oktober 2026)/)[1];
      const urls = [...src.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
      const later = [...new Set(urls.filter((u) => laat.has(u) && laat.get(u) !== kaartdatum).map((u) => laat.get(u)))];
      if (later.length) { n++; assert.ok(src.includes('Nederlandse prijspagina bekeken op ' + later[0]), p + ' ' + urls[0]); }
      else assert.doesNotMatch(src, /Nederlandse prijspagina bekeken op/, p + ' ' + urls[0]);
    }
  }
  assert.equal(n, 5, 'Workspace (2x), Notta en DeepL (2x)');
});

test('datumsweep: intro en byline noemen dezelfde controledatum (gids wat-kosten, keuzehulp)', () => {
  for (const p of ['gids/wat-kosten-ai-abonnementen/index.html', 'keuzehulp/index.html']) {
    const h = read(p);
    const intro = h.match(/<p>Gecontroleerd op (\d+ oktober 2026); de europrijzen van ([^<]+) hebben we op 26 oktober 2026 nagelezen op hun Nederlandse prijspagina\./);
    assert.ok(intro, p + ' intro');
    const by = h.match(/<p class="note">Redactie ToolMatch · [^<]*gecontroleerd op (\d+ oktober 2026)/);
    assert.equal(intro[1], by[1], p);
  }
});
