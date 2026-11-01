// Externe feedback nov (TM P1): partnerlinks staan live (Hostinger op /ai-website-maken/), dus geen toekomst-tekst meer
// in de homepage-FAQ (zichtbaar + FAQPage) en op /over/. L7: zichtbare bijgewerkt-regel en lastmod 2026-11-03.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const OUD = /Er kunnen partnerlinks op de site komen|Komen er partnerlinks/;
test('partner-FAQ actueel op / en /over/', () => {
  const home = readFileSync('index.html', 'utf8'); const over = readFileSync('over/index.html', 'utf8');
  for (const h of [home, over]) assert.doesNotMatch(h, OUD);
  assert.match(home, /"name": "Verdient ToolMatch aan de tools die jullie noemen\?"[\s\S]{0,80}"text": "Soms\. Bij een deel van de knoppen staat een partnerlink/);
  assert.doesNotMatch(home.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/)[0], /<a /, 'geen HTML in FAQPage-tekst');
  assert.ok(readFileSync('ai-website-maken/index.html', 'utf8').includes('rel="sponsored nofollow noopener"'), 'de genoemde partnerlink bestaat');
  const sm = readFileSync('sitemap.xml', 'utf8');
  for (const [p, h] of [['/', home], ['/over/', over]]) {
    assert.ok(sm.includes(`<loc>https://toolmatch.nl${p}</loc><lastmod>2026-11-03</lastmod>`), p);
    assert.match(h, /bijgewerkt op 3 november 2026/, p);
  }
});
