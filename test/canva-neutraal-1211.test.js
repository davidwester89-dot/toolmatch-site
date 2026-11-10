// CTA-neutralisatie (12-11-2026): Canva, Power Automate, Copilot en Power BI
// (geen open affiliate). Knoppen worden gewone bronlinks.
// Ranking, teksten en prijzen blijven gelijk. Zapier en n8n blijven ongewijzigde knoppen
// (PartnerStack-aanvraag loopt). Make-partnerlink blijft.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { match, VRAGEN } from '../js/lib/match.js';
import { TOOLS } from '../js/lib/tools.js';
import { PARTNERLINKS, PARTNERLINKS_PAGINA, uitgaand } from '../js/lib/partnerlinks.js';

const ROOT = new URL('..', import.meta.url).pathname;
const skip = /^(\.git|node_modules|scripts|test|_site)$/;
const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  if (skip.test(f)) return [];
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const rel = (f) => f.slice(ROOT.length).replace(/^\//, '');
const CTA_ATTR = /class="[^"]*\bbtn\b|role="button"|data-cta=|data-vendor=|rel="[^"]*\bsponsored\b|[?&](utm_|ref=|pc=)/i;

function anchors(src, re) {
  return [...src.matchAll(re)].map((m) => m[0]);
}

const CANVA_A = /<a\b[^>]*href="(https:\/\/(?:www\.)?canva\.com[^"]*)"[^>]*>/gi;
const PA_A = /<a\b[^>]*href="(https:\/\/www\.microsoft\.com\/nl-nl\/power-platform\/products\/power-automate[^"]*)"[^>]*>/gi;
const COPILOT_A = /<a\b[^>]*href="(https:\/\/www\.microsoft\.com\/nl-nl\/microsoft-365\/copilot\/business[^"]*)"[^>]*>/gi;
const POWERBI_A = /<a\b[^>]*href="(https:\/\/www\.microsoft\.com\/nl-nl\/power-platform\/products\/power-bi[^"]*)"[^>]*>/gi;
const PARENT_NEUTRAAL = '5e3e1e5851569898a15a6e410ddd38521187bafd';

const ZAPIER_GO = '<p class="go"><a class="btn ghost" href="https://zapier.com/" rel="noopener" target="_blank" data-vendor="zapier" data-cta="outbound" aria-label="Naar de site van Zapier (opent in een nieuw tabblad)">Naar de site van Zapier</a></p>';
const N8N_GO = '<p class="go"><a class="btn ghost" href="https://n8n.io/" rel="noopener" target="_blank" data-vendor="n8n" data-cta="outbound" aria-label="Naar de site van n8n (opent in een nieuw tabblad)">Naar de site van n8n</a></p>';

test('Canva, Power Automate, Copilot en Power BI staan niet in PARTNERLINKS en krijgen geen partner-uitgang', () => {
  const ids = ['canva', 'powerautomate', 'copilot', 'powerbi'];
  for (const id of ids) {
    assert.equal(PARTNERLINKS[id], undefined, id);
    assert.equal(PARTNERLINKS_PAGINA[id], undefined, id);
  }
  const canva = TOOLS.find((t) => t.id === 'canva');
  const pa = TOOLS.find((t) => t.id === 'powerautomate');
  const copilot = TOOLS.find((t) => t.id === 'copilot');
  const powerbi = TOOLS.find((t) => t.id === 'powerbi');
  assert.equal(canva.url, 'https://www.canva.com/');
  assert.equal(canva.prijs, 'Pro: €12 per maand; €110 per jaar voor één persoon');
  assert.equal(pa.naam, 'Power Automate');
  assert.equal(pa.url, 'https://www.microsoft.com/nl-nl/power-platform/products/power-automate');
  assert.equal(pa.prijs, 'Premium: €13,00 per gebruiker per maand bij jaarbetaling (excl. btw)');
  assert.equal(copilot.naam, 'Copilot Business');
  assert.equal(copilot.url, 'https://www.microsoft.com/nl-nl/microsoft-365/copilot/business');
  assert.equal(powerbi.naam, 'Power BI');
  assert.equal(powerbi.url, 'https://www.microsoft.com/nl-nl/power-platform/products/power-bi');
  for (const t of [canva, pa, copilot, powerbi]) {
    const o = uitgaand(t);
    assert.equal(o.partner, false, t.id);
    assert.equal(o.href, t.url, t.id);
    assert.equal(o.rel, 'noopener', t.id);
  }
});

