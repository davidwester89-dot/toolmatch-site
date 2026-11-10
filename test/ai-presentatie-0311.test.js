// Nieuwe pagina /ai-presentatie-maken/ (briefing SEO wk45, pushdatum 3-11-2026). Alleen Canva, Microsoft Copilot en Google Gemini (geen Gamma).
// Bedragen letterlijk van de NL-pagina's van de aanbieders, gerenderd op 2-11-2026 vanaf een NL-IP (maand/jaar-schakelaars aangeklikt):
// canva.com/nl_nl/abonnementen/ (Pro €12 /maand, €110 /jaar; Business €17 /maand, €170 /jaar per persoon), microsoft 365 vergelijken
// (Personal €10,00/maand, €99,00/jaar; Family €13,00/maand, €129,00/jaar), copilot/business (Copilot Bedrijven €21,84 maandabonnement,
// €18,20 jaarlijkse betaling, excl. btw) en workspace pricing (Business Standard €16,20 per maand; €6,80/€13,60 met een contract van 1 jaar).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const H = readFileSync('ai-presentatie-maken/index.html', 'utf8');
const main = H.slice(H.indexOf('<main'), H.indexOf('</main>'));
const tekst = main.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');

test('ai-presentatie: title, meta, byline als Organization, één og:image', () => {
  assert.match(H, /<title>AI presentatie maken: tools en prijzen voor ondernemers<\/title>/);
  assert.match(H, /<meta name="description" content="Presentatie maken met AI\? Canva, Copilot in PowerPoint en Gemini in Google Slides naast elkaar: wat gratis kan, wat het kost en of het Nederlands kan\.">/);
  assert.match(H, /"author": \{\s*"@type": "Organization",\s*"name": "Redactie ToolMatch"/);
  assert.equal((H.match(/property="og:image"/g) || []).length, 1);
});

test('ai-presentatie: maandprijs eerst (L1), exacte bedragen, geen actieprijs zonder einddatum (L4), alleen euro', () => {
  for (const s of ['Pro: €12 per maand; €110 per jaar bij jaarbetaling', 'Business: €17 per maand; €170 per jaar bij jaarbetaling', 'Microsoft 365 Personal: €10 per maand; €99 per jaar bij jaarbetaling', '€21,84 per maand; €18,20 per maand bij jaarbetaling, excl. btw', 'Business Standard: €16,20 per maand; €13,60 per maand met een contract van 1 jaar']) assert.ok(tekst.includes(s), s);
  assert.doesNotMatch(tekst, /€ ?15,60|€ ?4,05|€ ?8,10|50% korting|\$|USD/);
  assert.doesNotMatch(tekst, /Gamma|Reddit/i);
});

test('ai-presentatie: H2-volgorde uit de briefing en interne links', () => {
  const h2 = [...main.matchAll(/<h2[^>]*>([^<]+)<\/h2>/g)].map((m) => m[1]);
  assert.deepEqual(h2, ['Wat AI wel en niet doet bij een presentatie', 'Tools naast elkaar', 'Gratis of betaald', 'In het Nederlands', 'Bedrijfsdata en privacy', 'Zo kies je', 'Veelgestelde vragen', 'Bronnen']);
  for (const l of ['/keuzehulp/', '/ai-afbeeldingen-en-ontwerp/', '/ai-assistenten/', '/vergelijken/chatgpt-vs-copilot/', '/vergelijken/chatgpt-vs-gemini/', '/gids/wat-kosten-ai-abonnementen/', '/gids/ai-veilig-gebruiken/']) assert.ok(main.includes(`href="${l}"`), l);
  assert.ok(readFileSync('ai-afbeeldingen-en-ontwerp/index.html', 'utf8').includes('href="/ai-presentatie-maken/"'), 'link terug');
  const sponsored = [...main.matchAll(/rel="([^"]*sponsored[^"]*)"/g)].map((m) => m[1]);
  assert.deepEqual(sponsored, ['sponsored nofollow noopener']);
  assert.match(main, /data-vendor="gemini"[^>]*data-cta="partner"|data-cta="partner"[^>]*data-vendor="gemini"/);
  assert.doesNotMatch(main, /data-vendor="canva"[^>]*sponsored|data-vendor="copilot"[^>]*sponsored/);
});

test('ai-presentatie: bronnen alleen naam + link, zonder datum', () => {
  const b = main.slice(main.indexOf('id="bronnen"'), main.indexOf('</ul>', main.indexOf('id="bronnen"')));
  assert.ok((b.match(/<li>/g) || []).length >= 10);
  assert.doesNotMatch(b, /bekeken op|geraadpleegd|20\d\d/);
});

test('L7: /ai-presentatie-maken/ datePublished 3-11, dateModified 17-11 (Gemini-partnerlink); ontwerp-hub blijft 16-11', () => {
  const sm = readFileSync('sitemap.xml', 'utf8');
  assert.ok(sm.includes(`<loc>https://toolmatch.nl/ai-presentatie-maken/</loc><lastmod>2026-11-18</lastmod>`));
  assert.ok(sm.includes(`<loc>https://toolmatch.nl/ai-afbeeldingen-en-ontwerp/</loc><lastmod>2026-11-18</lastmod>`), 'hub 16-11');
  assert.match(H, /"datePublished": "2026-11-03",\s*"dateModified": "2026-11-18"/);
  assert.match(H, /bijgewerkt op <time datetime="2026-11-18">18 november 2026<\/time>/);
  const a = readFileSync('ai-afbeeldingen-en-ontwerp/index.html', 'utf8');
  assert.match(a, /"dateModified": "2026-11-18"/);
  assert.match(a, /bijgewerkt op 18 november 2026/);
});
