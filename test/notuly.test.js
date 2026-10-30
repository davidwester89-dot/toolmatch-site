// Notuly als 5e tool op /ai-notuleren/ (30-10, MM-OK): gewone link, alfabetische plek, datums L7, niet in de keuzehulp.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { TOOLS } from '../js/lib/tools.js';
import { match, VRAGEN } from '../js/lib/match.js';

const html = readFileSync('ai-notuleren/index.html', 'utf8');

test('Notuly: gewone link naar notuly.nl, geen sponsored en geen partnerzin op de pagina', () => {
  const links = [...html.matchAll(/<a\s[^>]*href="https:\/\/notuly\.nl\/[^"]*"[^>]*>/g)].map((m) => m[0]);
  assert.ok(links.length >= 3, 'knop + 2 bronnen');
  for (const l of links) { assert.match(l, /rel="noopener"/); assert.doesNotMatch(l, /sponsored|nofollow|data-cta="partner"/); }
  assert.doesNotMatch(html, /class="pnoot"/);
  assert.doesNotMatch(html, /rel="[^"]*sponsored/);
});

test('Notuly: 5 tools in kaarten, tabel en ItemList, alfabetisch (nl)', () => {
  const kaarten = [...html.matchAll(/<article class="res tool" id="([^"]+)">/g)].map((m) => m[1]);
  assert.deepEqual(kaarten, ['amberscript', 'notta', 'notuly', 'otter', 'tldv']);
  const rijen = [...html.matchAll(/<tr><th scope="row"><a href="#([^"]+)">/g)].map((m) => m[1]);
  assert.deepEqual(rijen, kaarten);
  const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const il = ld['@graph'].find((g) => g['@type'] === 'ItemList');
  assert.equal(il.itemListElement.length, 5);
  assert.deepEqual(il.itemListElement.map((x) => x.position), [1, 2, 3, 4, 5]);
  const namen = il.itemListElement.map((x) => x.name);
  assert.deepEqual([...namen].sort(new Intl.Collator('nl', { sensitivity: 'base' }).compare), namen);
});

test('Notuly: prijzen en hosting zoals op notuly.nl (30-10), standaardprijs eerst, alleen euro', () => {
  const t = TOOLS.find((x) => x.id === 'notuly');
  assert.equal(t.prijs, 'Pro: €13,49 per gebruiker per maand bij maandelijks betalen, €9,99 per maand bij jaarbetaling (€119,88 per jaar), incl. btw');
  assert.equal(t.prijsMaand, 13.49);
  assert.equal(Math.round(9.99 * 12 * 100) / 100, 119.88);
  assert.equal(t.eu, 'ja'); assert.equal(t.dpa, 'team'); assert.equal(t.gratis, true);
  assert.match(html, /gecontroleerd op 30 oktober 2026<\/p>/);
  const kaart = html.slice(html.indexOf('id="notuly"'), html.indexOf('</article>', html.indexOf('id="notuly"')));
  assert.doesNotMatch(kaart, /\$|USD|dollar/i);
});

test('L7 30-10: ai-notuleren dateModified, sitemap-lastmod en zichtbaar bijgewerkt op 30 oktober 2026', () => {
  assert.match(html, /"dateModified": "2026-10-30"/);
  assert.match(html, /<p class="note">Redactie ToolMatch · gecontroleerd op 20 oktober 2026, bijgewerkt op 30 oktober 2026/);
  assert.ok(readFileSync('sitemap.xml', 'utf8').includes('<loc>https://toolmatch.nl/ai-notuleren/</loc><lastmod>2026-10-30</lastmod>'));
});

test('Notuly zit niet in de keuzehulp (doelen leeg): geen enkele uitkomst bevat notuly', () => {
  assert.deepEqual(TOOLS.find((x) => x.id === 'notuly').doelen, []);
  const ks = Object.keys(VRAGEN);
  (function rec(i, a) {
    if (i === ks.length) { assert.ok(!match(a).some((r) => r.tool.id === 'notuly')); return; }
    for (const v of VRAGEN[ks[i]]) rec(i + 1, { ...a, [ks[i]]: v });
  })(0, {});
  assert.doesNotMatch(readFileSync('keuzehulp/index.html', 'utf8'), /Notuly/);
});

test('Notuly: kaart noemt de limiet van het gratis plan (3 gesprekken, max. 60 minuten per opname; notuly.nl/prijzen 30-10)', () => {
  const kaart = html.split('<article class="res tool" id="notuly">')[1].split('</article>')[0];
  assert.match(kaart, /gratis voor 3 gesprekken per maand \(max\. 60 minuten per opname\)\./);
});