test('ranking ongewijzigd: beeld, automatiseren, schrijven en data', () => {
  assert.deepEqual(match({ doel: 'beeld' }).map((r) => r.tool.id), ['canva', 'pitch', 'chatgpt', 'lechat']);
  assert.deepEqual(match({ doel: 'automatiseren' }).map((r) => r.tool.id), ['zapier', 'make', 'n8n', 'powerautomate']);
  assert.deepEqual(match({ doel: 'schrijven' }).map((r) => r.tool.id), ['chatgpt', 'claude', 'deepl', 'lechat', 'copilot', 'gemini']);
  assert.deepEqual(match({ doel: 'data' }).map((r) => r.tool.id), ['lookerstudio', 'powerbi', 'chatgpt', 'copilot']);
  const alle = [];
  const ks = Object.keys(VRAGEN);
  (function rec(i, a) {
    if (i === ks.length) return alle.push({ ...a });
    for (const v of VRAGEN[ks[i]]) rec(i + 1, { ...a, [ks[i]]: v });
  })(0, {});
  const volgorde = () => alle.map((a) => match(a).map((r) => r.tool.id).join());
  const basis = volgorde();
  const savedC = PARTNERLINKS.canva;
  const savedP = PARTNERLINKS.powerautomate;
  PARTNERLINKS.canva = 'https://www.canva.com/?ref=should-not-count';
  PARTNERLINKS.powerautomate = 'https://www.microsoft.com/nl-nl/power-platform/products/power-automate?ref=should-not-count';
  try { assert.deepEqual(volgorde(), basis); }
  finally {
    if (savedC === undefined) delete PARTNERLINKS.canva; else PARTNERLINKS.canva = savedC;
    if (savedP === undefined) delete PARTNERLINKS.powerautomate; else PARTNERLINKS.powerautomate = savedP;
  }
});

test('sitewide: geen Canva-CTA of sponsored Canva-link, wel neutrale bronlinks', () => {
  const files = walk(ROOT).filter((f) => /\.(html|js)$/.test(f));
  const gevonden = [];
  const fout = [];
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    const tags = anchors(src, CANVA_A);
    if (!tags.length) continue;
    gevonden.push(rel(f));
    for (const tag of tags) {
      if (CTA_ATTR.test(tag) || /Naar de site van Canva/i.test(tag)) fout.push(`${rel(f)}: ${tag}`);
    }
  }
  assert.equal(fout.join('\n'), '', fout.join('\n'));
  for (const verplicht of [
    'ai-afbeeldingen-en-ontwerp/index.html',
    'ai-presentatie-maken/index.html',
    'keuzehulp/index.html',
    'gids/canva-voor-ondernemers/index.html',
  ]) assert.ok(gevonden.includes(verplicht), 'bronlink ontbreekt in ' + verplicht);

  const ontwerp = readFileSync(join(ROOT, 'ai-afbeeldingen-en-ontwerp/index.html'), 'utf8');
  const presentatie = readFileSync(join(ROOT, 'ai-presentatie-maken/index.html'), 'utf8');
  const khJs = readFileSync(join(ROOT, 'js/keuzehulp.js'), 'utf8');
  const canvaKart = ontwerp.slice(ontwerp.indexOf('<article class="res tool" id="canva">'), ontwerp.indexOf('</article>', ontwerp.indexOf('id="canva"')));
  assert.match(canvaKart, /<p class="go"><a href="https:\/\/www\.canva\.com\/" rel="noopener">Canva<\/a><\/p>/);
  assert.doesNotMatch(canvaKart, /Naar de site van Canva|data-vendor="canva"|data-cta=|class="btn/);
  assert.match(presentatie, /<a href="https:\/\/www\.canva\.com\/" rel="noopener">Canva<\/a>/);
  assert.match(presentatie, /<a href="https:\/\/www\.microsoft\.com\/nl-nl\/microsoft-365\/copilot\/business" rel="noopener">Copilot Business<\/a>/);
  assert.doesNotMatch(presentatie, /data-vendor="copilot"/);
  assert.match(presentatie, /class="btn ghost"[^>]*data-vendor="gemini"/);
  assert.doesNotMatch(presentatie.match(/<a href="https:\/\/www\.canva\.com\/"[^>]*>/)[0], /btn|data-vendor|data-cta|sponsored/);
  assert.match(khJs, /\['canva', 'powerautomate', 'copilot', 'powerbi'\]\.includes\(t\.id\) \? `<p class="go"><a href="\$\{esc\(t\.url\)\}" rel="noopener">\$\{esc\(t\.naam\)\}<\/a><\/p>`/);
  assert.match(khJs, /Naar de site van \$\{esc\(t\.vendor \|\| t\.naam\)\}/);
});

