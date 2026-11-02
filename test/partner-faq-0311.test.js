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

// SC-review de784e7: de keuzehulp gebruikt partnerlinks wel voor de knop onder een resultaat (js/keuzehulp.js uitgaand/metNoot),
// maar match.js leest ze nooit. Dus: 'tellen niet mee in de uitkomst', niet 'gebruikt ze niet'.
test('partner-FAQ: keuzehulp-zin klopt ook als PARTNERLINKS gevuld wordt', () => {
  const home = readFileSync('index.html', 'utf8');
  assert.doesNotMatch(home, /De keuzehulp gebruikt de partnerlinks niet/);
  assert.equal(home.split('Partnerlinks tellen niet mee in de uitkomst van de keuzehulp.').length - 1, 2, 'zichtbaar + FAQPage');
  assert.doesNotMatch(readFileSync('js/lib/match.js', 'utf8'), /^\s*import[^\n]*partnerlinks/m);
});
