// L7 19-11: Canva-gids (privacy-URL-fix, body al in b9e47c3), Trengo-pagina's,
// plus /boekingssysteem-salon/ en inlink op /online-afspraken-plannen/.
// datePublished Canva blijft 10-11. Hub /gids/ niet tillen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const PAD = '/gids/canva-voor-ondernemers/';
const D = '2026-11-19';
const VERWACHT_1911 = new Set(['/ai-chatbot-website/', '/keuzehulp/', PAD, '/boekingssysteem-salon/', '/online-afspraken-plannen/']);

test('Canva-gids: datePublished blijft 10-11; dateModified, bijgewerkt en lastmod zijn 19-11', () => {
  const h = readFileSync('gids/canva-voor-ondernemers/index.html', 'utf8');
  assert.match(h, /"datePublished": "2026-11-10",\s*"dateModified": "2026-11-19"/);
  assert.match(h, /bijgewerkt op <time datetime="2026-11-19">19 november 2026<\/time>/);
  const sm = readFileSync('sitemap.xml', 'utf8');
  assert.ok(sm.includes(`<loc>https://toolmatch.nl${PAD}</loc><lastmod>${D}</lastmod>`));
});

test('L7 19-11: lastmod 19-11 alleen op de gewijzigde pagina’s (Canva, Trengo, salon + inlink); hub /gids/ blijft 10-11', () => {
  const sm = readFileSync('sitemap.xml', 'utf8');
  const last19 = [...sm.matchAll(/<loc>https:\/\/toolmatch\.nl([^<]*)<\/loc><lastmod>2026-11-19<\/lastmod>/g)].map((m) => m[1]);
  assert.deepEqual(last19.sort(), [...VERWACHT_1911].sort());
  assert.ok(sm.includes('<loc>https://toolmatch.nl/gids/</loc><lastmod>2026-11-10</lastmod>'));
  const hub = readFileSync('gids/index.html', 'utf8');
  assert.match(hub, /"dateModified": "2026-11-10"/);
  assert.doesNotMatch(hub, /datetime="2026-11-19"/);
});
