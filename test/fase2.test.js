// Fase 2: categoriepagina's, vergelijkingen, gidsen. Draait na de build uit site.test.js (die bouwt eerst).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
execSync('python3 scripts/build.py', { cwd: ROOT });
const file = (p) => join(ROOT, p === '/' ? 'index.html' : p.replace(/^\//, '') + 'index.html');
const read = (p) => readFileSync(file(p), 'utf8');
const LINKS = JSON.parse(readFileSync(join(ROOT, 'test/links.json'), 'utf8'));
const CATS = ['/ai-assistenten/', '/ai-tekst-schrijven/', '/ai-mail-en-offertes/', '/ai-notuleren/', '/crm-klein-bedrijf/', '/online-afspraken-plannen/', '/ai-afbeeldingen-en-ontwerp/', '/social-media-inplannen/', '/automatiseren-zonder-code/', '/ai-chatbot-website/', '/ai-data-analyse/', '/ai-vertalen/'];
const VS = ['/vergelijken/chatgpt-vs-copilot/', '/vergelijken/chatgpt-vs-gemini/', '/vergelijken/chatgpt-vs-claude/', '/vergelijken/zapier-vs-make-vs-n8n/'];
const GIDS = ['/gids/ai-gebruiken-in-je-bedrijf/', '/gids/ai-veilig-gebruiken/', '/gids/ai-act-ondernemers/', '/gids/ai-beleid-opstellen/', '/gids/wat-kosten-ai-abonnementen/', '/gids/prompts-voor-ondernemers/'];
const ALL = [...CATS, ...VS, ...GIDS, '/vergelijken/', '/gids/'];
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); if (/^(\.git|node_modules|scripts|test|_site)$/.test(f)) return []; return statSync(p).isDirectory() ? walk(p) : [p]; });
const pages = walk(ROOT).filter((f) => f.endsWith('.html') && !/google[0-9a-f]+\.html$/.test(f));
const ld = (h) => [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => JSON.parse(m[1])['@graph'] || []);
const strip = (s) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim().toLowerCase();

test('alle fase-2-pagina’s bestaan en staan in de sitemap', () => {
  const sm = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8');
  for (const p of ALL) { assert.ok(existsSync(file(p)), p); assert.ok(sm.includes(`<loc>https://toolmatch.nl${p}</loc>`), p); }
});

test('interne links uit het linkplan staan op de pagina, met het geplande anker', () => {
  for (const [van, naar, anker] of LINKS) {
    if (naar.startsWith('(')) continue;
    if (!existsSync(file(naar))) continue; // pagina nog niet gebouwd: dan ook geen link
    const h = read(van);
    const as = [...h.matchAll(new RegExp(`<a href="${naar.replace(/[/]/g, '\\/')}">([\\s\\S]*?)</a>`, 'g'))].map((m) => strip(m[1]));
    assert.ok(as.some((a) => a.includes(strip(anker))), `${van} → ${naar} "${anker}" (gevonden: ${as.join(' | ') || 'geen'})`);
  }
  for (const p of VS) assert.ok(read('/vergelijken/').includes(`href="${p}"`), p);
  for (const p of GIDS) assert.ok(read('/gids/').includes(`href="${p}"`), p);
  const kh = readFileSync(join(ROOT, 'js/keuzehulp.js'), 'utf8');
  for (const p of ['/ai-tekst-schrijven/', '/ai-notuleren/', '/ai-chatbot-website/', '/automatiseren-zonder-code/', '/ai-afbeeldingen-en-ontwerp/', '/ai-data-analyse/']) assert.ok(kh.includes(`'${p}'`), 'keuzehulp → ' + p);
});

