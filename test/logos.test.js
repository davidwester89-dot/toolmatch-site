// Logo's van aanbieders (Dave 30-10): elk logo lokaal, klein, met vaste maat, lazy en decoratief (alt="", aria-hidden: de naam staat ernaast).
// Besluit Dave 30-10: elk merk toont zijn logo; alleen een merk dat om weghalen vraagt komt in ZONDER_LOGO (neutrale letter).
// Neutraal: dezelfde maat voor iedereen; logo's veranderen niets aan de volgorde, de match of de partnerlinks.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { LOGOS, ZONDER_LOGO, logoImg } from '../js/lib/logos.js';
import { TOOLS } from '../js/lib/tools.js';
import { match } from '../js/lib/match.js';

const ROOT = new URL('..', import.meta.url).pathname;
const html = execSync('git ls-files "*.html"', { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean);
const IMG = /<img class="tlogo"[^>]*>/g;

test('logo: elke tool in tools.js heeft een lokaal logo van max. 10 KB, of staat bewust in ZONDER_LOGO', () => {
  for (const t of TOOLS) {
    if (ZONDER_LOGO.has(t.id)) {
      assert.ok(!LOGOS[t.id], t.id + ' staat in ZONDER_LOGO maar heeft toch een logo');
      assert.ok(!existsSync(ROOT + 'logos/' + t.id + '.webp'), t.id + ': logobestand moet weg');
      continue;
    }
    assert.ok(LOGOS[t.id], t.id + ' heeft geen logo');
    const f = ROOT + 'logos/' + t.id + '.webp';
    assert.ok(existsSync(f), f);
    assert.ok(statSync(f).size <= 10 * 1024, f + ' is groter dan 10 KB');
  }
  for (const f of readdirSync(ROOT + 'logos')) assert.ok(LOGOS[f.replace('.webp', '')], 'los bestand ' + f);
  for (const id of ZONDER_LOGO) assert.ok(TOOLS.some((t) => t.id === id) || ['hostinger', 'wordpress'].includes(id), 'onbekende id in ZONDER_LOGO: ' + id);
});

test('logo: elk merk in de bronnenlijst heeft een richtlijn-URL of "geen merkrichtlijn gevonden" en een status', () => {
  const md = readFileSync(ROOT + 'scripts/logo-bronnen.md', 'utf8');
  for (const id of [...Object.keys(LOGOS), ...ZONDER_LOGO]) {
    const r = md.split('\n').find((l) => l.startsWith('| ' + id + '.webp |') || l.startsWith('| ' + id + ' |'));
    assert.ok(r, id + ' ontbreekt in logo-bronnen.md');
    assert.match(r, /https:\/\/|geen merkrichtlijn gevonden/, id);
    assert.match(r, /\| (logo:|GEEN LOGO:)[^|]+\|$/, id);
  }
});

test('logo: elke img is decoratief (alt="" en aria-hidden), vaste width/height, lazy, en het bestand bestaat', () => {
  let n = 0;
  for (const f of html) {
    for (const [tag] of readFileSync(ROOT + f, 'utf8').matchAll(IMG)) {
      n++;
      assert.match(tag, / alt="" aria-hidden="true"/, f + ' ' + tag);
      assert.match(tag, / width="(24|32)" height="\1"/, f + ' ' + tag);
      assert.match(tag, / loading="lazy"/, f + ' ' + tag);
      const src = tag.match(/ src="\/logos\/([a-z0-9]+)\.webp"/);
      assert.ok(src && existsSync(ROOT + 'logos/' + src[1] + '.webp'), f + ' ' + tag);
      assert.ok(!ZONDER_LOGO.has(src[1]), f + ': logo van ' + src[1] + ' mag niet');
    }
  }
  assert.ok(n >= 100, 'te weinig logo\'s: ' + n);
});

test('logo: categoriepagina\'s hebben een logo of de neutrale letter bij elke tool in de tabel en bij elke kaart', () => {
  for (const f of html.filter((x) => readFileSync(ROOT + x, 'utf8').includes('<article class="res tool"'))) {
    const h = readFileSync(ROOT + f, 'utf8');
    const rijen = [...h.matchAll(/<tr><th scope="row"><a href="#[^"]+">(<img class="tlogo"[^>]*>|<span class="tlogo tlogo-f"[^>]*>[^<]<\/span>)?/g)];
    assert.ok(rijen.length >= 2, f);
    for (const r of rijen) assert.ok(r[1], f + ': rij zonder logo');
    for (const k of h.matchAll(/<article class="res tool" id="[^"]+">\s*<h3>(<img class="tlogo"[^>]*>|<span class="tlogo tlogo-f"[^>]*>[^<]<\/span>)?/g)) assert.ok(k[1], f + ': kaart zonder logo');
  }
});

test('logo: geen score- of sterrenicoontjes', () => {
  for (const f of html) assert.doesNotMatch(readFileSync(ROOT + f, 'utf8'), /class="[^"]*(star|rating|score)[^"]*"|★|☆/, f);
});

test('logo: de match (match.js) leest de logo\'s nooit', () => {
  assert.doesNotMatch(readFileSync(ROOT + 'js/lib/match.js', 'utf8'), /logos/);
  assert.equal(typeof match, 'function');
});

test('logo: ZONDER_LOGO is leeg (besluit Dave 30-10: alle merken met logo, weghalen alleen op verzoek van het merk)', () => {
  assert.equal(ZONDER_LOGO.size, 0);
  for (const t of TOOLS) assert.ok(LOGOS[t.id], t.id);
});

test('logo: fallback is een neutrale letter in hetzelfde vak', () => {
  assert.equal(logoImg('bestaatniet', { px: 24, naam: 'Voorbeeld' }), '<span class="tlogo tlogo-f" style="width:24px;height:24px" aria-hidden="true">V</span>');
  assert.match(logoImg('notuly'), /^<img class="tlogo" src="\/logos\/notuly.webp" alt="" aria-hidden="true" width="24" height="24" loading="lazy"/);
  for (const id of ZONDER_LOGO) assert.match(logoImg(id, { naam: 'X' }), /^<span class="tlogo tlogo-f"/, id);
});

test('L7 30-10: de 19 pagina\'s met logo\'s en /keuzehulp/ hebben dateModified, sitemap-lastmod en zichtbaar bijgewerkt op 30 oktober 2026', () => {
  const sm = readFileSync(ROOT + 'sitemap.xml', 'utf8');
  const P = ['ai-afbeeldingen-en-ontwerp', 'ai-assistenten', 'ai-chatbot-website', 'ai-data-analyse', 'ai-mail-en-offertes', 'ai-notuleren', 'ai-tekst-schrijven', 'ai-vertalen', 'automatiseren-zonder-code', 'crm-klein-bedrijf', 'online-afspraken-plannen', 'social-media-inplannen', 'gids/wat-kosten-ai-abonnementen', 'vergelijken/chatgpt-vs-claude', 'vergelijken/chatgpt-vs-copilot', 'vergelijken/chatgpt-vs-gemini', 'vergelijken/zapier-vs-make-vs-n8n', 'ai-website-maken', 'websitebezoekers-herkennen', 'keuzehulp'];
  for (const p of P) {
    const t = readFileSync(ROOT + p + '/index.html', 'utf8');
    assert.match(t, /"dateModified": "2026-10-30"/, p);
    assert.doesNotMatch(t, /"dateModified": "2026-10-(2\d)"/, p);
    assert.match(t, /<p class="note">Redactie ToolMatch · [^<]*bijgewerkt op 30 oktober 2026/, p);
    assert.ok(sm.includes(`<loc>https://toolmatch.nl/${p}/</loc><lastmod>2026-10-30</lastmod>`), p);
  }
});
