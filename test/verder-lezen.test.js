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
    assert.equal(links.length, 3, c);
    assert.equal(new Set(links).size, 3, c);
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
  for (const p of [...CAT, 'gids/ai-veilig-gebruiken', 'gids/ai-beleid-opstellen']) {
    const t = readFileSync(`${p}/index.html`, 'utf8');
    assert.match(t, /"dateModified": "2026-10-29"/, p);
    assert.match(t, /<p class="note">Redactie ToolMatch · [^<]*gecontroleerd op 20 oktober 2026, bijgewerkt op 29 oktober 2026/, p);
    assert.ok(sm.includes(`<loc>https://toolmatch.nl/${p}/</loc><lastmod>2026-10-29</lastmod>`), p);
  }
});