test('geen interne link naar een pagina die niet bestaat', () => {
  for (const f of pages) for (const m of readFileSync(f, 'utf8').matchAll(/href="(\/[^"#?]*)/g)) {
    const p = m[1];
    if (/\.(css|svg|png|xml|txt|woff2|js)$/.test(p)) continue;
    assert.ok(existsSync(file(p.endsWith('/') ? p : p + '/')) || existsSync(join(ROOT, p)), `${f} → ${p}`);
  }
});

test('categoriepagina: minstens 3 tools, elk met prijs, bron en datum', () => {
  for (const p of CATS) {
    const h = read(p);
    const kaarten = h.split('<article class="res tool"').slice(1);
    assert.ok(kaarten.length >= 3, p);
    for (const k of kaarten) {
      assert.ok(/Betaald vanaf<\/dt><dd>(?!Niet gecontroleerd)/.test(k), p + ' prijs');
      assert.ok(/<p class="src">Bron: <a href="https:\/\//.test(k) && /gecontroleerd op \d+ \w+ 2026/.test(k), p + ' bron/datum');
      assert.ok(/Verwerkersovereenkomst<\/dt>/.test(k) && /Nederlands<\/dt>/.test(k) && /Gegevens<\/dt>/.test(k), p + ' velden');
    }
    for (const s of ['id="zo-kies-je"', 'id="faq"', 'id="bronnen"']) assert.ok(h.includes(s), p + ' ' + s);
  }
});

test('categoriepagina: tools op alfabetische volgorde (Nederlandse sortering), ook in de tabel en ItemList', () => {
  const col = new Intl.Collator('nl', { sensitivity: 'base' });
  for (const p of CATS) {
    const h = read(p);
    const h3 = [...h.matchAll(/<article class="res tool" id="[^"]+">\s*<h3>([^<]+)<\/h3>/g)].map((m) => m[1].replace(/&amp;/g, '&'));
    assert.ok(h3.length >= 3, p);
    assert.deepEqual(h3, [...h3].sort(col.compare), p + ': ' + h3.join(', '));
    const rij = [...h.split('id="overzicht"')[1].split('</table>')[0].matchAll(/<th scope="row"><a href="#[^"]+">([^<]+)<\/a>/g)].map((m) => m[1].replace(/&amp;/g, '&'));
    assert.deepEqual(rij, h3, p + ' tabel');
    const il = ld(h).find((n) => n['@type'] === 'ItemList').itemListElement.map((x) => x.name);
    assert.deepEqual(il, h3, p + ' ItemList');
  }
});

test('schema: juiste types per paginatype, geen reviews of ratings, FAQ zichtbaar', () => {
  const types = (p) => ld(read(p)).map((n) => n['@type']);
  for (const p of CATS) for (const t of ['CollectionPage', 'ItemList', 'BreadcrumbList', 'FAQPage']) assert.ok(types(p).includes(t), p + ' ' + t);
  for (const p of [...VS, ...GIDS]) for (const t of ['Article', 'BreadcrumbList', 'FAQPage']) assert.ok(types(p).includes(t), p + ' ' + t);
  for (const p of ['/vergelijken/', '/gids/']) for (const t of ['CollectionPage', 'ItemList', 'BreadcrumbList']) assert.ok(types(p).includes(t), p + ' ' + t);
  for (const t of ['WebPage', 'BreadcrumbList', 'FAQPage']) assert.ok(types('/keuzehulp/').includes(t), 'keuzehulp ' + t);
  for (const f of pages) assert.ok(!/"(Review|AggregateRating|Rating)"|reviewRating|ratingValue/.test(readFileSync(f, 'utf8')), f);
  for (const p of [...ALL, '/keuzehulp/']) {
    const h = read(p);
    for (const n of ld(h).filter((x) => x['@type'] === 'FAQPage')) for (const q of n.mainEntity) assert.ok(h.includes(`<summary>${q.name}</summary>`), p + ' ' + q.name);
    for (const n of ld(h).filter((x) => x['@type'] === 'ItemList')) assert.equal(n.itemListOrder, 'https://schema.org/ItemListUnordered', p);
  }
});

test('byline Redactie ToolMatch, geen tweede BoekhoudMatch-link, geen fiscale woorden op nieuwe pagina’s', () => {
  for (const p of ALL) assert.ok(read(p).includes('Redactie ToolMatch'), p);
  const bm = pages.filter((f) => readFileSync(f, 'utf8').includes('boekhoudmatch.nl'));
  assert.equal(bm.length, 1); assert.equal(bm[0].slice(ROOT.length).replace(/^\//, ''), 'index.html');
  for (const p of ALL) assert.ok(!/boekhoud|factu|aftrek/i.test(strip(read(p).split('<main')[1].split('</main>')[0])), p);
});

test('interne notities staan in .gitignore', () => {
  const gi = readFileSync(join(ROOT, '.gitignore'), 'utf8');
  assert.ok(/^PLAN-\*\.md$/m.test(gi));
});

test('vendor buttons use the vendor name (vendor field, else product name)', async () => {
  const { TOOLS } = await import('../js/lib/tools.js');
  const byId = Object.fromEntries(TOOLS.map(t => [t.id, t]));
  let n = 0;
  for (const f of readdirSync(ROOT, { recursive: true }).filter(f => f.endsWith('index.html') && !/^(node_modules|\.git)/.test(f))) {
    const h = readFileSync(join(ROOT, f), 'utf8');
    for (const m of h.matchAll(/data-vendor="([^"]+)"[^>]*>Naar de site van ([^<]+)</g)) {
      const t = byId[m[1]]; if (!t) continue;
      const want = (t.vendor || t.naam).replace(/&/g, '&amp;');
      assert.equal(m[2], want, f + ' ' + m[1]); n++;
    }
  }
  assert.ok(n > 30);
});

test('external tool buttons carry an aria-label with vendor, product and new-tab notice', async () => {
  const { TOOLS } = await import('../js/lib/tools.js');
  const byId = Object.fromEntries(TOOLS.map(t => [t.id, t]));
  const ent = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  let n = 0;
  for (const f of readdirSync(ROOT, { recursive: true }).filter(f => f.endsWith('index.html') && !/^(node_modules|\.git)/.test(f))) {
    const h = readFileSync(join(ROOT, f), 'utf8');
    for (const m of h.matchAll(/<a [^>]*data-vendor="([^"]+)"[^>]*>/g)) {
      const t = byId[m[1]]; if (!t) continue;
      assert.match(m[0], /target="_blank"/, f + ' ' + m[1]);
      const v = t.vendor || t.naam;
      const prod = t.naam.replace(` (${v})`, '');
      const want = prod.startsWith(v + ' ') ? `Naar de site van ${prod} (opent in een nieuw tabblad)` : `Naar de site van ${v}${t.vendor && prod !== v ? ` (${prod})` : ''} (opent in een nieuw tabblad)`;
      const zicht = m[0] && h.slice(h.indexOf(m[0]) + m[0].length).split('<')[0];
      assert.ok(want.startsWith(zicht), 'label-in-name: ' + zicht + ' / ' + want);
      assert.ok(!/\([^)]*\(/.test(want), 'nested parentheses: ' + want);
      assert.ok(m[0].includes(`aria-label="${ent(want)}"`), f + ' ' + m[1] + ' ' + m[0]);
      n++;
    }
  }
  assert.ok(n > 30);
  const kh = readFileSync(join(ROOT, 'js/keuzehulp.js'), 'utf8');
  assert.match(kh, /aria-label="\$\{esc\(knopLabel\(t\)\)\}"/);
  assert.match(kh, /target="_blank" aria-label="\$\{esc\(n2\)\} \(opent in een nieuw tabblad\)"/);
  const lbl = { hubspot: 'Naar de site van HubSpot CRM (opent in een nieuw tabblad)', zoho: 'Naar de site van Zoho CRM (opent in een nieuw tabblad)', googlecloudtranslate: 'Naar de site van Google Cloud Translation (opent in een nieuw tabblad)', powerbi: 'Naar de site van Microsoft (Power BI) (opent in een nieuw tabblad)' };
  const all = readdirSync(ROOT, { recursive: true }).filter(f => f.endsWith('index.html') && !/^(node_modules|\.git)/.test(f)).map(f => readFileSync(join(ROOT, f), 'utf8')).join('');
  for (const [id, l] of Object.entries(lbl)) assert.ok(all.includes(`data-vendor="${id}"`) && all.includes(`aria-label="${l}"`), id);
});
