// Leadinfo-partnerlink (19-11, FF op 5f37cd3): bestaande knop op /websitebezoekers-herkennen/
// omgezet via PARTNERLINKS_PAGINA. Link exact: https://glp8.net/c/?si=20609&li=1873842&wi=440699&ws=&dl=
// (Daisycon 20609, media 440699, MM-OK 19-11). rel="sponsored nofollow noopener" + partnerzin.
// Albacross en Leadfeeder blijven bronlink. Geen B-tekstlink (eerste vermelding per sectie staat
// al in een claim-source, en de pagina heeft < 2 betaalde kaartpartners). Geen nieuwe plek in E-CTA A/C.
// Ranking alfabetisch ongewijzigd; match.js/tools.js ongemoeid (Leadinfo staat niet in de keuzehulp).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { PARTNERLINKS, PARTNERLINKS_PAGINA, PARTNER_NOOT } from '../js/lib/partnerlinks.js';
import { revisieDatum, revisieDatumZichtbaar, normaliseerSimplybookPrijs } from './nuchter-datums-helper.mjs';
import { zonderEcta } from './e-cta-helper.mjs';
import { zonderB, bLinks } from './e-cta-b-helper.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const PARENT = '5f37cd31f3fb97c403f22e6c4e86b3236f0500e4';
const LEADINFO = 'https://glp8.net/c/?si=20609&li=1873842&wi=440699&ws=&dl=';
const LEADINFO_AMP = LEADINFO.replace(/&/g, '&amp;');
const REL = 'sponsored nofollow noopener';
const NOOT = 'Sommige links zijn partnerlinks; dat verandert de volgorde nooit.';
const html = readFileSync('websitebezoekers-herkennen/index.html', 'utf8');

test('PARTNERLINKS_PAGINA: Leadinfo heeft de exacte Daisycon-trackinglink; niet in de keuzehulp-lijst', () => {
  assert.equal(PARTNERLINKS_PAGINA.leadinfo, LEADINFO);
  assert.equal(PARTNERLINKS.leadinfo, undefined, 'Leadinfo blijft uit PARTNERLINKS (geen tool in tools.js)');
  assert.equal(PARTNERLINKS_PAGINA.hostinger, 'https://jf79.net/c/?si=16780&li=1722914&wi=440699&ws=&dl=nl%2Fwebsite-maken-met-ai');
  assert.equal(PARTNERLINKS_PAGINA.wix, 'https://wix.pxf.io/c/7989613/2152480/25616?trafcat=wsb');
  const u = new URL(LEADINFO);
  assert.equal(`${u.origin}${u.pathname}`, 'https://glp8.net/c/');
  assert.deepEqual([...u.searchParams.entries()], [['si', '20609'], ['li', '1873842'], ['wi', '440699'], ['ws', ''], ['dl', '']]);
  assert.equal(u.hash, '');
});

test('websitebezoekers-herkennen: Leadinfo is partnerknop met rel, data-vendor, partnerzin; geen data-pos op de middenknop', () => {
  const knop = html.match(/<p class="go"><a class="btn ghost" href="([^"]*)" rel="([^"]*)" target="_blank" data-vendor="leadinfo" data-cta="partner" aria-label="([^"]*)">([^<]*)<\/a><\/p>\n      <p class="pnoot">([^<]*)<\/p>/);
  assert.ok(knop, 'Leadinfo-knop met partnerzin niet gevonden');
  assert.equal(knop[1], LEADINFO_AMP);
  assert.equal(knop[2], REL);
  assert.equal(knop[3], 'Naar de site van Leadinfo (opent in een nieuw tabblad)');
  assert.equal(knop[4], 'Naar de site van Leadinfo');
  assert.equal(knop[5], NOOT);
  assert.equal(PARTNER_NOOT, NOOT);
  assert.doesNotMatch(knop[0], /data-pos=/);
  assert.equal(zonderB(zonderEcta(html)).split(LEADINFO_AMP).length - 1, 1, 'trackinglink één keer (buiten E-CTA A/C en B)');
  assert.equal(html.split(LEADINFO_AMP).length - 1, 1, 'trackinglink komt nergens anders voor, ook niet in A/C');
});

test('websitebezoekers-herkennen: Albacross en Leadfeeder blijven bronlink; volgorde alfabetisch; geen B-link', () => {
  assert.match(html, /<p class="go"><a href="https:\/\/www\.albacross\.com\/" rel="noopener">Albacross<\/a><\/p>/);
  assert.doesNotMatch(html, /data-vendor="albacross"/);
  assert.match(html, /<p class="go"><a href="https:\/\/www\.leadfeeder\.com\/" rel="noopener">Bron: Leadfeeder<\/a><\/p>/);
  assert.doesNotMatch(html, /data-vendor="leadfeeder"/);
  const ids = [...html.matchAll(/<h3 id="(albacross|leadfeeder|leadinfo)">/g)].map((m) => m[1]);
  assert.deepEqual(ids, ['albacross', 'leadfeeder', 'leadinfo']);
  assert.equal(bLinks(html).length, 0, 'geen E-CTA-1 B-tekstlink');
  assert.doesNotMatch(html, /data-vendor="leadinfo"[^>]*data-pos=/);
  assert.doesNotMatch(zonderEcta(html), /ecta-label">Partnerlink/);
  // Bronnen en claim-sources naar leadinfo.com blijven gewone links.
  assert.match(html, /href="https:\/\/www\.leadinfo\.com\/nl\/tarieven\/" rel="noopener">Leadinfo: Tarieven</);
  assert.doesNotMatch(html, /href="https:\/\/www\.leadinfo\.com\/nl\/"/);
});

test('Leadinfo-partnerknop: alleen deze pagina; datum gelift; keuzehulp en ranking ongemoeid', () => {
  // Vaste datum sinds ee9a5be (LEADINFO_DATUM 25-11); volgt de env niet, zodat een latere push (bv. 26-11) hem niet tilt.
  const d = revisieDatum('/websitebezoekers-herkennen/', '2026-11-18');
  assert.match(html, new RegExp(`"datePublished": "2026-10-27",\\s*"dateModified": "${d}"`));
  const [y, m, day] = d.split('-');
  const zicht = `${Number(day)} ${['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'][Number(m) - 1]} ${y}`;
  assert.match(html, new RegExp(`bijgewerkt op ${zicht}`));
  assert.ok(readFileSync('sitemap.xml', 'utf8').includes(`<loc>https://toolmatch.nl/websitebezoekers-herkennen/</loc><lastmod>${d}</lastmod>`));
  assert.doesNotMatch(readFileSync('keuzehulp/index.html', 'utf8'), /glp8\.net|leadinfo/i);
  assert.doesNotMatch(readFileSync('js/lib/match.js', 'utf8'), /^\s*import[^\n]*partnerlinks/m);
  assert.equal(readFileSync(join(ROOT, 'js/lib/match.js'), 'utf8'), execFileSync('git', ['show', `${PARENT}:js/lib/match.js`], { cwd: ROOT, encoding: 'utf8' }), 'js/lib/match.js');
  assert.equal(normaliseerSimplybookPrijs(readFileSync(join(ROOT, 'js/lib/tools.js'), 'utf8')), normaliseerSimplybookPrijs(execFileSync('git', ['show', `${PARENT}:js/lib/tools.js`], { cwd: ROOT, encoding: 'utf8' })), 'js/lib/tools.js');
  assert.doesNotMatch(readFileSync('js/lib/tools.js', 'utf8'), /leadinfo/i);
});
