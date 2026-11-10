// Nieuwe gids /gids/canva-voor-ondernemers/ (SEO-refresh wk46, pushdatum 10-11-2026).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const H = readFileSync('gids/canva-voor-ondernemers/index.html', 'utf8');
const main = H.slice(H.indexOf('<main'), H.indexOf('</main>'));
const tekst = main.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');

test('canva-ondernemers: title, meta, byline Organization, één og:image', () => {
  assert.match(H, /<title>Canva voor ondernemers: Free vs Pro en prijzen<\/title>/);
  assert.match(H, /<meta name="description" content="Canva Free vs Pro voor zzp’ers: templates, merkkit, prijzen in euro van Canva, en wanneer Copilot of Gemini genoeg is voor social en presentaties\.">/);
  assert.match(H, /"author": \{\s*"@type": "Organization",\s*"name": "Redactie ToolMatch"/);
  assert.equal((H.match(/property="og:image"/g) || []).length, 1);
  assert.ok(H.includes('<link rel="canonical" href="https://toolmatch.nl/gids/canva-voor-ondernemers/">'));
});

test('canva-ondernemers: maandprijs eerst (L1), exacte bedragen, alleen euro, geen actie zonder einddatum', () => {
  for (const s of ['€12 per maand', '€110 per jaar', '€17 per maand per persoon', '€170 per jaar per persoon', '12 × €12 = €144', '2 × €17 × 12 = €408', '2 × €170 = €340']) {
    assert.ok(tekst.includes(s), s);
  }
  // Maand vóór jaar in dezelfde zin/rij voor Pro
  const iM = tekst.indexOf('€12 per maand');
  const iJ = tekst.indexOf('€110 per jaar');
  assert.ok(iM >= 0 && iJ > iM, 'maandprijs vóór jaarprijs');
  assert.doesNotMatch(tekst, /\$|USD|dollar/i);
  assert.doesNotMatch(main, /sponsored|disclaimer|Wester/i);
});

test('canva-ondernemers: H2-volgorde SEO-pack en interne links', () => {
  const h2 = [...main.matchAll(/<h2[^>]*id="[^"]*"[^>]*>([^<]+)<\/h2>|<h2[^>]*>([^<]+)<\/h2>/g)].map((m) => m[1] || m[2]);
  assert.deepEqual(h2, [
    'Free vs Pro: wat je als zzp’er merkt',
    'Voor welke klussen',
    'Prijzen in euro',
    'Privacy en bedrijfsdata',
    'Wanneer Copilot of Gemini genoeg is',
    'Zo kies je',
    'Veelgestelde vragen',
    'Bronnen',
  ]);
  for (const l of ['/keuzehulp/', '/ai-afbeeldingen-en-ontwerp/', '/ai-presentatie-maken/', '/gids/wat-kosten-ai-abonnementen/', '/gids/ai-veilig-gebruiken/', '/vergelijken/chatgpt-vs-copilot/', '/vergelijken/chatgpt-vs-gemini/']) {
    assert.ok(main.includes(`href="${l}"`), l);
  }
});

test('canva-ondernemers: alleen feitelijke Canva-bronlinks, geen commerciële CTA of aanbeveling', () => {
  const b = main.slice(main.indexOf('id="bronnen"'), main.indexOf('</ul>', main.indexOf('id="bronnen"')));
  assert.ok(b.includes('https://www.canva.com/nl_nl/abonnementen/'));
  assert.doesNotMatch(b, /bekeken op|geraadpleegd|20\d\d/);
  assert.doesNotMatch(main, /rel="sponsored/);
  const canvaLinks = [...main.matchAll(/<a\b[^>]*href="(https:\/\/www\.canva\.com[^"]*)"[^>]*>/g)];
  assert.deepEqual(canvaLinks.map((m) => m[1]), [
    'https://www.canva.com/nl_nl/abonnementen/',
    'https://www.canva.com/nl_nl/policies/privacy-policy/',
  ]);
  for (const [tag] of canvaLinks) assert.doesNotMatch(tag, /class=|role="button"|data-cta=|data-vendor=/);
  assert.doesNotMatch(main, /Naar de site van Canva|data-vendor="canva"|Begin bij Gratis|Kies Pro|Kies Business|Gratis om te testen|dan is Canva de ontwerptool/);
});

test('L7 10-11: nieuwe gids en hub /gids/ blijven 10-11; ontwerp-hub en keuzehulp later 12-11 (Canva-CTA neutraal)', () => {
  const sm = readFileSync('sitemap.xml', 'utf8');
  for (const p of ['/gids/canva-voor-ondernemers/', '/gids/']) {
    assert.ok(sm.includes(`<loc>https://toolmatch.nl${p}</loc><lastmod>2026-11-18</lastmod>`), p);
  }
  assert.match(H, /"datePublished": "2026-11-10",\s*"dateModified": "2026-11-18"/);
  assert.match(H, /bijgewerkt op <time datetime="2026-11-18">18 november 2026<\/time>/);
  const hub = readFileSync('gids/index.html', 'utf8');
  assert.ok(hub.includes('href="/gids/canva-voor-ondernemers/"'));
  assert.match(hub, /"dateModified": "2026-11-18"/);
  const a = readFileSync('ai-afbeeldingen-en-ontwerp/index.html', 'utf8');
  assert.ok(a.includes('href="/gids/canva-voor-ondernemers/"'));
});