test('Power Automate: keuzehulp-uitslag en categoriepagina zijn neutrale bronlinks, geen CTA/sponsored', () => {
  const files = walk(ROOT).filter((f) => /\.(html|js)$/.test(f));
  const fout = [];
  const gevonden = [];
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    const tags = anchors(src, PA_A);
    if (!tags.length) continue;
    gevonden.push(rel(f));
    for (const tag of tags) {
      if (CTA_ATTR.test(tag) || /Naar de site van Microsoft/i.test(tag)) fout.push(`${rel(f)}: ${tag}`);
    }
  }
  assert.equal(fout.join('\n'), '', fout.join('\n'));
  assert.ok(gevonden.includes('automatiseren-zonder-code/index.html'));
  assert.ok(gevonden.includes('keuzehulp/index.html'));

  const auto = readFileSync(join(ROOT, 'automatiseren-zonder-code/index.html'), 'utf8');
  const paKart = auto.slice(auto.indexOf('<article class="res tool" id="powerautomate">'), auto.indexOf('</article>', auto.indexOf('id="powerautomate"')));
  assert.match(paKart, /<p class="go"><a href="https:\/\/www\.microsoft\.com\/nl-nl\/power-platform\/products\/power-automate" rel="noopener">Power Automate<\/a><\/p>/);
  assert.doesNotMatch(paKart, /Naar de site van Microsoft|data-vendor="powerautomate"|data-cta=|class="btn/);
  // Bronlink naar de prijspagina blijft een gewone bron (geen knop).
  assert.match(paKart, /href="https:\/\/www\.microsoft\.com\/nl-nl\/power-platform\/products\/power-automate\/pricing" rel="noopener"/);
});


