// Nieuwe pagina /zakelijk-e-mailadres-aanmaken/ (briefing Blogschrijver wk48, push vr 27-11-2026).
// Bedragen van workspace.google.com/intl/nl/pricing en microsoft.com/nl-nl (bekeken 23-11-2026). Partner: alleen de bestaande
// Google Workspace-reflink (gemini), zonder target=_blank; Microsoft 365 alleen als bronlink; geen Hostinger. E-CTA-1: alleen keuzehulp.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PARTNERLINKS } from '../js/lib/partnerlinks.js';
const P = '/zakelijk-e-mailadres-aanmaken/';
const D = '2026-11-27';
const h = readFileSync('zakelijk-e-mailadres-aanmaken/index.html', 'utf8');
const main = h.slice(h.indexOf('<main'), h.indexOf('</main>'));

test('zakelijk e-mailadres: title, meta, H2-opbouw en byline', () => {
  const title = h.match(/<title>([^<]+)<\/title>/)[1];
  assert.equal(title, 'Zakelijk e-mailadres aanmaken met je eigen domein');
  assert.ok(title.length <= 60);
  const meta = h.match(/<meta name="description" content="([^"]+)"/)[1];
  assert.ok(meta.length >= 120 && meta.length <= 155, String(meta.length));
  const h2 = [...main.matchAll(/<h2[^>]*>([^<]+)<\/h2>/g)].map((m) => m[1]);
  for (const t of ['Wat je nodig hebt', 'Google Workspace, Microsoft 365 of mail bij je hosting', 'Gratis zakelijk e-mailadres: wat kan wel en niet', 'Stap voor stap', 'In Gmail of Outlook zetten', 'Mailadressen van medewerkers en AVG', 'Bronnen']) assert.ok(h2.includes(t), t);
  assert.match(main, /Redactie ToolMatch · bijgewerkt op <time datetime="2026-11-27">27 november 2026<\/time>/);
  assert.match(h, /"name": "Redactie ToolMatch"/);
  assert.doesNotMatch(main, /\bvolgens\b|\baldus\b/i);
});

test('zakelijk e-mailadres: L7 nieuw op 27-11; inlink op /ai-mail-en-offertes/ tilt die pagina mee', () => {
  const sm = readFileSync('sitemap.xml', 'utf8');
  assert.match(sm, new RegExp(`<loc>https://toolmatch\\.nl${P}</loc><lastmod>${D}</lastmod>`));
  assert.match(h, /"datePublished": "2026-11-27",\s*"dateModified": "2026-11-27"/);
  const m = readFileSync('ai-mail-en-offertes/index.html', 'utf8');
  assert.match(m, /<a href="\/zakelijk-e-mailadres-aanmaken\/">zakelijk e-mailadres aanmaakt<\/a>/);
  assert.match(sm, /<loc>https:\/\/toolmatch\.nl\/ai-mail-en-offertes\/<\/loc><lastmod>2026-11-27<\/lastmod>/);
  assert.match(m, /"dateModified": "2026-11-27"/);
  assert.match(m, /bijgewerkt op 27 november 2026/);
  // Hubs en de gelinkte pagina's tillen niet mee (geen eigen bodywijziging).
  for (const p of ['/gids/', '/vergelijken/', '/keuzehulp/', '/crm-klein-bedrijf/', '/ai-website-maken/']) assert.doesNotMatch(sm, new RegExp(`<loc>https://toolmatch\\.nl${p.replace(/\//g, '\\/')}</loc><lastmod>${D}</lastmod>`), p);
});

test('zakelijk e-mailadres: bedragen, interne links en partnerregels', () => {
  for (const s of ['€ 6,80', '€ 8,10', '€ 13,60', '€ 16,20', '€ 6,07', '€ 7,28', '14 dagen', 'smtp.google.com', '72 uur']) assert.ok(main.includes(s), s);
  for (const l of ['/ai-website-maken/', '/ai-mail-en-offertes/', '/crm-klein-bedrijf/', '/vergelijken/chatgpt-vs-copilot/', '/vergelijken/chatgpt-vs-gemini/', '/gids/wat-kosten-ai-abonnementen/', '/keuzehulp/']) assert.ok(main.includes(`href="${l}"`), l);
  const sponsored = [...main.matchAll(/<a\b[^>]*rel="sponsored nofollow noopener"[^>]*>/g)].map((x) => x[0]);
  assert.equal(sponsored.length, 1);
  assert.ok(sponsored[0].includes(`href="${PARTNERLINKS.gemini}"`));
  assert.doesNotMatch(sponsored[0], /target=/);
  assert.equal((main.match(/class="pnoot"/g) || []).length, 1);
  assert.match(main, /<a href="https:\/\/www\.microsoft\.com\/nl-nl\/microsoft-365\/business\/microsoft-365-business-basic" rel="noopener">Bron: Microsoft 365 Business Basic<\/a>/);
  assert.doesNotMatch(h, /hostinger|jf79\.net|<iframe/i);
  assert.doesNotMatch(main, /kortingscode|promocode|30% korting/i);
  // E-CTA-1: alleen de bestaande keuzehulp-blokken (fallback), geen partnerkaarten.
  const ecta = [...main.matchAll(/<aside class="(ecta[^"]*)"/g)].map((x) => x[1]);
  assert.deepEqual(ecta, ['ecta ecta-a ecta-fallback', 'ecta ecta-c ecta-fallback']);
});
