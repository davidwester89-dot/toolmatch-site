import { revisieDatum, normaliseerStijl } from './nuchter-datums-helper.mjs'; // Exacte latere stijlrevisie; geen ranking- of datumgate uitgezet.
// CTA-neutralisatie: Canva, Power Automate, Copilot en Power BI (12-11)
// plus twaalf vendors zonder betaalde route (16-11). Knoppen worden gewone bronlinks.
// Ranking, teksten en prijzen blijven gelijk. Lopende/aanvraagbare merken (o.a. Zapier, n8n,
// HubSpot, Make) blijven knoppen. Cal.com, Metricool, SimplyBook.me en Gemini krijgen in 17-11 een partnerlink.
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
const PARENT_NEUTRAAL = 'fdf037cb6b514f4d7170afc2cb89659d86716d62';

const ZAPIER_GO = '<p class="go"><a class="btn ghost" href="https://zapier.com/" rel="noopener" target="_blank" data-vendor="zapier" data-cta="outbound" aria-label="Naar de site van Zapier (opent in een nieuw tabblad)">Naar de site van Zapier</a></p>';
const N8N_GO = '<p class="go"><a class="btn ghost" href="https://n8n.io/" rel="noopener" target="_blank" data-vendor="n8n" data-cta="outbound" aria-label="Naar de site van n8n (opent in een nieuw tabblad)">Naar de site van n8n</a></p>';

test('Canva, Power Automate, Copilot, Power BI en de 12 vendors van 16-11 staan niet in PARTNERLINKS en krijgen geen partner-uitgang', () => {
  const ids = ['canva', 'powerautomate', 'copilot', 'powerbi', 'chatgpt', 'claude', 'lechat', 'deepl', 'lookerstudio', 'googlecloudtranslate', 'calendly', 'acuity', 'albacross', 'intercom', 'wordpress', 'notuly'];
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
  const chatgpt = TOOLS.find((t) => t.id === 'chatgpt');
  const claude = TOOLS.find((t) => t.id === 'claude');
  const lechat = TOOLS.find((t) => t.id === 'lechat');
  const deepl = TOOLS.find((t) => t.id === 'deepl');
  const looker = TOOLS.find((t) => t.id === 'lookerstudio');
  const gct = TOOLS.find((t) => t.id === 'googlecloudtranslate');
  const calendly = TOOLS.find((t) => t.id === 'calendly');
  const acuity = TOOLS.find((t) => t.id === 'acuity');
  const intercom = TOOLS.find((t) => t.id === 'intercom');
  const notuly = TOOLS.find((t) => t.id === 'notuly');
  assert.equal(chatgpt.url, 'https://chatgpt.com/');
  assert.equal(claude.url, 'https://claude.com/');
  assert.equal(lechat.url, 'https://mistral.ai/');
  assert.equal(deepl.url, 'https://www.deepl.com/');
  assert.equal(looker.url, 'https://lookerstudio.google.com/');
  assert.equal(gct.url, 'https://cloud.google.com/translate');
  assert.equal(calendly.url, 'https://calendly.com/');
  assert.equal(acuity.url, 'https://acuityscheduling.com/');
  assert.equal(intercom.url, 'https://www.intercom.com/');
  assert.equal(notuly.url, 'https://notuly.nl/');
  for (const t of [canva, pa, copilot, powerbi, chatgpt, claude, lechat, deepl, looker, gct, calendly, acuity, intercom, notuly]) {
    const o = uitgaand(t);
    assert.equal(o.partner, false, t.id);
    assert.equal(o.href, t.url, t.id);
    assert.equal(o.rel, 'noopener', t.id);
  }
});