test('Copilot en Power BI: keuzehulp en kaarten zijn neutrale bronlinks, geen CTA/sponsored', () => {
  const files = walk(ROOT).filter((f) => /\.(html|js)$/.test(f));
  const fout = [];
  const gevondenC = [];
  const gevondenB = [];
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    const cTags = anchors(src, COPILOT_A);
    if (cTags.length) {
      gevondenC.push(rel(f));
      for (const tag of cTags) {
        if (CTA_ATTR.test(tag) || /Naar de site van Microsoft/i.test(tag)) fout.push(`${rel(f)}: ${tag}`);
      }
    }
    const bTags = anchors(src, POWERBI_A);
    if (bTags.length) {
      gevondenB.push(rel(f));
      for (const tag of bTags) {
        if (CTA_ATTR.test(tag) || /Naar de site van Microsoft/i.test(tag)) fout.push(`${rel(f)}: ${tag}`);
      }
    }
  }
  assert.equal(fout.join('\n'), '', fout.join('\n'));
  for (const verplicht of [
    'ai-assistenten/index.html',
    'ai-data-analyse/index.html',
    'ai-mail-en-offertes/index.html',
    'ai-presentatie-maken/index.html',
    'keuzehulp/index.html',
  ]) assert.ok(gevondenC.includes(verplicht), 'Copilot-bronlink ontbreekt in ' + verplicht);
  assert.ok(gevondenB.includes('ai-data-analyse/index.html'), 'Power BI-bronlink ontbreekt op data-analyse');
  assert.ok(gevondenB.includes('keuzehulp/index.html'), 'Power BI-bronlink ontbreekt in keuzehulp-tabel');

  const kaart = (html, id) => html.slice(html.indexOf(`<article class="res tool" id="${id}">`), html.indexOf('</article>', html.indexOf(`id="${id}"`)));
  const assistenten = readFileSync(join(ROOT, 'ai-assistenten/index.html'), 'utf8');
  const mail = readFileSync(join(ROOT, 'ai-mail-en-offertes/index.html'), 'utf8');
  const data = readFileSync(join(ROOT, 'ai-data-analyse/index.html'), 'utf8');
  const presentatie = readFileSync(join(ROOT, 'ai-presentatie-maken/index.html'), 'utf8');
  const copilotGo = /<p class="go"><a href="https:\/\/www\.microsoft\.com\/nl-nl\/microsoft-365\/copilot\/business" rel="noopener">Copilot Business<\/a><\/p>/;
  assert.match(kaart(assistenten, 'copilot'), copilotGo);
  assert.match(kaart(mail, 'copilot'), copilotGo);
  assert.match(kaart(data, 'copilot'), copilotGo);
  assert.doesNotMatch(kaart(assistenten, 'copilot'), /Naar de site van Microsoft|data-vendor="copilot"|data-cta=|class="btn/);
  assert.match(kaart(data, 'powerbi'), /<p class="go"><a href="https:\/\/www\.microsoft\.com\/nl-nl\/power-platform\/products\/power-bi" rel="noopener">Power BI<\/a><\/p>/);
  assert.doesNotMatch(kaart(data, 'powerbi'), /Naar de site van Microsoft|data-vendor="powerbi"|data-cta=|class="btn/);
  assert.match(kaart(data, 'powerbi'), /href="https:\/\/www\.microsoft\.com\/nl-nl\/power-platform\/products\/power-bi\/pricing" rel="noopener"/);
  assert.match(presentatie, /<a href="https:\/\/www\.microsoft\.com\/nl-nl\/microsoft-365\/copilot\/business" rel="noopener">Copilot Business<\/a>/);
  assert.match(presentatie, /class="btn ghost"[^>]*data-vendor="gemini"/);
});

test('Zapier- en n8n-knoppen blijven byte-gelijk (PartnerStack loopt); Make-partnerlink blijft', () => {
  const auto = readFileSync(join(ROOT, 'automatiseren-zonder-code/index.html'), 'utf8');
  const vs = readFileSync(join(ROOT, 'vergelijken/zapier-vs-make-vs-n8n/index.html'), 'utf8');
  const khJs = readFileSync(join(ROOT, 'js/keuzehulp.js'), 'utf8');
  const parentVs = execFileSync('git', ['show', `${PARENT_NEUTRAAL}:vergelijken/zapier-vs-make-vs-n8n/index.html`], { cwd: ROOT, encoding: 'utf8' });
  const parentAuto = execFileSync('git', ['show', `${PARENT_NEUTRAAL}:automatiseren-zonder-code/index.html`], { cwd: ROOT, encoding: 'utf8' });
  const zapierParent = (parentAuto.match(/<p class="go"><a class="btn ghost" href="https:\/\/zapier\.com\/"[^<]+<\/a><\/p>/) || [])[0];
  const n8nParent = (parentAuto.match(/<p class="go"><a class="btn ghost" href="https:\/\/n8n\.io\/"[^<]+<\/a><\/p>/) || [])[0];
  assert.equal(zapierParent, ZAPIER_GO);
  assert.equal(n8nParent, N8N_GO);
  assert.ok(auto.includes(ZAPIER_GO), 'Zapier-knop op /automatiseren-zonder-code/ gewijzigd');
  assert.ok(auto.includes(N8N_GO), 'n8n-knop op /automatiseren-zonder-code/ gewijzigd');
  assert.equal((auto.match(/data-vendor="zapier"/g) || []).length, 1);
  assert.equal((auto.match(/data-vendor="n8n"/g) || []).length, 1);
  // Hele vergelijkingspagina blijft byte-gelijk aan de parent (alleen Make-CTA + bronlinks; geen Power Automate).
  assert.equal(vs, parentVs);
  assert.match(vs, /pc=toolmatch/);
  assert.match(vs, /"dateModified": "2026-11-10"/);
  // Keuzehulp bouwt voor Zapier en n8n nog steeds de gewone uitslagknop (geen uitzondering).
  assert.doesNotMatch(khJs, /t\.id === 'zapier'|t\.id === 'n8n'|includes\('zapier'|includes\('n8n'/);
  assert.equal(PARTNERLINKS.zapier, undefined);
  assert.equal(PARTNERLINKS.n8n, undefined);
  assert.equal(PARTNERLINKS.make, 'https://www.make.com/en/register?pc=toolmatch');
});

test('L7 12-11: nieuwe en eerdere neutraal-pagina\'s; gids, /gids/ en vs-Make blijven 10-11', () => {
  const sm = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8');
  for (const p of ['/ai-afbeeldingen-en-ontwerp/', '/ai-presentatie-maken/', '/keuzehulp/', '/automatiseren-zonder-code/', '/ai-assistenten/', '/ai-data-analyse/', '/ai-mail-en-offertes/']) {
    assert.ok(sm.includes(`<loc>https://toolmatch.nl${p}</loc><lastmod>2026-11-12</lastmod>`), p);
  }
  for (const p of ['/gids/canva-voor-ondernemers/', '/gids/', '/vergelijken/zapier-vs-make-vs-n8n/', '/vergelijken/']) {
    assert.ok(sm.includes(`<loc>https://toolmatch.nl${p}</loc><lastmod>2026-11-10</lastmod>`), p);
  }
  const kh = readFileSync(join(ROOT, 'keuzehulp/index.html'), 'utf8');
  assert.match(kh, /"dateModified": "2026-11-12"/);
  assert.match(kh, /bijgewerkt op 12 november 2026/);
  const a = readFileSync(join(ROOT, 'ai-afbeeldingen-en-ontwerp/index.html'), 'utf8');
  assert.match(a, /"dateModified": "2026-11-12"/);
  assert.match(a, /bijgewerkt op 12 november 2026/);
  const p = readFileSync(join(ROOT, 'ai-presentatie-maken/index.html'), 'utf8');
  assert.match(p, /"datePublished": "2026-11-03",\s*"dateModified": "2026-11-12"/);
  assert.match(p, /bijgewerkt op <time datetime="2026-11-12">12 november 2026<\/time>/);
  const auto = readFileSync(join(ROOT, 'automatiseren-zonder-code/index.html'), 'utf8');
  assert.match(auto, /"dateModified": "2026-11-12"/);
  assert.match(auto, /bijgewerkt op 12 november 2026/);
  for (const f of ['ai-assistenten/index.html', 'ai-data-analyse/index.html', 'ai-mail-en-offertes/index.html']) {
    const h = readFileSync(join(ROOT, f), 'utf8');
    assert.match(h, /"dateModified": "2026-11-12"/, f);
    assert.match(h, /bijgewerkt op 12 november 2026/, f);
  }
  const gids = readFileSync(join(ROOT, 'gids/canva-voor-ondernemers/index.html'), 'utf8');
  assert.match(gids, /"datePublished": "2026-11-10",\s*"dateModified": "2026-11-10"/);
});
