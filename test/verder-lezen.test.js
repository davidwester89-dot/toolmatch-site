import { revisieDatum, normaliseerStijl } from './nuchter-datums-helper.mjs'; // Exacte latere stijlrevisie; geen ranking- of datumgate uitgezet.
// Interne links (technische ronde 29-10): 'Verder lezen' met 3 verwante categoriepagina's, en de gidsen onderling.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const CAT = ['ai-assistenten', 'ai-tekst-schrijven', 'ai-mail-en-offertes', 'ai-notuleren', 'crm-klein-bedrijf', 'online-afspraken-plannen', 'ai-afbeeldingen-en-ontwerp', 'social-media-inplannen', 'automatiseren-zonder-code', 'ai-chatbot-website', 'ai-data-analyse'];

test('categoriepagina: blok Verder lezen met 3 gewone links naar bestaande categoriepagina\'s, niet naar zichzelf', () => {
  for (const c of CAT) {
    const t = readFileSync(`${c}/index.html`, 'utf8');
    const m = t.match(/<h2 id="verder-lezen">Verder lezen<\/h2>\s*<ul>([\s\S]*?)<\/ul>/);
    assert.ok(m, `${c}: geen Verder lezen`);
    const links = [...m[1].matchAll(/<a href="(\/[^"]+)">/g)].map((x) => x[1]);
    assert.equal(links.length, c === 'ai-tekst-schrijven' ? 4 : 3, c); // ai-tekst-schrijven: +/ai-presentatie-maken/ (techronde 5-11)
    assert.equal(new Set(links).size, links.length, c);
    for (const u of links) {
      assert.notEqual(u, `/${c}/`, c);
      assert.ok(existsSync(`${u.slice(1)}index.html`), `${c}: ${u} bestaat niet`);
    }
    assert.doesNotMatch(m[1], /rel=/, `${c}: interne links zonder rel`);
  }
});

test('gidsen: ai-veilig-gebruiken en ai-beleid-opstellen linken naar het stappenplan en de voorbeeldprompts', () => {
  for (const g of ['gids/ai-veilig-gebruiken', 'gids/ai-beleid-opstellen']) {
    const t = readFileSync(`${g}/index.html`, 'utf8');
    assert.match(t, /<a href="\/gids\/ai-gebruiken-in-je-bedrijf\/">/, g);
    assert.match(t, /<a href="\/gids\/prompts-voor-ondernemers\/">/, g);
  }
  assert.match(readFileSync('gids/ai-veilig-gebruiken/index.html', 'utf8'), /<a href="\/vergelijken\/zapier-vs-make-vs-n8n\/">Zapier, Make of n8n<\/a>/);
});

test('L7 29-10: de 13 gewijzigde pagina\'s hebben dateModified, sitemap-lastmod en zichtbaar bijgewerkt op 29 oktober 2026', () => {
  const sm = readFileSync('sitemap.xml', 'utf8');
  // De categoriepagina's zijn op 30-10 opnieuw bijgewerkt (Notuly, logo's van aanbieders); die datum test test/logos.test.js.
  // gids/ai-veilig-gebruiken is op 30-10 opnieuw bijgewerkt (NL-IP-prijscheck, bronnen bekeken); die datum test test/prijscheck.test.js.
  for (const p of ['gids/ai-beleid-opstellen']) {
    const t = readFileSync(`${p}/index.html`, 'utf8');
    assert.match(t, new RegExp(`"dateModified": "${revisieDatum(`/${p}/`, '2026-10-29')}"`), p);
    assert.match(t, /<p class="note">Redactie ToolMatch · [^<]*gecontroleerd op 20 oktober 2026, bijgewerkt op 18 november 2026/, p);
    assert.ok(sm.includes(`<loc>https://toolmatch.nl/${p}/</loc><lastmod>${revisieDatum(`/${p}/`, '2026-10-29')}</lastmod>`), p);
  }
});

test('techronde 5-11: /ai-tekst-schrijven/ Verder lezen linkt naar /ai-presentatie-maken/, L7 nu 16 november 2026 (CTA neutraal)', () => {
  const t = readFileSync('ai-tekst-schrijven/index.html', 'utf8');
  assert.match(t, /<li><a href="\/ai-presentatie-maken\/">Een presentatie maken met AI<\/a><\/li>/);
  assert.match(t, /"dateModified": "2026-11-18"/);
  assert.match(t, /bijgewerkt op 18 november 2026/);
  assert.match(readFileSync('sitemap.xml', 'utf8'), /ai-tekst-schrijven\/<\/loc><lastmod>2026-11-18</);
});