test('ranking ongewijzigd: beeld, automatiseren, schrijven en data', () => {
  const toolsNow = readFileSync(join(ROOT, 'js/lib/tools.js'), 'utf8');
  const matchNow = readFileSync(join(ROOT, 'js/lib/match.js'), 'utf8');
  const toolsParent = execFileSync('git', ['show', `${PARENT_NEUTRAAL}:js/lib/tools.js`], { cwd: ROOT, encoding: 'utf8' });
  const matchParent = execFileSync('git', ['show', `${PARENT_NEUTRAAL}:js/lib/match.js`], { cwd: ROOT, encoding: 'utf8' });
  assert.equal(normaliseerStijl(toolsNow), normaliseerStijl(toolsParent), 'tools.js wijkt af van parent');
  assert.equal(normaliseerStijl(matchNow), normaliseerStijl(matchParent), 'match.js wijkt af van parent');
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
  assert.match(khJs, /\[([^\]]+)\]\.includes\(t\.id\) \? `<p class="go"><a href="\$\{esc\(t\.url\)\}" rel="noopener">\$\{esc\(t\.naam\)\}<\/a><\/p>`/);
  {
    const m = khJs.match(/\[([^\]]+)\]\.includes\(t\.id\) \? `<p class="go"><a href="\$\{esc\(t\.url\)\}" rel="noopener">/);
    for (const id of ['canva', 'powerautomate', 'copilot', 'powerbi', 'chatgpt', 'claude', 'lechat', 'deepl', 'lookerstudio', 'googlecloudtranslate', 'calendly', 'acuity', 'albacross', 'intercom', 'wordpress', 'notuly']) {
      assert.ok(m[1].includes(`'${id}'`), 'keuzehulp-runtime mist ' + id);
    }
  }
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

test('L7 12-11 blijft op pagina\'s zonder nieuwe bodywijziging; gids, /gids/ en vs-Make blijven 10-11', () => {
  const sm = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8');
  assert.ok(sm.includes(`<loc>https://toolmatch.nl/automatiseren-zonder-code/</loc><lastmod>2026-11-18</lastmod>`));
  for (const p of ['/gids/canva-voor-ondernemers/', '/gids/', '/vergelijken/zapier-vs-make-vs-n8n/', '/vergelijken/']) {
    assert.ok(sm.includes(`<loc>https://toolmatch.nl${p}</loc><lastmod>${revisieDatum(p, '2026-11-10')}</lastmod>`), p);
  }
  const auto = readFileSync(join(ROOT, 'automatiseren-zonder-code/index.html'), 'utf8');
  assert.match(auto, /"dateModified": "2026-11-18"/);
  assert.match(auto, /bijgewerkt op 18 november 2026/);
  const gids = readFileSync(join(ROOT, 'gids/canva-voor-ondernemers/index.html'), 'utf8');
  assert.match(gids, /"datePublished": "2026-11-10",\s*"dateModified": "2026-11-18"/);
});

test('L7 16-11: pagina\'s met nieuwe bodywijziging (12 vendors neutraal); hubs niet gelift', () => {
  const sm = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8');
  const pages = ['/ai-afbeeldingen-en-ontwerp/', '/ai-data-analyse/', '/ai-vertalen/', '/ai-tekst-schrijven/', '/ai-chatbot-website/', '/ai-notuleren/', '/ai-website-maken/', '/websitebezoekers-herkennen/'];
  for (const p of pages) {
    assert.ok(sm.includes(`<loc>https://toolmatch.nl${p}</loc><lastmod>${revisieDatum(p, '2026-11-16')}</lastmod>`), p);
  }
  const a = readFileSync(join(ROOT, 'ai-afbeeldingen-en-ontwerp/index.html'), 'utf8');
  assert.match(a, /"dateModified": "2026-11-18"/);
  assert.match(a, /bijgewerkt op 18 november 2026/);
  for (const f of ['ai-data-analyse/index.html', 'ai-vertalen/index.html', 'ai-tekst-schrijven/index.html', 'ai-chatbot-website/index.html', 'ai-notuleren/index.html']) {
    const h = readFileSync(join(ROOT, f), 'utf8');
    assert.match(h, /"dateModified": "2026-11-18"/, f);
    assert.match(h, /bijgewerkt op 18 november 2026/, f);
  }
  const site = readFileSync(join(ROOT, 'ai-website-maken/index.html'), 'utf8');
  assert.match(site, /"datePublished": "2026-10-27",\s*"dateModified": "2026-11-18"/);
  assert.match(site, /bijgewerkt op 18 november 2026/);
  const leads = readFileSync(join(ROOT, 'websitebezoekers-herkennen/index.html'), 'utf8');
  assert.match(leads, /"dateModified": "2026-11-18"/);
  assert.match(leads, /bijgewerkt op 18 november 2026/);
});

