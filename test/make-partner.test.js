// Make-partnerlink (direct programma, /en/register?pc=toolmatch) op drie plekken.
// Bronlinks naar make.com blijven gewoon. De volgorde en de matchscores hangen niet van de partnerlink af.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { match, VRAGEN } from '../js/lib/match.js';
import { TOOLS } from '../js/lib/tools.js';
import { uitgaand, metNoot, PARTNERLINKS, PARTNER_NOOT } from '../js/lib/partnerlinks.js';

const MAKE = 'https://www.make.com/en/register?pc=toolmatch';
const NOOT = 'Sommige links zijn partnerlinks; dat verandert de volgorde nooit.';
const REL = 'sponsored nofollow noopener';
const vs = readFileSync('vergelijken/zapier-vs-make-vs-n8n/index.html', 'utf8');
const auto = readFileSync('automatiseren-zonder-code/index.html', 'utf8');
const kh = readFileSync('keuzehulp/index.html', 'utf8');
const sm = readFileSync('sitemap.xml', 'utf8');

function paginas() {
  const out = [];
  (function walk(d) {
    for (const f of readdirSync(d)) {
      if (['node_modules', '.git', '_site', 'scripts', 'test'].includes(f)) continue;
      const p = join(d, f);
      if (statSync(p).isDirectory()) walk(p);
      else if (f.endsWith('.html')) out.push(p);
    }
  })('.');
  return out;
}

test('Make-partnerlink: href en rel op de vergelijking, de categoriepagina en de keuzehulp', () => {
  assert.equal(PARTNERLINKS.make, MAKE);
  assert.deepEqual(Object.keys(PARTNERLINKS).sort(), ['make']);
  assert.equal(PARTNER_NOOT, NOOT);

  const knop = vs.match(/<p class="go"><a class="btn ghost" href="([^"]*)" rel="([^"]*)" target="_blank" data-vendor="make" data-cta="partner" aria-label="([^"]*)">([^<]*)<\/a><\/p>\n      <p class="pnoot">([^<]*)<\/p>/);
  assert.ok(knop, 'Make-knop naast het advies niet gevonden');
  assert.equal(knop[1], MAKE);
  assert.equal(knop[2], REL);
  assert.equal(knop[3], 'Naar de site van Make (opent in een nieuw tabblad)');
  assert.equal(knop[4], 'Naar de site van Make');
  assert.equal(knop[5], NOOT);
  assert.equal(vs.split(MAKE).length - 1, 1, 'trackinglink één keer op de vergelijking');
  assert.equal(vs.split('class="pnoot"').length - 1, 1);
  assert.match(vs, /href="https:\/\/www\.make\.com\/en\/pricing" rel="noopener">Make Pricing<\/a>/);
  assert.match(vs, /href="https:\/\/www\.make\.com\/en\/compare\/make-vs-zapier" rel="noopener">Make vs Zapier \(Make\)<\/a>/);
  assert.doesNotMatch(vs, /make\.com\/en\/(?:pricing|compare)[^"]*" rel="[^"]*sponsored/);

  const tekst = auto.match(/<a href="([^"]*)" rel="([^"]*)" target="_blank" data-cta="partner" aria-label="([^"]*)">([^<]*)<\/a><\/p>\n      <p class="pnoot">([^<]*)<\/p>/);
  assert.ok(tekst, 'tekstlink Naar Make niet gevonden');
  assert.equal(tekst[1], MAKE);
  assert.equal(tekst[2], REL);
  assert.equal(tekst[3], 'Naar Make (opent in een nieuw tabblad)');
  assert.equal(tekst[4], 'Naar Make');
  assert.equal(tekst[5], NOOT);
  assert.equal(auto.split(MAKE).length - 1, 1);
  assert.equal(auto.split('class="pnoot"').length - 1, 1);
  assert.match(auto, /Make staat hier niet als kaart: de prijs konden we op de prijspagina niet controleren/);
  assert.doesNotMatch(auto, /<article class="res tool" id="make">/);
  assert.doesNotMatch(auto, /class="btn[^"]*"[^>]*data-vendor="make"/);

  const make = TOOLS.find((t) => t.id === 'make');
  assert.equal(make.url, 'https://www.make.com/');
  const o = uitgaand(make);
  assert.equal(o.href, MAKE);
  assert.equal(o.rel, REL);
  assert.equal(o.partner, true);
  const src = readFileSync('js/keuzehulp.js', 'utf8');
  assert.match(src, /const o = uitgaand\(t\);/);
  assert.match(src, /href="\$\{esc\(o\.href\)\}" rel="\$\{o\.rel\}"/);
  assert.match(src, /metNoot\(`<div class="results">\$\{res\.map\(kaart\)\.join\(''\)\}<\/div>`\)/);
  const res = match({ doel: 'automatiseren' });
  const blok = metNoot(`<div class="results">${res.map((r) => {
    const link = uitgaand(r.tool);
    return `<p class="go"><a class="btn" href="${link.href}" rel="${link.rel}" target="_blank" data-vendor="${r.tool.id}" data-cta="${link.partner ? 'partner' : 'outbound'}">Naar de site van ${r.tool.naam}</a></p>`;
  }).join('')}</div>`);
  assert.match(blok, new RegExp(`href="${MAKE.replace(/[?]/g, '\\?')}" rel="${REL}"`));
  assert.equal(blok.split(NOOT).length - 1, 1);
  assert.ok(blok.endsWith(`<p class="pnoot">${NOOT}</p>`));
  assert.match(blok, /href="https:\/\/zapier\.com\/" rel="noopener"/);
  assert.match(blok, /href="https:\/\/n8n\.io\/" rel="noopener"/);
  assert.doesNotMatch(kh, /pc=toolmatch/);

  const elders = paginas().filter((p) => !p.endsWith('vergelijken/zapier-vs-make-vs-n8n/index.html') && !p.endsWith('automatiseren-zonder-code/index.html'));
  for (const p of elders) assert.doesNotMatch(readFileSync(p, 'utf8'), /pc=toolmatch/, p);
});

