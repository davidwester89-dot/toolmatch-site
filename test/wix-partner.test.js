// Commerciële Wix-knop op /ai-website-maken/: officiële Impact Dutch WSB-link (ad 2152480).
// Alleen die exit. Bronnen, prijspagina, tekst, volgorde en de keuzehulp-uitslag blijven zoals ze waren.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PARTNERLINKS, PARTNERLINKS_PAGINA } from '../js/lib/partnerlinks.js';

const WIX = 'https://wix.pxf.io/c/7989613/2152480/25616?trafcat=wsb';
const html = readFileSync('ai-website-maken/index.html', 'utf8');
const HOSTINGER = 'https://jf79.net/c/?si=16780&li=1722914&wi=440699&ws=&dl=nl%2Fwebsite-maken-met-ai';

test('Wix-CTA: exacte Impact-link, disclosure, sponsored/noopener en analytics-attributen', () => {
  assert.equal(PARTNERLINKS_PAGINA.wix, WIX);
  assert.equal(PARTNERLINKS_PAGINA.hostinger, HOSTINGER);
  assert.equal(PARTNERLINKS.wix, undefined, 'Wix blijft uit de keuzehulp-partnerlinks');
  assert.equal(PARTNERLINKS.hostinger, undefined, 'Hostinger blijft uit de keuzehulp-partnerlinks');
  const cta = html.match(/<p class="go"><a class="btn ghost" href="([^"]*)" rel="([^"]*)" target="_blank" data-vendor="wix" data-cta="([^"]*)" aria-label="([^"]*)">([^<]*)<\/a><\/p>\n      <p class="pnoot">([^<]*)<\/p>/);
  assert.ok(cta, 'Wix-knop met partnerzin niet gevonden');
  assert.equal(cta[1], WIX);
  assert.equal(cta[2], 'sponsored nofollow noopener');
  assert.equal(cta[3], 'partner');
  assert.equal(cta[4], 'Naar de site van Wix (opent in een nieuw tabblad)');
  assert.equal(cta[5], 'Naar de site van Wix');
  assert.equal(cta[6], 'Sommige links zijn partnerlinks; dat verandert de volgorde nooit.');
});

test('Wix-CTA: trackinglink alleen op die knop; overige links en de volgorde blijven', () => {
  assert.equal(html.split(WIX).length - 1, 1, 'trackinglink hoort één keer op de pagina');
  assert.doesNotMatch(html, /2049257/);
  assert.doesNotMatch(readFileSync('js/lib/partnerlinks.js', 'utf8'), /2049257/);
  assert.equal(html.split('href="https://nl.wix.com/pricing"').length - 1, 3);
  assert.match(html, /href="https:\/\/nl\.wix\.com\/pricing" target="_blank" rel="noopener">prijspagina van Wix<\/a>/);
  assert.match(html, /href="https:\/\/nl\.wix\.com\/pricing" rel="noopener">Wix: Premiumpakketten/);
  assert.match(html, /href="https:\/\/www\.wix\.com\/plans" rel="noopener">Wix: Plans<\/a>/);
  assert.doesNotMatch(html, /href="https:\/\/www\.wix\.com\/"/);
  assert.match(html, /href="https:\/\/jf79\.net\/c\/\?si=16780&amp;li=1722914&amp;wi=440699&amp;ws=&amp;dl=nl%2Fwebsite-maken-met-ai" rel="sponsored nofollow noopener" target="_blank" data-vendor="hostinger" data-cta="partner"/);
  assert.match(html, /href="https:\/\/www\.jouwweb\.nl\/" rel="noopener" target="_blank" data-vendor="jouwweb" data-cta="outbound"/);
  assert.match(html, /<p class="go"><a href="https:\/\/nl\.wordpress\.org\/" rel="noopener">WordPress.org<\/a><\/p>/);
  assert.doesNotMatch(html, /data-vendor="wordpress"/);
  const ids = [...html.matchAll(/<h3 id="(hostinger|jouwweb|wix|wordpress)">/g)].map((m) => m[1]);
  assert.deepEqual(ids, ['hostinger', 'jouwweb', 'wix', 'wordpress']);
  assert.doesNotMatch(readFileSync('keuzehulp/index.html', 'utf8'), /wix\.pxf\.io/);
  assert.doesNotMatch(readFileSync('js/lib/match.js', 'utf8'), /^\s*import[^\n]*partnerlinks/m);
});

test('Wix-CTA: geen extra parameter of fragment op de trackinglink', () => {
  const u = new URL(PARTNERLINKS_PAGINA.wix);
  assert.equal(`${u.origin}${u.pathname}`, 'https://wix.pxf.io/c/7989613/2152480/25616');
  assert.deepEqual([...u.searchParams.keys()], ['trafcat']);
  assert.equal(u.searchParams.get('trafcat'), 'wsb');
  assert.equal(u.hash, '');
});

test('Wix-CTA L7: keuzehulp-datum mee, uitslagbestand ongemoeid', () => {
  const kh = readFileSync('keuzehulp/index.html', 'utf8');
  assert.match(kh, /"dateModified": "2026-11-17"/);
  assert.match(kh, /bijgewerkt op 17 november 2026/);
  assert.match(kh, /gecontroleerd op 20 oktober 2026/);
  assert.ok(readFileSync('sitemap.xml', 'utf8').includes('<loc>https://toolmatch.nl/keuzehulp/</loc><lastmod>2026-11-17</lastmod>'));
});