const V12 = [
  { id: 'chatgpt', re: /<a\b[^>]*href="(https:\/\/chatgpt\.com\/[^"]*)"[^>]*>/gi, pages: ['ai-afbeeldingen-en-ontwerp/index.html', 'ai-assistenten/index.html', 'ai-data-analyse/index.html', 'ai-mail-en-offertes/index.html', 'ai-tekst-schrijven/index.html', 'ai-vertalen/index.html', 'keuzehulp/index.html'], go: '<p class="go"><a href="https://chatgpt.com/" rel="noopener">ChatGPT</a></p>', label: /Naar de site van OpenAI/i },
  { id: 'claude', re: /<a\b[^>]*href="(https:\/\/claude\.com\/[^"]*)"[^>]*>/gi, pages: ['ai-assistenten/index.html', 'ai-mail-en-offertes/index.html', 'ai-tekst-schrijven/index.html', 'keuzehulp/index.html'], go: '<p class="go"><a href="https://claude.com/" rel="noopener">Claude (Anthropic)</a></p>', label: /Naar de site van Anthropic/i },
  { id: 'lechat', re: /<a\b[^>]*href="(https:\/\/mistral\.ai\/[^"]*)"[^>]*>/gi, pages: ['ai-afbeeldingen-en-ontwerp/index.html', 'ai-assistenten/index.html', 'ai-tekst-schrijven/index.html', 'ai-vertalen/index.html', 'keuzehulp/index.html'], go: '<p class="go"><a href="https://mistral.ai/" rel="noopener">Le Chat (Mistral AI)</a></p>', label: /Naar de site van Mistral AI/i },
  { id: 'deepl', re: /<a\b[^>]*href="(https:\/\/www\.deepl\.com\/[^"]*)"[^>]*>/gi, pages: ['ai-tekst-schrijven/index.html', 'ai-vertalen/index.html', 'keuzehulp/index.html'], go: '<p class="go"><a href="https://www.deepl.com/" rel="noopener">DeepL</a></p>', label: /Naar de site van DeepL/i },
  { id: 'lookerstudio', re: /<a\b[^>]*href="(https:\/\/lookerstudio\.google\.com\/[^"]*)"[^>]*>/gi, pages: ['ai-data-analyse/index.html'], go: '<p class="go"><a href="https://lookerstudio.google.com/" rel="noopener">Looker Studio</a></p>', label: /Naar de site van Google/i },
  { id: 'googlecloudtranslate', re: /<a\b[^>]*href="(https:\/\/cloud\.google\.com\/translate[^"]*)"[^>]*>/gi, pages: ['ai-vertalen/index.html'], go: '<p class="go"><a href="https://cloud.google.com/translate" rel="noopener">Google Cloud Translation</a></p>', label: /Naar de site van Google/i },
  { id: 'calendly', re: /<a\b[^>]*href="(https:\/\/calendly\.com\/[^"]*)"[^>]*>/gi, pages: ['online-afspraken-plannen/index.html'], go: '<p class="go"><a href="https://calendly.com/" rel="noopener">Calendly</a></p>', label: /Naar de site van Calendly/i },
  { id: 'acuity', re: /<a\b[^>]*href="(https:\/\/acuityscheduling\.com\/[^"]*)"[^>]*>/gi, pages: ['online-afspraken-plannen/index.html'], go: '<p class="go"><a href="https://acuityscheduling.com/" rel="noopener">Acuity Scheduling</a></p>', label: /Naar de site van Acuity Scheduling/i },
  { id: 'albacross', re: /<a\b[^>]*href="(https:\/\/www\.albacross\.com\/[^"]*)"[^>]*>/gi, pages: ['websitebezoekers-herkennen/index.html'], go: '<p class="go"><a href="https://www.albacross.com/" rel="noopener">Albacross</a></p>', label: /Naar de site van Albacross/i },
  { id: 'intercom', re: /<a\b[^>]*href="(https:\/\/www\.intercom\.com\/[^"]*)"[^>]*>/gi, pages: ['ai-chatbot-website/index.html', 'keuzehulp/index.html'], go: '<p class="go"><a href="https://www.intercom.com/" rel="noopener">Intercom</a></p>', label: /Naar de site van Intercom/i },
  { id: 'wordpress', re: /<a\b[^>]*href="(https:\/\/nl\.wordpress\.org\/[^"]*)"[^>]*>/gi, pages: ['ai-website-maken/index.html'], go: '<p class="go"><a href="https://nl.wordpress.org/" rel="noopener">WordPress.org</a></p>', label: /Naar de site van WordPress\.org/i },
  { id: 'notuly', re: /<a\b[^>]*href="(https:\/\/notuly\.nl\/[^"]*)"[^>]*>/gi, pages: ['ai-notuleren/index.html'], go: '<p class="go"><a href="https://notuly.nl/" rel="noopener">Notuly</a></p>', label: /Naar de site van Notuly/i },
];