test('Make-partnerlink: volgorde en datums blijven', () => {
  const koppen = [...vs.matchAll(/<th scope="col">(?:<img[^>]*>)?([^<]*)<\/th>/g)].map((m) => m[1]);
  assert.deepEqual(koppen, ['Gecontroleerd op 20 oktober 2026', 'Zapier', 'Make', 'n8n']);
  assert.deepEqual([...auto.matchAll(/<article class="res tool" id="([^"]+)">/g)].map((m) => m[1]), ['n8n', 'powerautomate', 'zapier']);
  const il = JSON.parse(auto.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'].find((n) => n['@type'] === 'ItemList');
  assert.deepEqual(il.itemListElement.map((x) => x.name), ['n8n', 'Power Automate', 'Zapier']);

  assert.deepEqual(match({ doel: 'automatiseren' }).map((r) => r.tool.id), ['zapier', 'make', 'n8n', 'powerautomate']);
  const alle = () => {
    const out = []; const ks = Object.keys(VRAGEN);
    (function rec(i, a) { if (i === ks.length) return out.push({ ...a }); for (const v of VRAGEN[ks[i]]) rec(i + 1, { ...a, [ks[i]]: v }); })(0, {});
    return out;
  };
  const volgorde = () => alle().map((a) => match(a).map((r) => [r.tool.id, r.score].join(':')).join());
  const met = volgorde();
  const saved = PARTNERLINKS.make;
  delete PARTNERLINKS.make;
  try { assert.deepEqual(volgorde(), met); }
  finally { PARTNERLINKS.make = saved; }
  assert.doesNotMatch(readFileSync('js/lib/match.js', 'utf8'), /^\s*import[^\n]*partnerlinks/m);
  assert.doesNotMatch(readFileSync('js/lib/tools.js', 'utf8'), /pc=toolmatch|sponsored/);

  assert.match(vs, /"datePublished": "2026-10-20"/);
  assert.match(vs, /"dateModified": "2026-11-10"/);
  assert.match(vs, /bijgewerkt op 10 november 2026/);
  assert.match(auto, /"dateModified": "2026-11-12"/);
  assert.match(auto, /bijgewerkt op 12 november 2026/);
  assert.match(kh, /"dateModified": "2026-11-16"/);
  assert.match(kh, /bijgewerkt op 16 november 2026/);
  const hub = readFileSync('vergelijken/index.html', 'utf8');
  assert.match(hub, /"dateModified": "2026-11-10"/);
  assert.match(hub, /bijgewerkt op 10 november 2026/);
  const priv = readFileSync('privacy/index.html', 'utf8');
  assert.match(priv, /"dateModified": "2026-11-09"/);
  assert.match(priv, /bijgewerkt op 9 november 2026/);
  assert.match(priv, /<h2>Links naar aanbieders<\/h2>\n      <p>Klik je door naar een aanbieder of neem je daar een abonnement, dan geldt de privacyverklaring van die aanbieder\.<\/p>\n      <p>Partnerlinks worden bij de knoppen vermeld\. Sommige lopen via een affiliatenetwerk \(Daisycon of Impact\)\. Dat netwerk plaatst op zijn eigen domein een cookie of klik-ID, om vast te leggen dat je via ToolMatch kwam\. Andere partnerlinks gaan rechtstreeks naar de aanbieder \(nu Make, via een trackingcode in de link\); dan kan de aanbieder zelf op make\.com een cookie of klik-ID zetten\. Sluit je iets af, dan kunnen wij daardoor een vergoeding krijgen\. Het netwerk of de aanbieder is zelf verantwoordelijk voor die gegevens; zie het privacybeleid van <a href="https:\/\/daisycon\.com\/en\/legal-information\/privacy-policy\/" rel="noopener">Daisycon<\/a>, <a href="https:\/\/impact\.com\/privacy-policy\/" rel="noopener">Impact<\/a> en <a href="https:\/\/www\.make\.com\/en\/privacy-notice" rel="noopener">Make<\/a>\.<\/p>/);
  assert.doesNotMatch(priv, /pc=toolmatch/);
  assert.ok(sm.includes('<loc>https://toolmatch.nl/vergelijken/zapier-vs-make-vs-n8n/</loc><lastmod>2026-11-10</lastmod>'));
  assert.ok(sm.includes('<loc>https://toolmatch.nl/automatiseren-zonder-code/</loc><lastmod>2026-11-12</lastmod>'));
  assert.ok(sm.includes('<loc>https://toolmatch.nl/vergelijken/</loc><lastmod>2026-11-10</lastmod>'));
  assert.ok(sm.includes('<loc>https://toolmatch.nl/keuzehulp/</loc><lastmod>2026-11-16</lastmod>'));
  assert.ok(sm.includes('<loc>https://toolmatch.nl/privacy/</loc><lastmod>2026-11-09</lastmod>'));
  assert.ok(sm.includes('<loc>https://toolmatch.nl/partnerlinks/</loc><lastmod>2026-10-28</lastmod>'));
  assert.ok(sm.includes('<loc>https://toolmatch.nl/gids/</loc><lastmod>2026-11-10</lastmod>'));
});