test('twaalf vendors 16-11: keuzehulp en kaarten zijn neutrale bronlinks, geen CTA/sponsored', () => {
  const files = walk(ROOT).filter((f) => /\.(html|js)$/.test(f));
  const fout = [];
  for (const v of V12) {
    const gevonden = [];
    for (const f of files) {
      const src = readFileSync(f, 'utf8');
      const tags = anchors(src, v.re);
      if (!tags.length) continue;
      gevonden.push(rel(f));
      for (const tag of tags) {
        if (CTA_ATTR.test(tag) || v.label.test(tag)) fout.push(`${v.id} ${rel(f)}: ${tag}`);
      }
    }
    for (const verplicht of v.pages) assert.ok(gevonden.includes(verplicht), v.id + ' bronlink ontbreekt in ' + verplicht);
    if (v.go) {
      for (const verplicht of v.pages) {
        if (verplicht === 'keuzehulp/index.html') continue;
        const html = readFileSync(join(ROOT, verplicht), 'utf8');
        assert.ok(html.includes(v.go), v.id + ' go-link ontbreekt in ' + verplicht);
        assert.doesNotMatch(html, new RegExp(`data-vendor="${v.id}"`));
      }
    }
  }
  assert.equal(fout.join('\n'), '', fout.join('\n'));
});

const KEEP_VENDORS = ['zapier', 'n8n', 'make', 'hubspot', 'pipedrive', 'tidio', 'tldv', 'notta', 'jouwweb', 'zoho', 'amberscript', 'fireflies', 'trengo', 'buffer', 'hootsuite', 'pitch', 'leadinfo', 'leadfeeder', 'otter', 'hostinger', 'wix'];

test('lopende en aanvraagbare vendors: knoppen byte-gelijk aan parent; Make/Hostinger/Wix onaangeraakt', () => {
  const files = walk(ROOT).filter((f) => f.endsWith('index.html'));
  const re = new RegExp(`<a\\b[^>]*data-vendor="(${KEEP_VENDORS.join('|')})"[^>]*>[\\s\\S]*?</a>`, 'g');
  const diffs = [];
  for (const f of files) {
    const relF = rel(f);
    let parent;
    try { parent = execFileSync('git', ['show', `${PARENT_NEUTRAAL}:${relF}`], { cwd: ROOT, encoding: 'utf8' }); }
    catch { continue; }
    const now = readFileSync(f, 'utf8');
    const a = parent.match(re) || [];
    const b = now.match(re) || [];
    if (a.join('\n') !== b.join('\n')) diffs.push(relF + '\n  parent: ' + a.join(' | ') + '\n  now: ' + b.join(' | '));
  }
  assert.equal(diffs.join('\n'), '', diffs.join('\n'));
  assert.equal(PARTNERLINKS.make, 'https://www.make.com/en/register?pc=toolmatch');
  assert.equal(PARTNERLINKS_PAGINA.hostinger, 'https://jf79.net/c/?si=16780&li=1722914&wi=440699&ws=&dl=nl%2Fwebsite-maken-met-ai');
  assert.equal(PARTNERLINKS_PAGINA.wix, 'https://wix.pxf.io/c/7989613/2152480/25616?trafcat=wsb');
  const parentPl = execFileSync('git', ['show', `${PARENT_NEUTRAAL}:js/lib/partnerlinks.js`], { cwd: ROOT, encoding: 'utf8' });
  const nowPl = readFileSync(join(ROOT, 'js/lib/partnerlinks.js'), 'utf8');
  const pagina = (s) => (s.match(/export const PARTNERLINKS_PAGINA = \{[\s\S]*?\};/) || [])[0];
  assert.equal(pagina(nowPl), pagina(parentPl), 'PARTNERLINKS_PAGINA (Hostinger/Wix) ongewijzigd');
  assert.match(parentPl, /make: 'https:\/\/www\.make\.com\/en\/register\?pc=toolmatch'/);
  const auto = readFileSync(join(ROOT, 'automatiseren-zonder-code/index.html'), 'utf8');
  const parentAuto = execFileSync('git', ['show', `${PARENT_NEUTRAAL}:automatiseren-zonder-code/index.html`], { cwd: ROOT, encoding: 'utf8' });
  // De stijlronde verandert proza en bijwerkdatums, niet één link of knop.
  const allAnchors = (h) => h.match(/<a\b[^>]*>[\s\S]*?<\/a>/g) || [];
  assert.deepEqual(allAnchors(auto), allAnchors(parentAuto));
});
